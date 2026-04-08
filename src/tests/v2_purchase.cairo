// Integration tests for the v2 purchase contract.
//
// PR-1f redesign: the contract now embeds arcade's BundleComponent and
// the buy flow is exposed via `IBundle::issue(...)` instead of the
// PR-1d `IPurchase::buy(pack_id)`. The bundle component handles ERC20
// payment + fee distribution + on_issue callback dispatch in-process —
// no external registry contract is deployed.
//
// PR-1f-followup adds:
//   - PaymentConfig round-trip via set_payment_config
//   - on_issue's Ekubo swap-and-burn path is gated on
//     PaymentConfig.ekubo_router != 0; tests leave it 0 to skip the
//     swap, so the existing issue() integration tests still verify
//     mint + HustlerInstance write semantics
//
// What these tests cover:
//   - PaymentConfig round-trip from set_payment_config (PR-1f-followup)
//   - initialize seeds 4 paid bundles and writes a Starterpack catalog
//     row keyed by each bundle id (after the post-spawn initialize)
//   - the issue flow pulls the buyer's payment token (paper, in
//     tests), dispatches into on_issue, mints a Hustler NFT, and
//     writes HustlerInstance with the right pack metadata
//   - sequential token ids across multiple issues
//   - quantity > 1 mints multiple hustlers in one call
//   - issuing a non-existent bundle id reverts via the bundle
//     component's assert_does_exist check

use bundle::interface::IBundleDispatcherTrait;
use dojo::model::ModelStorage;
use openzeppelin::interfaces::token::erc20::IERC20DispatcherTrait;
use openzeppelin::interfaces::token::erc721::{IERC721Dispatcher, IERC721DispatcherTrait};
use rollyourown::models::hustler_instance::HustlerInstance;
use rollyourown::models::payment_config::{PAYMENT_CONFIG_KEY, PaymentConfig};
use rollyourown::models::starterpack::Starterpack;
use rollyourown::systems::purchase::{BASE_PRICE_PAPER, discount_price_u256};
use rollyourown::tests::v2_helper::{BUYER, fund_buyer, spawn_v2};
use starknet::testing::set_contract_address;

/// Look up a bundle id by stake by sweeping the Starterpack catalog.
/// dojo_init's `initialize` writes a Starterpack row keyed by each
/// bundle id the bundle component returns from register, and the
/// bundle ids are uuid-allocated so the test can't predict them.
fn find_bundle_id_by_stake(world: dojo::world::WorldStorage, stake: u8) -> Option<u32> {
    let mut id: u32 = 0;
    let mut found: Option<u32> = Option::None;
    while id < 256 {
        let pack: Starterpack = world.read_model(id);
        if pack.stake_multiplier == stake && pack.hustler_template_id != 0 {
            found = Option::Some(id);
            break;
        }
        id += 1;
    };
    found
}

#[test]
fn test_payment_config_round_trips() {
    // PR-1f-followup: spawn_v2 calls set_payment_config with `paper`
    // as the USDC stand-in, ekubo_router=0 (swap path skipped), and
    // BASE_PRICE_PAPER as the discount-curve base. Verify the row was
    // actually written + reads back with the expected fields.
    let (world, systems) = spawn_v2();
    let cfg: PaymentConfig = world.read_model(PAYMENT_CONFIG_KEY);
    assert!(cfg.usdc == systems.paper_erc20.contract_address, "usdc = paper");
    assert!(cfg.ekubo_router == 0.try_into().unwrap(), "ekubo router skipped");
    assert!(cfg.base_price > 0, "base price set");
    assert!(cfg.burn_percentage == 0, "burn skipped in tests");
    assert!(cfg.treasury_percentage == 0, "treasury skipped in tests");
}

