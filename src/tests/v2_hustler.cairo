// Integration tests for the v2 Hustler ERC721.
//
// Spawns a real dojo test world with the hustler contract deployed and
// exercises the role-gated mint/burn flows + soulbound transfer
// blocking + sequential id assignment end-to-end. The purchase
// contract is also spawned (we reuse v2_helper) but is intentionally
// unused here — this file targets the Hustler contract directly so
// failures point straight at it.

use openzeppelin::interfaces::access::accesscontrol::IAccessControlDispatcherTrait;
use openzeppelin::interfaces::token::erc721::{IERC721Dispatcher, IERC721DispatcherTrait};
use rollyourown::tests::v2_helper::{BUYER, OTHER, OWNER, spawn_v2};
use rollyourown::tokens::hustler::{IHustlerDispatcherTrait, MINTER_ROLE};
use starknet::testing::set_contract_address;

#[test]
fn test_hustler_dojo_init_grants_admin_to_owner() {
    // dojo_init wires DEFAULT_ADMIN_ROLE (felt252 = 0) to the deployer
    // address passed in init calldata. v2_helper passes OWNER().
    let (_world, systems) = spawn_v2();
    assert!(systems.hustler_access.has_role(0, OWNER()), "owner has admin");
    assert!(!systems.hustler_access.has_role(0, BUYER()), "buyer no admin");
}

#[test]
fn test_hustler_purchase_has_minter_via_helper() {
    // The helper grants MINTER_ROLE on Hustler to the purchase
    // contract address so PR-1d's buy() flow can mint NFTs. Verify it
    // landed on the right address.
    let (_world, systems) = spawn_v2();
    let purchase_address = systems.purchase.contract_address;
    assert!(systems.hustler_access.has_role(MINTER_ROLE, purchase_address), "purchase has minter");
    assert!(!systems.hustler_access.has_role(MINTER_ROLE, BUYER()), "buyer no minter");
}

#[test]
#[should_panic(expected: ('Caller is missing role', 'ENTRYPOINT_FAILED'))]
fn test_hustler_non_minter_cannot_mint() {
    // BUYER has no MINTER_ROLE — calling mint() must revert with the
    // OZ AccessControl MISSING_ROLE message.
    let (_world, systems) = spawn_v2();
    set_contract_address(BUYER());
    let _ = systems.hustler.mint(BUYER(), false);
}

#[test]
fn test_hustler_minter_can_mint_and_assigns_sequential_ids() {
    // Grant MINTER_ROLE to OWNER so we can mint directly without
    // going through the purchase contract. Verify ids are 1, 2, 3 in
    // order — the next_id counter starts at 1 (0 is reserved as
    // "no hustler" everywhere else).
    let (_world, systems) = spawn_v2();
    set_contract_address(OWNER());
    systems.hustler_access.grant_role(MINTER_ROLE, OWNER());

    let id1 = systems.hustler.mint(BUYER(), false);
    let id2 = systems.hustler.mint(BUYER(), false);
    let id3 = systems.hustler.mint(OTHER(), false);

    assert!(id1 == 1, "first id");
    assert!(id2 == 2, "second id");
    assert!(id3 == 3, "third id");

    // Verify ownership too.
    let erc721 = IERC721Dispatcher { contract_address: systems.hustler.contract_address };
    assert!(erc721.owner_of(1_u256) == BUYER(), "buyer owns 1");
    assert!(erc721.owner_of(2_u256) == BUYER(), "buyer owns 2");
    assert!(erc721.owner_of(3_u256) == OTHER(), "other owns 3");
    assert!(erc721.balance_of(BUYER()) == 2, "buyer balance");
    assert!(erc721.balance_of(OTHER()) == 1, "other balance");
}

#[test]
fn test_hustler_non_soulbound_can_transfer() {
    // soulbound=false → erc721.transfer_from must succeed. The
    // sender must be the token owner; we mint to BUYER then have
    // BUYER transfer to OTHER.
    let (_world, systems) = spawn_v2();
    set_contract_address(OWNER());
    systems.hustler_access.grant_role(MINTER_ROLE, OWNER());
    let token_id = systems.hustler.mint(BUYER(), false);

    let erc721 = IERC721Dispatcher { contract_address: systems.hustler.contract_address };
    set_contract_address(BUYER());
    erc721.transfer_from(BUYER(), OTHER(), token_id.into());

    assert!(erc721.owner_of(token_id.into()) == OTHER(), "transferred");
    assert!(!systems.hustler.is_soulbound(token_id.into()), "still not soulbound");
}

