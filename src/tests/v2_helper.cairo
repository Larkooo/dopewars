// Spawn helper for v2 integration tests.
//
// Boots a minimal dojo test world with the PR-1b..1d contracts deployed
// and the model resources registered. The full game contract loop
// (create_game / register_score / encounters) is intentionally NOT spawned
// here — the integration tests in this PR target the purchase → mint
// boundary, which is the smallest meaningful slice that exercises real
// cross-contract dispatch.
//
// PR-1e's game-loop integration tests (purchase → game → register_score →
// reward mint) need the encounters/season/game_loop machinery and a VRF
// mock; that's a larger fixture and lands in a follow-up.

use dojo::world::{WorldStorage, WorldStorageTrait, world};
use dojo_cairo_test::{
    ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait, spawn_test_world,
};
use openzeppelin::interfaces::access::accesscontrol::{
    IAccessControlDispatcher, IAccessControlDispatcherTrait,
};
use openzeppelin::interfaces::token::erc20::IERC20Dispatcher;
use rollyourown::constants::ns;
use rollyourown::models::hustler_instance::m_HustlerInstance;
use rollyourown::models::starterpack::m_Starterpack;
use rollyourown::systems::purchase::{IPurchaseDispatcher, purchase};
use rollyourown::tokens::hustler::{IHustlerDispatcher, MINTER_ROLE as HUSTLER_MINTER_ROLE, hustler};
use rollyourown::tokens::paper::{
    IPaperTokenDispatcher, IPaperTokenDispatcherTrait, MINTER_ROLE as PAPER_MINTER_ROLE, paper,
};
use starknet::ContractAddress;
use starknet::testing::set_contract_address;

pub fn OWNER() -> ContractAddress {
    'OWNER'.try_into().unwrap()
}

pub fn BUYER() -> ContractAddress {
    'BUYER'.try_into().unwrap()
}

pub fn OTHER() -> ContractAddress {
    'OTHER'.try_into().unwrap()
}

#[derive(Copy, Drop)]
pub struct V2Systems {
    pub paper: IPaperTokenDispatcher,
    pub paper_erc20: IERC20Dispatcher,
    pub paper_access: IAccessControlDispatcher,
    pub hustler: IHustlerDispatcher,
    pub hustler_access: IAccessControlDispatcher,
    pub purchase: IPurchaseDispatcher,
}

pub fn spawn_v2() -> (WorldStorage, V2Systems) {
    set_contract_address(OWNER());

    let namespace_def = NamespaceDef {
        namespace: ns(),
        resources: [
            TestResource::Model(m_Starterpack::TEST_CLASS_HASH),
            TestResource::Model(m_HustlerInstance::TEST_CLASS_HASH),
            TestResource::Contract(paper::TEST_CLASS_HASH),
            TestResource::Contract(hustler::TEST_CLASS_HASH),
            TestResource::Contract(purchase::TEST_CLASS_HASH),
        ]
            .span(),
    };

    // Namespace selector — grants writer access on every model in `ns()`
    // so the purchase contract can write Starterpack + HustlerInstance.
    // Mirrors what the production deploy script's `auth.sh` does for v0.
    let ns_hash = dojo::utils::bytearray_hash(@ns());

    let contract_defs = [
        ContractDefTrait::new(@ns(), @"paper").with_init_calldata([OWNER().into()].span()),
        ContractDefTrait::new(@ns(), @"hustler").with_init_calldata([OWNER().into()].span()),
        ContractDefTrait::new(@ns(), @"purchase")
            .with_init_calldata([].span())
            .with_writer_of([ns_hash].span()),
    ]
        .span();

    let mut world = spawn_test_world(world::TEST_CLASS_HASH, [namespace_def].span());
    world.sync_perms_and_inits(contract_defs);

    let paper_address = world.dns_address(@"paper").expect('paper not found');
    let hustler_address = world.dns_address(@"hustler").expect('hustler not found');
    let purchase_address = world.dns_address(@"purchase").expect('purchase not found');

    // [Setup] Grant MINTER_ROLE to the purchase contract on Hustler so it
    // can mint NFTs to buyers. Caller must be the admin (OWNER) which
    // received DEFAULT_ADMIN_ROLE in dojo_init.
    let hustler_access = IAccessControlDispatcher { contract_address: hustler_address };
    hustler_access.grant_role(HUSTLER_MINTER_ROLE, purchase_address);

    // [Setup] Grant MINTER_ROLE to OWNER on Paper so the test fixture can
    // seed the buyer's balance via paper.reward(buyer, amount). Real
    // deploys would only grant this to the game contract.
    let paper_access = IAccessControlDispatcher { contract_address: paper_address };
    paper_access.grant_role(PAPER_MINTER_ROLE, OWNER());

    let systems = V2Systems {
        paper: IPaperTokenDispatcher { contract_address: paper_address },
        paper_erc20: IERC20Dispatcher { contract_address: paper_address },
        paper_access,
        hustler: IHustlerDispatcher { contract_address: hustler_address },
        hustler_access,
        purchase: IPurchaseDispatcher { contract_address: purchase_address },
    };

    (world, systems)
}

/// Mint `amount` PAPER to `recipient` via the OWNER's MINTER_ROLE.
/// Resets the contract address to OWNER for the call, leaves it as OWNER
/// on return — callers should re-set if they need a different address
/// for subsequent calls.
pub fn fund_buyer(systems: V2Systems, recipient: ContractAddress, amount: u256) {
    set_contract_address(OWNER());
    systems.paper.reward(recipient, amount);
}
