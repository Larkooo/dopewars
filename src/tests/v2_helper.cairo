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

use bundle::events::index::{e_BundleIssued, e_BundleRegistered, e_BundleUpdated};
use bundle::interface::IBundleDispatcher;
use bundle::models::index::{
    m_Bundle, m_BundleGroup, m_BundleIssuance, m_BundleReferral, m_BundleVoucher,
};
use dojo::world::{WorldStorage, WorldStorageTrait, world};
use dojo_cairo_test::{
    ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait, spawn_test_world,
};
use openzeppelin::interfaces::access::accesscontrol::{
    IAccessControlDispatcher, IAccessControlDispatcherTrait,
};
use openzeppelin::interfaces::token::erc20::IERC20Dispatcher;
use rollyourown::constants::ns;
use rollyourown::models::gear_template::m_GearTemplate;
use rollyourown::models::hustler_instance::m_HustlerInstance;
use rollyourown::models::hustler_template::m_HustlerTemplate;
use rollyourown::models::payment_config::m_PaymentConfig;
use rollyourown::models::starterpack::m_Starterpack;
use rollyourown::systems::content::{IContentDispatcher, content};
use rollyourown::_mocks::ekubo_router_mock::ekubo_router_mock;
use rollyourown::systems::purchase::{
    BASE_PRICE_PAPER, IPurchaseAdminDispatcher, IPurchaseAdminDispatcherTrait, purchase,
};
use rollyourown::tokens::hustler::{IHustlerDispatcher, MINTER_ROLE as HUSTLER_MINTER_ROLE, hustler};
use rollyourown::tokens::paper::{
    IPaperTokenDispatcher, IPaperTokenDispatcherTrait, MINTER_ROLE as PAPER_MINTER_ROLE, paper,
};
use starknet::ContractAddress;
use starknet::SyscallResultTrait;
use starknet::testing::{set_block_timestamp, set_contract_address};

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
    // PR-1f: the purchase contract now exposes IBundle (issue / quote
    // / get_metadata) for the buy flow, plus IPurchaseAdmin for the
    // dopewars-side catalog reads. Both are kept on the same address.
    pub purchase: IBundleDispatcher,
    pub purchase_admin: IPurchaseAdminDispatcher,
    pub content: IContentDispatcher,
}