#[test]
#[should_panic(expected: ('Hustler: token is soulbound', 'ENTRYPOINT_FAILED'))]
fn test_hustler_soulbound_cannot_transfer() {
    // soulbound=true → transfer_from must revert with the
    // assert_not_soulbound error. The custom ERC721Impl gates every
    // transfer path, so we exercise the basic transfer_from here.
    let (_world, systems) = spawn_v2();
    set_contract_address(OWNER());
    systems.hustler_access.grant_role(MINTER_ROLE, OWNER());
    let token_id = systems.hustler.mint(BUYER(), true);
    assert!(systems.hustler.is_soulbound(token_id.into()), "marked soulbound");

    let erc721 = IERC721Dispatcher { contract_address: systems.hustler.contract_address };
    set_contract_address(BUYER());
    erc721.transfer_from(BUYER(), OTHER(), token_id.into());
}

#[test]
#[should_panic(expected: ('Hustler: token is soulbound', 'ENTRYPOINT_FAILED'))]
fn test_hustler_soulbound_cannot_safe_transfer() {
    // safe_transfer_from path also routes through assert_not_soulbound
    // — verify the gate fires there too. Catches the regression
    // where someone embeds ERC721Component::ERC721Impl directly and
    // bypasses the custom impl.
    let (_world, systems) = spawn_v2();
    set_contract_address(OWNER());
    systems.hustler_access.grant_role(MINTER_ROLE, OWNER());
    let token_id = systems.hustler.mint(BUYER(), true);

    let erc721 = IERC721Dispatcher { contract_address: systems.hustler.contract_address };
    set_contract_address(BUYER());
    erc721.safe_transfer_from(BUYER(), OTHER(), token_id.into(), array![].span());
}

#[test]
fn test_hustler_minter_can_burn() {
    // burn requires MINTER_ROLE — same role as mint, so the game
    // contract can retire used hustlers without exposing burn to
    // arbitrary callers. After burn, owner_of must revert (we can't
    // easily test that without a try-catch, so we just verify
    // balance_of dropped to 0).
    let (_world, systems) = spawn_v2();
    set_contract_address(OWNER());
    systems.hustler_access.grant_role(MINTER_ROLE, OWNER());
    let token_id = systems.hustler.mint(BUYER(), false);

    let erc721 = IERC721Dispatcher { contract_address: systems.hustler.contract_address };
    assert!(erc721.balance_of(BUYER()) == 1, "owns 1 before burn");

    systems.hustler.burn(token_id.into());
    assert!(erc721.balance_of(BUYER()) == 0, "owns 0 after burn");
}

#[test]
#[should_panic(expected: ('Caller is missing role', 'ENTRYPOINT_FAILED'))]
fn test_hustler_non_minter_cannot_burn() {
    // BUYER owns the token but is not a minter — burn() must still
    // revert. Burn is gated on MINTER_ROLE, not ownership.
    let (_world, systems) = spawn_v2();
    set_contract_address(OWNER());
    systems.hustler_access.grant_role(MINTER_ROLE, OWNER());
    let token_id = systems.hustler.mint(BUYER(), false);

    set_contract_address(BUYER());
    systems.hustler.burn(token_id.into());
}

#[test]
fn test_hustler_burn_clears_soulbound_flag() {
    // burn() defensively clears the soulbound entry so a future
    // re-mint with the same id (shouldn't happen, but...) starts
    // clean. Verify the flag flips back to false after burn.
    let (_world, systems) = spawn_v2();
    set_contract_address(OWNER());
    systems.hustler_access.grant_role(MINTER_ROLE, OWNER());
    let token_id = systems.hustler.mint(BUYER(), true);
    assert!(systems.hustler.is_soulbound(token_id.into()), "marked soulbound pre-burn");

    systems.hustler.burn(token_id.into());
    assert!(!systems.hustler.is_soulbound(token_id.into()), "cleared post-burn");
}
