// Integration tests for the v2 PAPER ERC20.
//
// Spawns a real dojo test world with the paper contract deployed and
// exercises the role-gated mint/burn flows + AccessControl admin
// surface end-to-end. Catches the things a unit test on PaperToken
// can't: actual component dispatch, role enforcement on the live
// contract, ERC20 supply movement on burn.

use openzeppelin::interfaces::access::accesscontrol::IAccessControlDispatcherTrait;
use openzeppelin::interfaces::token::erc20::IERC20DispatcherTrait;
use rollyourown::tests::v2_helper::{BUYER, OWNER, spawn_v2};
use rollyourown::tokens::paper::{IPaperTokenDispatcherTrait, MINTER_ROLE};
use starknet::testing::set_contract_address;

#[test]
fn test_paper_dojo_init_grants_admin_to_owner() {
    // dojo_init wires DEFAULT_ADMIN_ROLE (felt252 = 0) to the deployer
    // address passed in init calldata. v2_helper passes OWNER().
    let (_world, systems) = spawn_v2();
    // DEFAULT_ADMIN_ROLE is 0 in OZ AccessControl.
    assert!(systems.paper_access.has_role(0, OWNER()), "owner has admin");
    assert!(!systems.paper_access.has_role(0, BUYER()), "buyer no admin");
}

#[test]
fn test_paper_owner_has_minter_via_helper() {
    // The helper grants MINTER_ROLE to OWNER specifically so the
    // fund_buyer fixture can mint test PAPER. Verify it actually
    // landed.
    let (_world, systems) = spawn_v2();
    assert!(systems.paper_access.has_role(MINTER_ROLE, OWNER()), "owner has minter");
}

#[test]
fn test_paper_minter_can_reward() {
    // Minter calls reward(recipient, amount) → recipient balance
    // increases AND total supply increases by exactly amount.
    let (_world, systems) = spawn_v2();
    let supply_before = systems.paper_erc20.total_supply();
    let buyer_before = systems.paper_erc20.balance_of(BUYER());

    set_contract_address(OWNER());
    systems.paper.reward(BUYER(), 1000_u256);

    let supply_after = systems.paper_erc20.total_supply();
    let buyer_after = systems.paper_erc20.balance_of(BUYER());
    assert!(buyer_after == buyer_before + 1000, "buyer credited");
    assert!(supply_after == supply_before + 1000, "supply increased");
}

#[test]
#[should_panic(expected: ('Caller is missing role', 'ENTRYPOINT_FAILED'))]
fn test_paper_non_minter_cannot_reward() {
    // BUYER has no MINTER_ROLE — calling reward() must revert with
    // OZ AccessControl's MISSING_ROLE error.
    let (_world, systems) = spawn_v2();
    set_contract_address(BUYER());
    systems.paper.reward(BUYER(), 1000_u256);
}

#[test]
fn test_paper_burn_decreases_supply() {
    // burn() burns from the caller. Mint to BUYER, switch to BUYER,
    // burn — verify both BUYER's balance AND total supply drop by
    // exactly the burned amount.
    let (_world, systems) = spawn_v2();

    set_contract_address(OWNER());
    systems.paper.reward(BUYER(), 1000_u256);

    let supply_before = systems.paper_erc20.total_supply();
    let buyer_before = systems.paper_erc20.balance_of(BUYER());

    set_contract_address(BUYER());
    systems.paper.burn(400_u256);

    let supply_after = systems.paper_erc20.total_supply();
    let buyer_after = systems.paper_erc20.balance_of(BUYER());
    assert!(buyer_after == buyer_before - 400, "buyer debited");
    assert!(supply_after == supply_before - 400, "supply decreased");
}

#[test]
fn test_paper_admin_can_grant_then_revoke_minter() {
    // Admin → grant_role(MINTER_ROLE, BUYER) → BUYER becomes a minter
    // → revoke_role → BUYER stops being a minter. Round-trips through
    // both directions.
    let (_world, systems) = spawn_v2();

    set_contract_address(OWNER());
    systems.paper_access.grant_role(MINTER_ROLE, BUYER());
    assert!(systems.paper_access.has_role(MINTER_ROLE, BUYER()), "granted");

    // BUYER should now be able to call reward.
    set_contract_address(BUYER());
    systems.paper.reward(BUYER(), 100_u256);
    assert!(systems.paper_erc20.balance_of(BUYER()) == 100, "buyer self-rewarded");

    // Admin revokes — BUYER must stop being a minter.
    set_contract_address(OWNER());
    systems.paper_access.revoke_role(MINTER_ROLE, BUYER());
    assert!(!systems.paper_access.has_role(MINTER_ROLE, BUYER()), "revoked");
}

#[test]
#[should_panic(expected: ('Caller is missing role', 'ENTRYPOINT_FAILED'))]
fn test_paper_revoked_minter_cannot_reward() {
    // After revoke, BUYER's reward call must revert. Separated from
    // the round-trip test so the should_panic only catches the
    // intended assertion.
    let (_world, systems) = spawn_v2();

    set_contract_address(OWNER());
    systems.paper_access.grant_role(MINTER_ROLE, BUYER());
    systems.paper_access.revoke_role(MINTER_ROLE, BUYER());

    set_contract_address(BUYER());
    systems.paper.reward(BUYER(), 1_u256);
}