pub fn spawn_v2() -> (WorldStorage, V2Systems) {
    set_contract_address(OWNER());

    let namespace_def = NamespaceDef {
        namespace: ns(),
        resources: [
            // PR-1f: bundle component models + events. The bundle
            // component reads/writes models and emits events via the
            // same WorldStorage as the contract that embeds it, so
            // both have to be registered in the dopewars namespace.
            TestResource::Model(m_Bundle::TEST_CLASS_HASH),
            TestResource::Model(m_BundleIssuance::TEST_CLASS_HASH),
            TestResource::Model(m_BundleReferral::TEST_CLASS_HASH),
            TestResource::Model(m_BundleGroup::TEST_CLASS_HASH),
            TestResource::Model(m_BundleVoucher::TEST_CLASS_HASH),
            TestResource::Event(e_BundleRegistered::TEST_CLASS_HASH),
            TestResource::Event(e_BundleUpdated::TEST_CLASS_HASH),
            TestResource::Event(e_BundleIssued::TEST_CLASS_HASH),
            TestResource::Model(m_Starterpack::TEST_CLASS_HASH),
            TestResource::Model(m_HustlerInstance::TEST_CLASS_HASH),
            TestResource::Model(m_HustlerTemplate::TEST_CLASS_HASH),
            TestResource::Model(m_GearTemplate::TEST_CLASS_HASH),
            // PR-1f-followup: PaymentConfig holds USDC address +
            // Ekubo pool params + base_price. The purchase contract's
            // initialize() reads it; tests write it before calling
            // initialize via set_payment_config (see below).
            TestResource::Model(m_PaymentConfig::TEST_CLASS_HASH),
            TestResource::Contract(paper::TEST_CLASS_HASH),
            TestResource::Contract(hustler::TEST_CLASS_HASH),
            TestResource::Contract(purchase::TEST_CLASS_HASH),
            TestResource::Contract(content::TEST_CLASS_HASH),
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
            .with_init_calldata([OWNER().into()].span())
            .with_writer_of([ns_hash].span()),
        // Content seeds the HustlerTemplate + GearTemplate catalog in
        // its dojo_init. Needs writer access on the namespace's catalog
        // models — easiest to grant the whole namespace, same as
        // purchase.
        ContractDefTrait::new(@ns(), @"content")
            .with_init_calldata([].span())
            .with_writer_of([ns_hash].span()),
    ]
        .span();

    let mut world = spawn_test_world(world::TEST_CLASS_HASH, [namespace_def].span());
    world.sync_perms_and_inits(contract_defs);

    let paper_address = world.dns_address(@"paper").expect('paper not found');
    let hustler_address = world.dns_address(@"hustler").expect('hustler not found');
    let purchase_address = world.dns_address(@"purchase").expect('purchase not found');
    let content_address = world.dns_address(@"content").expect('content not found');

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

    // [Setup] PR-1f-followup: write PaymentConfig before initialize.
    // Tests use `paper` as the USDC stand-in (it's an OZ ERC20 with
    // the same approve / transfer_from interface), and ekubo_router=0
    // to short-circuit the on_issue swap-and-burn path so tests stay
    // self-contained. Production deploys wire real USDC + Ekubo
    // addresses via this same entrypoint.
    //
    // **Critical**: bundle.register stores `get_block_timestamp()`
    // into `Bundle.created_at` and bundle.assert_does_exist later
    // checks `created_at != 0` (NOT the row's existence). The cairo
    // test runtime returns 0 for the block timestamp by default, so
    // we have to advance it before initialize() — otherwise every
    // bundle.issue call panics with "Bundle: not found".
    set_block_timestamp(1);
    let purchase_admin = IPurchaseAdminDispatcher { contract_address: purchase_address };
    set_contract_address(OWNER());
    let zero: ContractAddress = 0.try_into().unwrap();
    purchase_admin
        .set_payment_config(
            usdc: paper_address,
            ekubo_router: zero,
            ekubo_positions: zero,
            pool_fee: 0,
            pool_tick_spacing: 0,
            pool_extension: zero,
            pool_sqrt: 0,
            base_price: BASE_PRICE_PAPER.into(),
            burn_percentage: 0,
            treasury_percentage: 0,
            // PR #3: spawn_v2 leaves treasury_address at zero AND
            // treasury_percentage at 0, so the treasury transfer
            // path in on_issue is gated off in the default fixture.
            // Tests that want to exercise the treasury path call
            // enable_ekubo_swap_mock with non-zero values.
            treasury_address: zero,
        );
    purchase_admin.initialize();

    let systems = V2Systems {
        paper: IPaperTokenDispatcher { contract_address: paper_address },
        paper_erc20: IERC20Dispatcher { contract_address: paper_address },
        paper_access,
        hustler: IHustlerDispatcher { contract_address: hustler_address },
        hustler_access,
        purchase: IBundleDispatcher { contract_address: purchase_address },
        purchase_admin,
        content: IContentDispatcher { contract_address: content_address },
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

/// Deploy the Ekubo router mock and reconfigure PaymentConfig to use
/// it. The mock is a regular starknet contract (no dojo namespace,
/// no init args). Tests that want to exercise the swap-and-burn path
/// in `purchase::on_issue` call this after `spawn_v2()`. The mock is
/// pre-funded with `swap_payout_paper` PAPER so that each call to
/// `clear()` from inside on_issue transfers exactly that much PAPER
/// back to the purchase contract for burning.
///
/// `burn_percentage` is wired into PaymentConfig so the purchase
/// contract's burn-share calculation produces a non-zero amount —
/// the mock doesn't care about the deposited USDC amount, but the
/// gating in on_issue requires `burn_percentage > 0` to even run.
///
/// `treasury_percentage` and `treasury_address` are wired through to
/// PaymentConfig so the on_issue treasury-transfer block (PR #3) can
/// be exercised. Pass `0` and `zero` to skip the treasury path
/// (the PR #2 swap-only tests do this).
pub fn enable_ekubo_swap_mock(
    systems: V2Systems,
    swap_payout_paper: u256,
    burn_percentage: u8,
    treasury_percentage: u8,
    treasury_address: ContractAddress,
) -> ContractAddress {
    // [Deploy] mock router. No constructor args.
    let (mock_address, _) = starknet::syscalls::deploy_syscall(
        ekubo_router_mock::TEST_CLASS_HASH.try_into().unwrap(),
        'ekubo_mock',
        [].span(),
        false,
    )
        .unwrap_syscall();

    // [Fund] Pre-fund the mock with PAPER. The mock will return this
    // PAPER to the purchase contract on each clear() call. Caller is
    // OWNER (set above) which has MINTER_ROLE on paper.
    set_contract_address(OWNER());
    systems.paper.reward(mock_address, swap_payout_paper);

    // [Reconfig] Rewrite PaymentConfig with the mock as the router
    // address. We re-pass paper as the USDC stand-in and re-use the
    // same base_price as spawn_v2.
    let zero: ContractAddress = 0.try_into().unwrap();
    systems
        .purchase_admin
        .set_payment_config(
            usdc: systems.paper_erc20.contract_address,
            ekubo_router: mock_address,
            ekubo_positions: zero,
            pool_fee: 0,
            pool_tick_spacing: 0,
            pool_extension: zero,
            pool_sqrt: 0,
            base_price: BASE_PRICE_PAPER.into(),
            burn_percentage: burn_percentage,
            treasury_percentage: treasury_percentage,
            treasury_address: treasury_address,
        );

    mock_address
}