#[test]
fn test_initialize_uses_payment_config_base_price() {
    // initialize() should compute each bundle's price via the discount
    // curve against PaymentConfig.base_price. With base_price set to
    // BASE_PRICE_PAPER (the test fixture default), bundle prices
    // should match discount_price_u256(stake, BASE_PRICE_PAPER).
    let (world, systems) = spawn_v2();

    let base: u256 = BASE_PRICE_PAPER.into();

    let naked_bundle_id = find_bundle_id_by_stake(world, 1).expect('Naked bundle');
    let quote = systems.purchase.quote(naked_bundle_id, 1, false, 0);
    // total_cost == base_price for 1× quantity, no fees, no referrer.
    let expected = discount_price_u256(1, base);
    assert!(quote.total_cost == expected, "naked price = stake-1 curve");

    let kingpin_bundle_id = find_bundle_id_by_stake(world, 4).expect('Kingpin bundle');
    let kingpin_quote = systems.purchase.quote(kingpin_bundle_id, 1, false, 0);
    let kingpin_expected = discount_price_u256(4, base);
    assert!(kingpin_quote.total_cost == kingpin_expected, "kingpin = stake-4 curve");
}

#[test]
fn test_initialize_seeds_four_packs() {
    // PR-1f's purchase::initialize registers 4 paid bundles via the
    // embedded BundleComponent and writes a Starterpack row for each
    // keyed by the bundle id. Verify all four show up with the
    // expected stake_multiplier + hustler_template_id ordering.
    let (world, _systems) = spawn_v2();

    let mut found_stakes: Array<u8> = array![];
    let mut found_templates: Array<u8> = array![];
    let mut id: u32 = 0;
    while id < 256 {
        let pack: Starterpack = world.read_model(id);
        if pack.hustler_template_id != 0 {
            found_stakes.append(pack.stake_multiplier);
            found_templates.append(pack.hustler_template_id);
        }
        id += 1;
    };

    assert!(found_stakes.len() == 4, "exactly 4 packs seeded");
    assert!(*found_stakes.at(0) == 1, "first = stake 1 (Naked)");
    assert!(*found_stakes.at(1) == 2, "second = stake 2 (Street)");
    assert!(*found_stakes.at(2) == 3, "third = stake 3 (Dealer)");
    assert!(*found_stakes.at(3) == 4, "fourth = stake 4 (Kingpin)");
    assert!(*found_templates.at(0) == 1, "Naked template");
    assert!(*found_templates.at(1) == 2, "Street template");
    assert!(*found_templates.at(2) == 3, "Dealer template");
    assert!(*found_templates.at(3) == 4, "Kingpin template");
}

#[test]
fn test_issue_happy_path_naked() {
    // End-to-end: fund the buyer with payment token (paper, in
    // tests), approve the purchase contract, call issue(...) with
    // quantity=1, verify
    //   - buyer's balance dropped by exactly bundle.price
    //   - buyer owns a fresh Hustler NFT
    //   - HustlerInstance was written with the right bundle id +
    //     template + (empty) gear loadout
    let (world, systems) = spawn_v2();

    let naked_bundle_id = find_bundle_id_by_stake(world, 1).expect('Naked bundle');

    // Quote the bundle to learn the buyer's owed amount. With a 0%
    // protocol fee and no referrer this collapses to the bundle's
    // base_price.
    let quote = systems.purchase.quote(naked_bundle_id, 1, false, 0);
    let owed = quote.total_cost;

    // [Setup] Fund buyer with 2x the owed amount so we can verify the
    // exact debit.
    fund_buyer(systems, BUYER(), owed * 2);
    let buyer_balance_before = systems.paper_erc20.balance_of(BUYER());
    assert!(buyer_balance_before == owed * 2, "fund worked");

    // [Effect] Buyer approves + issues.
    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: naked_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );

    // [Verify] Payment debited.
    let buyer_balance_after = systems.paper_erc20.balance_of(BUYER());
    assert!(buyer_balance_after == owed, "buyer paid exactly owed");

    // [Verify] Buyer owns the new hustler. nothing minted before
    // initialize/issue, so the first issue mints token id 1.
    let hustler_erc721 = IERC721Dispatcher {
        contract_address: systems.hustler.contract_address,
    };
    let owner = hustler_erc721.owner_of(1_u256);
    assert!(owner == BUYER(), "buyer owns the hustler");

    // [Verify] HustlerInstance written with the pack's loadout.
    let instance: HustlerInstance = world.read_model(1_u64);
    assert!(instance.token_id == 1, "instance token id");
    assert!(instance.bundle_id == naked_bundle_id, "from naked bundle");
    assert!(instance.hustler_template_id == 1, "Naked template");
    assert!(instance.gear_weapon == 0, "naked = empty weapon");
    assert!(instance.gear_clothes == 0, "naked = empty clothes");
    assert!(instance.gear_feet == 0, "naked = empty feet");
    assert!(instance.gear_transport == 0, "naked = empty transport");
    assert!(!instance.used, "fresh hustler is unused");
    assert!(instance.game_id == 0, "no bound game yet");
    assert!(instance.final_score == 0, "no score yet");
    // PR #1: paper_burned is 0 in the test fixture path because
    // PaymentConfig.ekubo_router=0 short-circuits the swap. The new
    // PR #2 mock-router test will exercise the non-zero case.
    assert!(instance.paper_burned == 0, "no swap means no burn");
}

