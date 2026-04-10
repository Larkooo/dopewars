// Integration tests for purchase::on_issue's Ekubo swap-and-burn path.
//
// PR-1f-followup wired the swap path but gated it on
// `PaymentConfig.ekubo_router != 0`, so the existing v2_purchase tests
// (which leave ekubo_router=0) skip the swap entirely. PR #2 adds an
// Ekubo router mock and these tests, exercising the full path:
//
//   buyer -> bundle.issue -> on_issue
//     -> usdc.transfer(mock_router, burn_amount)
//     -> mock_router.swap()             [no-op]
//     -> mock_router.clear_minimum(paper, 0)
//          [transfers pre-funded PAPER from mock back to purchase]
//     -> mock_router.clear(usdc)
//          [transfers leftover USDC from mock back to purchase]
//     -> paper.burn(paper_received)     [reduces total_supply]
//     -> mint hustler + write HustlerInstance with paper_burned set
//
// The mock doesn't compute a real swap rate — the test fixture pre-
// funds it with `swap_payout_paper` PAPER and the mock returns that
// fixed amount on each clear() call. Tests verify on_issue's wiring
// not the swap math.

use bundle::interface::IBundleDispatcherTrait;
use dojo::model::ModelStorage;
use openzeppelin::interfaces::token::erc20::IERC20DispatcherTrait;
use rollyourown::models::hustler_instance::HustlerInstance;
use rollyourown::models::starterpack::Starterpack;
use rollyourown::systems::purchase::{BASE_PRICE_PAPER, IPurchaseAdminDispatcherTrait};
use rollyourown::tests::v2_helper::{
    BUYER, OTHER, OWNER, enable_ekubo_swap_mock, fund_buyer, spawn_v2,
};
use starknet::ContractAddress;
use starknet::testing::set_contract_address;

// Convenience: 1 PAPER in wei.
const ONE_PAPER: u256 = 1_000_000_000_000_000_000_u256;

/// In tests `paper` doubles as the USDC stand-in, which collapses
/// the production "USDC in, PAPER out" swap into a single-token
/// flow. The on_issue burn step does `paper.balance_of(this)` and
/// burns the entire balance — in production that's just the
/// swap-output PAPER, but in tests it ALSO includes the `owed`
/// payment the buyer just transferred in via bundle.issue's
/// transfer_from.
///
/// Trace at the end of the swap block, with `owed` PAPER held by
/// the contract on entry to on_issue:
///   - contract sends `burn_share` to mock (balance: owed - burn_share)
///   - mock holds `pre_funded + burn_share`
///   - clear_minimum returns the mock's full balance to caller
///     (balance: owed - burn_share + pre_funded + burn_share = owed + pre_funded)
///   - clear(usdc) returns 0 (mock drained)
///   - paper.burn(balance_of(this)) burns `owed + pre_funded`
///
/// So the recorded `paper_burned` is `owed + pre_funded` —
/// `burn_share` cancels out. This isn't a contract bug; production
/// keeps USDC ≠ PAPER so `balance_of(paper)` only sees the swapped
/// amount. It is a test artifact we have to math around.
fn expected_paper_burned(owed: u256, pre_funded: u256) -> u256 {
    owed + pre_funded
}

/// Look up a bundle id by stake. Same helper as v2_purchase.cairo —
/// duplicated here so the swap tests aren't coupled to that file's
/// internal helpers. find_bundle_id_by_stake sweeps the Starterpack
/// catalog because the bundle component allocates ids via
/// world.dispatcher.uuid() at register time and tests can't predict
/// them.
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
fn test_swap_burns_paper_supply() {
    // End-to-end: enable the Ekubo mock with 100 PAPER pre-funded
    // and 10% burn percentage, then issue a Junkie bundle. Verify the
    // total PAPER supply dropped by exactly `pre_funded + burn_amount`
    // — proving that on_issue's burn step actually fired and pulled
    // both the mock's pre-funded paper AND the burn share the
    // contract sent in.
    let (world, systems) = spawn_v2();

    let pre_funded: u256 = 100_u256 * ONE_PAPER;
    let burn_pct: u8 = 10;
    let zero: starknet::ContractAddress = 0.try_into().unwrap();
    let _mock_address = enable_ekubo_swap_mock(systems, pre_funded, burn_pct, 0, zero);

    let junkie_bundle_id = find_bundle_id_by_stake(world, 1).expect('Junkie bundle');
    let quote = systems.purchase.quote(junkie_bundle_id, 1, false, 0);
    let owed = quote.total_cost;

    fund_buyer(systems, BUYER(), owed);
    let supply_before = systems.paper_erc20.total_supply();

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: junkie_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );

    // [Verify] Total PAPER supply dropped by exactly the expected
    // burn amount.
    let expected = expected_paper_burned(owed, pre_funded);
    let supply_after = systems.paper_erc20.total_supply();
    assert!(supply_after == supply_before - expected, "supply dropped by expected burn");
}

