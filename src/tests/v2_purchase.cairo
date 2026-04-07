// Integration tests for the v2 purchase contract.
//
// Boots a real dojo test world with paper + hustler + purchase deployed,
// grants the necessary roles, and exercises the buy() flow end-to-end.
// These tests catch the things the unit tests in PR-1b..1d couldn't:
// cross-contract dispatch, AccessControl enforcement, dojo model writes,
// and the discount-curve catalog actually getting seeded by dojo_init.

use dojo::model::ModelStorage;
use openzeppelin::interfaces::token::erc20::IERC20DispatcherTrait;
use openzeppelin::interfaces::token::erc721::{IERC721Dispatcher, IERC721DispatcherTrait};
use rollyourown::models::hustler_instance::HustlerInstance;
use rollyourown::models::starterpack::Starterpack;
use rollyourown::systems::purchase::{IPurchaseDispatcherTrait, discount_price};
use rollyourown::tests::v2_helper::{BUYER, OWNER, fund_buyer, spawn_v2};
use starknet::testing::set_contract_address;

#[test]
fn test_dojo_init_seeds_four_packs() {
    // PR-1d's purchase::dojo_init writes the four canonical packs
    // (Naked / Street / Dealer / Kingpin) with the discount-curve price.
    // Verify they show up in the world after spawn.
    let (world, _systems) = spawn_v2();

    let naked: Starterpack = world.read_model(1_u8);
    let street: Starterpack = world.read_model(2_u8);
    let dealer: Starterpack = world.read_model(3_u8);
    let kingpin: Starterpack = world.read_model(4_u8);

    assert!(naked.id == 1, "naked id");
    assert!(naked.name == 'Naked', "naked name");
    assert!(naked.stake_multiplier == 1, "naked stake");
    assert!(naked.price_paper == discount_price(1), "naked price");
    assert!(naked.enabled, "naked enabled");

    assert!(street.id == 2, "street id");
    assert!(street.stake_multiplier == 2, "street stake");
    assert!(street.price_paper == discount_price(2), "street price");

    assert!(dealer.id == 3, "dealer id");
    assert!(dealer.stake_multiplier == 3, "dealer stake");
    assert!(dealer.price_paper == discount_price(3), "dealer price");

    assert!(kingpin.id == 4, "kingpin id");
    assert!(kingpin.stake_multiplier == 4, "kingpin stake");
    assert!(kingpin.price_paper == discount_price(4), "kingpin price");
}

#[test]
fn test_buy_happy_path_naked() {
    // End-to-end: fund the buyer with PAPER, approve the purchase
    // contract, call buy(1), verify
    //   - buyer's PAPER balance dropped by exactly price_paper
    //   - paper.total_supply() dropped by price_paper (the burn fired)
    //   - buyer owns a fresh Hustler NFT
    //   - HustlerInstance was written with the right pack id + loadout
    //   - returned token id matches the new instance
    let (world, systems) = spawn_v2();

    let pack: Starterpack = world.read_model(1_u8);
    let price = pack.price_paper.into();

    // [Setup] Fund buyer with 2x the pack price so we can verify the
    // exact debit (not just "balance went down").
    fund_buyer(systems, BUYER(), price * 2);
    let buyer_balance_before = systems.paper_erc20.balance_of(BUYER());
    let supply_before = systems.paper_erc20.total_supply();
    assert!(buyer_balance_before == price * 2, "fund worked");

    // [Effect] Buyer approves + buys.
    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, price);
    let token_id = systems.purchase.buy(1_u8);

    // [Verify] PAPER moved + burned.
    let buyer_balance_after = systems.paper_erc20.balance_of(BUYER());
    assert!(buyer_balance_after == price, "buyer paid exactly price");
    let supply_after = systems.paper_erc20.total_supply();
    assert!(supply_after == supply_before - price, "supply dropped by price (burn)");

    // [Verify] Buyer owns the new hustler.
    assert!(token_id == 1, "first mint = id 1");
    let token_id_u256: u256 = token_id.into();
    let hustler_erc721 = IERC721Dispatcher {
        contract_address: systems.hustler.contract_address,
    };
    let owner = hustler_erc721.owner_of(token_id_u256);
    assert!(owner == BUYER(), "buyer owns the hustler");

    // [Verify] HustlerInstance written with the pack's loadout.
    let instance: HustlerInstance = world.read_model(token_id);
    assert!(instance.token_id == token_id, "instance token id");
    assert!(instance.starterpack_id == 1, "from naked pack");
    assert!(instance.hustler_template_id == pack.hustler_template_id, "template");
    assert!(instance.gear_weapon == 0, "naked = empty weapon");
    assert!(instance.gear_clothes == 0, "naked = empty clothes");
    assert!(instance.gear_feet == 0, "naked = empty feet");
    assert!(instance.gear_transport == 0, "naked = empty transport");
    assert!(!instance.used, "fresh hustler is unused");
    assert!(instance.game_id == 0, "no bound game yet");
    assert!(instance.final_score == 0, "no score yet");
}

#[test]
fn test_buy_increments_token_ids() {
    // Two consecutive buys must mint sequential token ids (1 then 2),
    // even if the buyer is the same. Catches a regression where the
    // hustler contract's next_id counter doesn't persist between calls.
    let (_world, systems) = spawn_v2();

    let pack_price: u256 = discount_price(1).into();
    fund_buyer(systems, BUYER(), pack_price * 2);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, pack_price * 2);

    let first = systems.purchase.buy(1_u8);
    let second = systems.purchase.buy(1_u8);

    assert!(first == 1, "first hustler = id 1");
    assert!(second == 2, "second hustler = id 2");
}

#[test]
#[should_panic(expected: ('Purchase: pack disabled', 'ENTRYPOINT_FAILED'))]
fn test_buy_nonexistent_pack_reverts() {
    // Pack id 99 was never seeded — buying it must revert. Dojo's
    // read_model returns a default-constructed Starterpack with
    // enabled=false for missing rows, so the contract treats "missing"
    // and "disabled" as the same condition (see purchase.cairo's ERRORS
    // comment). The user-visible error is "pack disabled".
    let (_world, systems) = spawn_v2();
    let pack_price: u256 = discount_price(1).into();
    fund_buyer(systems, BUYER(), pack_price);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, pack_price);
    systems.purchase.buy(99_u8);
}

#[test]
#[should_panic(expected: ('Purchase: pack disabled', 'ENTRYPOINT_FAILED'))]
fn test_buy_disabled_pack_reverts() {
    // Admin disables Naked → buy(1) must revert. Verifies that
    // set_pack_enabled actually flips the flag and the buy path reads
    // it.
    let (_world, systems) = spawn_v2();

    set_contract_address(OWNER());
    systems.purchase.set_pack_enabled(1_u8, false);

    let pack_price: u256 = discount_price(1).into();
    fund_buyer(systems, BUYER(), pack_price);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, pack_price);
    systems.purchase.buy(1_u8);
}

#[test]
fn test_set_pack_enabled_round_trips() {
    // Disable then re-enable — state changes survive across calls and
    // the buy path becomes valid again after re-enabling.
    let (world, systems) = spawn_v2();

    set_contract_address(OWNER());
    systems.purchase.set_pack_enabled(1_u8, false);
    let after_disable: Starterpack = world.read_model(1_u8);
    assert!(!after_disable.enabled, "disabled");

    systems.purchase.set_pack_enabled(1_u8, true);
    let after_enable: Starterpack = world.read_model(1_u8);
    assert!(after_enable.enabled, "re-enabled");
}