#[test]
fn test_issue_increments_token_ids() {
    // Two consecutive issues must mint sequential token ids (1 then
    // 2), even when the same buyer issues both. Catches a regression
    // where the hustler contract's next_id counter doesn't persist
    // between calls.
    let (world, systems) = spawn_v2();

    let naked_bundle_id = find_bundle_id_by_stake(world, 1).expect('Naked bundle');
    let quote = systems.purchase.quote(naked_bundle_id, 1, false, 0);
    let owed = quote.total_cost;

    fund_buyer(systems, BUYER(), owed * 2);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed * 2);

    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: naked_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: naked_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );

    let hustler_erc721 = IERC721Dispatcher {
        contract_address: systems.hustler.contract_address,
    };
    assert!(hustler_erc721.owner_of(1_u256) == BUYER(), "first hustler = id 1");
    assert!(hustler_erc721.owner_of(2_u256) == BUYER(), "second hustler = id 2");
}

#[test]
fn test_issue_quantity_two_mints_two_hustlers() {
    // A single issue() call with quantity=2 should mint two NFTs in
    // one transaction. Exercises the on_issue callback's quantity
    // loop.
    let (world, systems) = spawn_v2();

    let dealer_bundle_id = find_bundle_id_by_stake(world, 3).expect('Dealer bundle');
    let quote = systems.purchase.quote(dealer_bundle_id, 2, false, 0);
    let owed = quote.total_cost;

    fund_buyer(systems, BUYER(), owed);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: dealer_bundle_id,
            quantity: 2,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );

    let hustler_erc721 = IERC721Dispatcher {
        contract_address: systems.hustler.contract_address,
    };
    assert!(hustler_erc721.owner_of(1_u256) == BUYER(), "first mint");
    assert!(hustler_erc721.owner_of(2_u256) == BUYER(), "second mint");

    // Both instances point at the same bundle / template.
    let inst1: HustlerInstance = world.read_model(1_u64);
    let inst2: HustlerInstance = world.read_model(2_u64);
    assert!(inst1.bundle_id == dealer_bundle_id, "inst1 bundle");
    assert!(inst2.bundle_id == dealer_bundle_id, "inst2 bundle");
    assert!(inst1.hustler_template_id == 3, "inst1 = Dealer");
    assert!(inst2.hustler_template_id == 3, "inst2 = Dealer");
}

#[test]
#[should_panic(expected: ('Bundle: not found', 'ENTRYPOINT_FAILED'))]
fn test_issue_nonexistent_bundle_reverts() {
    // Bundle id 99999 was never registered — issuing it must revert
    // via the bundle component's `assert_does_exist`.
    let (_world, systems) = spawn_v2();
    fund_buyer(systems, BUYER(), 1_000_000_000_000_000_000_000_u256);

    set_contract_address(BUYER());
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: 99999_u32,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );
}