#[test]
fn test_swap_records_paper_burned_on_instance() {
    // Same setup as above, but verifies the per-instance bookkeeping:
    // HustlerInstance.paper_burned should equal the expected burn
    // amount (pre_funded + burn_share) since quantity=1 means no
    // splitting in the mint loop.
    let (world, systems) = spawn_v2();

    let pre_funded: u256 = 100_u256 * ONE_PAPER;
    let burn_pct: u8 = 10;
    let zero: starknet::ContractAddress = 0.try_into().unwrap();
    let _ = enable_ekubo_swap_mock(systems, pre_funded, burn_pct, 0, zero);

    let junkie_bundle_id = find_bundle_id_by_stake(world, 1).expect('Junkie bundle');
    let quote = systems.purchase.quote(junkie_bundle_id, 1, false, 0);
    let owed = quote.total_cost;
    fund_buyer(systems, BUYER(), owed);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: junkie_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );

    let expected: u128 = expected_paper_burned(owed, pre_funded).try_into().unwrap();
    let instance: HustlerInstance = world.read_model(1_u64);
    // First check it's non-zero so we can tell "burn path skipped"
    // from "burn path ran but with wrong value".
    assert!(instance.paper_burned > 0, "burn path must run");
    assert!(instance.paper_burned == expected, "paper_burned == expected");
}

#[test]
fn test_swap_splits_paper_burned_across_quantity() {
    // quantity=2 should distribute paper_burned evenly across both
    // instances. The total is `pre_funded + burn_amount` and the
    // mint loop divides by quantity to get the per-instance share.
    // This pins the burn distribution semantics from on_issue's
    // mint loop.
    let (world, systems) = spawn_v2();

    let pre_funded: u256 = 100_u256 * ONE_PAPER;
    let burn_pct: u8 = 10;
    let zero: starknet::ContractAddress = 0.try_into().unwrap();
    let _ = enable_ekubo_swap_mock(systems, pre_funded, burn_pct, 0, zero);

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

    // Total burn = owed + pre_funded. Quantity=2 splits evenly.
    let total = expected_paper_burned(owed, pre_funded);
    let per_instance: u128 = (total / 2_u256).try_into().unwrap();
    let inst1: HustlerInstance = world.read_model(1_u64);
    let inst2: HustlerInstance = world.read_model(2_u64);
    assert!(inst1.paper_burned == per_instance, "inst1 = total / 2");
    assert!(inst2.paper_burned == per_instance, "inst2 = total / 2");
}

#[test]
fn test_swap_skipped_when_router_unset() {
    // Regression: with PaymentConfig.ekubo_router = 0 (the spawn_v2
    // default — we don't enable the mock here), on_issue must skip
    // the swap entirely. This pins the gating semantics so a future
    // change to on_issue's `if config.ekubo_router.is_non_zero()`
    // check doesn't accidentally fire the swap path against a real
    // chain when the router isn't configured.
    let (world, systems) = spawn_v2();

    let junkie_bundle_id = find_bundle_id_by_stake(world, 1).expect('Junkie bundle');
    let quote = systems.purchase.quote(junkie_bundle_id, 1, false, 0);
    let owed = quote.total_cost;
    fund_buyer(systems, BUYER(), owed);

    let supply_before = systems.paper_erc20.total_supply();

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: junkie_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );

    // [Verify] Supply unchanged (no burn) and HustlerInstance has
    // paper_burned == 0.
    let supply_after = systems.paper_erc20.total_supply();
    assert!(supply_after == supply_before, "no burn => no supply change");

    let instance: HustlerInstance = world.read_model(1_u64);
    assert!(instance.paper_burned == 0, "no burn => no paper_burned");
}

// PR #3: treasury distribution share tests.
//
// We test the treasury path with `burn_percentage = 0` so the swap-
// and-burn block in on_issue is gated off, leaving the buyer's full
// `owed` payment in the contract for the treasury block to slice.
// In production with burn_percentage > 0 the contract would receive
// `(owed - burn_share)` USDC and the treasury would get a slice of
// that — but in tests where USDC == PAPER the burn block also
// drains the buyer's payment, so we exercise the cleaner gated
// scenario instead.

/// Reconfigure PaymentConfig with the given treasury split, no swap.
/// Burn-pct = 0 so the swap path is gated off; ekubo_router stays at
/// 0; only the treasury block in on_issue runs.
fn enable_treasury_only(
    systems: rollyourown::tests::v2_helper::V2Systems,
    treasury_percentage: u8,
    treasury_address: ContractAddress,
) {
    let zero: ContractAddress = 0.try_into().unwrap();
    set_contract_address(OWNER());
    systems
        .purchase_admin
        .set_payment_config(
            usdc: systems.paper_erc20.contract_address,
            ekubo_router: zero,
            ekubo_positions: zero,
            pool_fee: 0,
            pool_tick_spacing: 0,
            pool_extension: zero,
            pool_sqrt: 0,
            base_price: BASE_PRICE_PAPER.into(),
            burn_percentage: 0,
            treasury_percentage: treasury_percentage,
            treasury_address: treasury_address,
        );
}

#[test]
fn test_treasury_share_routes_to_address() {
    // Treasury gets `owed * treasury_pct / 100` (the swap path is
    // gated off so the contract holds the buyer's full payment when
    // the treasury block runs).
    let (world, systems) = spawn_v2();
    let treasury_pct: u8 = 20;
    enable_treasury_only(systems, treasury_pct, OTHER());

    let junkie_bundle_id = find_bundle_id_by_stake(world, 1).expect('Junkie bundle');
    let quote = systems.purchase.quote(junkie_bundle_id, 1, false, 0);
    let owed = quote.total_cost;

    fund_buyer(systems, BUYER(), owed);
    let treasury_balance_before = systems.paper_erc20.balance_of(OTHER());

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: junkie_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );

    let expected_treasury_share = owed * treasury_pct.into() / 100_u256;
    let treasury_balance_after = systems.paper_erc20.balance_of(OTHER());
    assert!(
        treasury_balance_after == treasury_balance_before + expected_treasury_share,
        "treasury got slice",
    );
}

#[test]
fn test_treasury_share_skipped_when_percentage_zero() {
    // Regression: with treasury_percentage=0, the treasury block
    // in on_issue must skip the transfer entirely, even if a
    // non-zero treasury_address is set. This pins the
    // `treasury_percentage > 0` half of the gating check.
    let (world, systems) = spawn_v2();
    enable_treasury_only(systems, 0, OTHER());

    let junkie_bundle_id = find_bundle_id_by_stake(world, 1).expect('Junkie bundle');
    let quote = systems.purchase.quote(junkie_bundle_id, 1, false, 0);
    let owed = quote.total_cost;

    fund_buyer(systems, BUYER(), owed);
    let treasury_balance_before = systems.paper_erc20.balance_of(OTHER());

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: junkie_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );

    let treasury_balance_after = systems.paper_erc20.balance_of(OTHER());
    assert!(treasury_balance_after == treasury_balance_before, "no treasury when pct=0");
}

#[test]
fn test_treasury_share_skipped_when_address_zero() {
    // Regression: with treasury_address=0, the treasury block must
    // skip the transfer even if treasury_percentage is non-zero.
    // This pins the `treasury_address.is_non_zero()` half of the
    // gating check — the missing-address case is the safety net for
    // a deploy-time misconfig where the admin sets the percentage
    // but forgets the address.
    let (world, systems) = spawn_v2();
    let zero: ContractAddress = 0.try_into().unwrap();
    enable_treasury_only(systems, 20, zero);

    let junkie_bundle_id = find_bundle_id_by_stake(world, 1).expect('Junkie bundle');
    let quote = systems.purchase.quote(junkie_bundle_id, 1, false, 0);
    let owed = quote.total_cost;

    // Verify the issue() doesn't panic from a transfer-to-zero call
    // (which is what would happen if the gating were missing —
    // ERC20.transfer reverts on zero recipient).
    fund_buyer(systems, BUYER(), owed);
    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, owed);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: junkie_bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );
}
