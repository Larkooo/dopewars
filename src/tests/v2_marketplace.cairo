// Integration tests for the daily gear marketplace.

use dojo::model::ModelStorage;
use dojo::world::{WorldStorage, WorldStorageTrait, world};
use dojo_cairo_test::{
    ContractDefTrait, NamespaceDef, TestResource, WorldStorageTestTrait, spawn_test_world,
};
use openzeppelin::interfaces::access::accesscontrol::{
    IAccessControlDispatcher, IAccessControlDispatcherTrait,
};
use openzeppelin::interfaces::token::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
use rollyourown::constants::ns;
use rollyourown::models::daily_purchase::{DailyPurchase, m_DailyPurchase};
use rollyourown::models::gear_instance::{GearInstance, m_GearInstance};
use rollyourown::models::market_config::m_MarketConfig;
use rollyourown::models::gear_template::m_GearTemplate;
use rollyourown::models::hustler_template::m_HustlerTemplate;
use rollyourown::systems::content::content;
use rollyourown::systems::marketplace::{
    IMarketplaceAdminDispatcher, IMarketplaceAdminDispatcherTrait, IMarketplaceDispatcher,
    IMarketplaceDispatcherTrait, marketplace,
};
use rollyourown::tokens::paper::{
    IPaperTokenDispatcher, IPaperTokenDispatcherTrait, MINTER_ROLE as PAPER_MINTER_ROLE, paper,
};
use starknet::ContractAddress;
use starknet::testing::{set_block_timestamp, set_contract_address};

// Re-use the existing v2_helper models for PaymentConfig etc so we
// don't have to fully re-spawn the purchase world. The marketplace
// only needs paper + its own models + PaymentConfig for treasury.
use rollyourown::models::payment_config::{PAYMENT_CONFIG_KEY, PaymentConfig, m_PaymentConfig};
use rollyourown::systems::purchase::{
    IPurchaseAdminDispatcher, IPurchaseAdminDispatcherTrait, purchase,
};

fn OWNER() -> ContractAddress {
    'OWNER'.try_into().unwrap()
}

fn BUYER() -> ContractAddress {
    'BUYER'.try_into().unwrap()
}

fn TREASURY() -> ContractAddress {
    'TREASURY'.try_into().unwrap()
}

// Test PAPER prices per tier (in wei).
const TIER1_PRICE: u256 = 500_000_000_000_000_000; // 0.5 PAPER
const TIER2_PRICE: u256 = 2_000_000_000_000_000_000; // 2 PAPER
const TIER3_PRICE: u256 = 5_000_000_000_000_000_000; // 5 PAPER
const BURN_PCT: u8 = 50; // 50% burned, 50% to treasury

#[derive(Copy, Drop)]
struct MarketSystems {
    paper: IPaperTokenDispatcher,
    paper_erc20: IERC20Dispatcher,
    marketplace: IMarketplaceDispatcher,
    marketplace_admin: IMarketplaceAdminDispatcher,
    purchase_admin: IPurchaseAdminDispatcher,
}

/// Spawn a minimal test world with just paper + marketplace + the
/// models they need. Lighter than the full spawn_v2 since we don't
/// need hustler / content / purchase for marketplace tests.
fn spawn_market() -> (WorldStorage, MarketSystems) {
    set_contract_address(OWNER());

    let namespace_def = NamespaceDef {
        namespace: ns(),
        resources: [
            TestResource::Model(m_MarketConfig::TEST_CLASS_HASH),
            TestResource::Model(m_GearInstance::TEST_CLASS_HASH),
            TestResource::Model(m_DailyPurchase::TEST_CLASS_HASH),
            TestResource::Model(m_PaymentConfig::TEST_CLASS_HASH),
            // Content seeds GearTemplate rows that the marketplace
            // reads for tier-based pricing.
            TestResource::Model(m_GearTemplate::TEST_CLASS_HASH),
            TestResource::Model(m_HustlerTemplate::TEST_CLASS_HASH),
            TestResource::Contract(paper::TEST_CLASS_HASH),
            TestResource::Contract(marketplace::TEST_CLASS_HASH),
            TestResource::Contract(purchase::TEST_CLASS_HASH),
            // Content contract seeds the 72-item gear catalog.
            TestResource::Contract(content::TEST_CLASS_HASH),
        ]
            .span(),
    };

    let ns_hash = dojo::utils::bytearray_hash(@ns());

    let contract_defs = [
        ContractDefTrait::new(@ns(), @"paper")
            .with_init_calldata([OWNER().into()].span()),
        ContractDefTrait::new(@ns(), @"marketplace")
            .with_init_calldata(
                [
                    0, 0, // tier1_price
                    0, 0, // tier2_price
                    0, 0, // tier3_price
                    0, // burn_percentage
                ]
                    .span(),
            )
            .with_writer_of([ns_hash].span()),
        ContractDefTrait::new(@ns(), @"purchase")
            .with_init_calldata(
                [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                ]
                    .span(),
            )
            .with_writer_of([ns_hash].span()),
        // Content seeds the 72 GearTemplate rows the marketplace
        // reads for tier-based pricing.
        ContractDefTrait::new(@ns(), @"content")
            .with_init_calldata([].span())
            .with_writer_of([ns_hash].span()),
    ]
        .span();

    let mut world = spawn_test_world(world::TEST_CLASS_HASH, [namespace_def].span());
    world.sync_perms_and_inits(contract_defs);

    let paper_address = world.dns_address(@"paper").expect('paper not found');
    let marketplace_address = world
        .dns_address(@"marketplace")
        .expect('marketplace not found');
    let purchase_address = world
        .dns_address(@"purchase")
        .expect('purchase not found');

    // Grant MINTER_ROLE to OWNER on Paper so we can fund buyers.
    let paper_access = IAccessControlDispatcher { contract_address: paper_address };
    paper_access.grant_role(PAPER_MINTER_ROLE, OWNER());

    // Write PaymentConfig with treasury_address for the marketplace
    // to read.
    let zero: ContractAddress = 0.try_into().unwrap();
    let purchase_admin = IPurchaseAdminDispatcher { contract_address: purchase_address };
    purchase_admin
        .set_payment_config(
            usdc: paper_address,
            ekubo_router: zero,
            ekubo_positions: zero,
            pool_fee: 0,
            pool_tick_spacing: 0,
            pool_extension: zero,
            pool_sqrt: 0,
            base_price: 0,
            burn_percentage: 0,
            treasury_percentage: 0,
            treasury_address: TREASURY(),
        );

    // Configure the marketplace pricing.
    let marketplace_admin = IMarketplaceAdminDispatcher {
        contract_address: marketplace_address,
    };
    marketplace_admin.set_config(TIER1_PRICE, TIER2_PRICE, TIER3_PRICE, BURN_PCT);

    let systems = MarketSystems {
        paper: IPaperTokenDispatcher { contract_address: paper_address },
        paper_erc20: IERC20Dispatcher { contract_address: paper_address },
        marketplace: IMarketplaceDispatcher { contract_address: marketplace_address },
        marketplace_admin,
        purchase_admin,
    };

    (world, systems)
}

fn fund(systems: MarketSystems, who: ContractAddress, amount: u256) {
    set_contract_address(OWNER());
    systems.paper.reward(who, amount);
}

// Tests

#[test]
fn test_today_offer_returns_valid_templates() {
    // Each template id must be in its slot's range from the full
    // 72-item catalog.
    let (_world, systems) = spawn_market();
    set_block_timestamp(1);
    let (w, c, f, t, _reserved, day) = systems.marketplace.today_offer();
    assert!(day == 0, "day 0");
    assert!(w >= 1 && w <= 18, "weapon in [1,18]");
    assert!(c >= 19 && c <= 38, "clothes in [19,38]");
    assert!(f >= 39 && f <= 55, "feet in [39,55]");
    assert!(t >= 56 && t <= 72, "transport in [56,72]");
}

#[test]
fn test_buy_happy_path() {
    let (world, systems) = spawn_market();
    set_block_timestamp(1); // day 0

    // Use quote() to get the actual price for slot 0 (random tier).
    let price = systems.marketplace.quote(0);
    fund(systems, BUYER(), price);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.marketplace.contract_address, price);
    systems.marketplace.buy(0); // weapon slot

    // [Verify] GearInstance written.
    let daily: DailyPurchase = world.read_model((BUYER(), 0_u8, 0_u32));
    assert!(daily.purchased, "purchase recorded");

    let instance: GearInstance = world.read_model(daily.gear_instance_id);
    assert!(instance.owner == BUYER(), "owner is buyer");
    // Template id should be in the weapon range [1, 18].
    assert!(instance.template_id >= 1 && instance.template_id <= 18, "weapon range");
    assert!(instance.purchased_day == 0, "day 0");
}

#[test]
fn test_buy_burn_and_treasury_split() {
    let (_world, systems) = spawn_market();
    set_block_timestamp(1);

    let price = systems.marketplace.quote(0);
    fund(systems, BUYER(), price);

    let supply_before = systems.paper_erc20.total_supply();
    let treasury_before = systems.paper_erc20.balance_of(TREASURY());

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.marketplace.contract_address, price);
    systems.marketplace.buy(0);

    // 50% burned, 50% to treasury.
    let expected_burn = price / 2;
    let expected_treasury = price - expected_burn;

    let supply_after = systems.paper_erc20.total_supply();
    assert!(supply_after == supply_before - expected_burn, "burn share removed from supply");

    let treasury_after = systems.paper_erc20.balance_of(TREASURY());
    assert!(treasury_after == treasury_before + expected_treasury, "treasury got its share");
}

#[test]
#[should_panic(expected: ('Market: already bought today', 'ENTRYPOINT_FAILED'))]
fn test_buy_same_slot_same_day_reverts() {
    let (_world, systems) = spawn_market();
    set_block_timestamp(1);

    let price = systems.marketplace.quote(0);
    fund(systems, BUYER(), price * 2);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.marketplace.contract_address, price * 2);
    systems.marketplace.buy(0); // first buy OK
    systems.marketplace.buy(0); // second buy same slot same day -> revert
}

#[test]
fn test_buy_different_slots_same_day_ok() {
    let (_world, systems) = spawn_market();
    set_block_timestamp(1);

    // Each slot may have a different tier/price, so fund generously.
    let max_price = TIER3_PRICE;
    fund(systems, BUYER(), max_price * 4);

    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.marketplace.contract_address, max_price * 4);
    systems.marketplace.buy(0); // weapon
    systems.marketplace.buy(1); // clothes
    systems.marketplace.buy(2); // feet
    systems.marketplace.buy(3); // transport
    // No revert — all 4 slots are independent.
}

#[test]
fn test_buy_same_slot_next_day_ok() {
    let (_world, systems) = spawn_market();
    set_block_timestamp(1); // day 0

    let price1 = systems.marketplace.quote(0);
    fund(systems, BUYER(), price1);
    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.marketplace.contract_address, price1);
    systems.marketplace.buy(0);

    // Advance to day 1 (different random tier / price).
    set_block_timestamp(86400 + 1);
    let price2 = systems.marketplace.quote(0);
    fund(systems, BUYER(), price2);
    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.marketplace.contract_address, price2);
    systems.marketplace.buy(0); // same slot, new day -> OK
}

#[test]
fn test_quote_returns_valid_tier_price() {
    // Each slot gets a random tier per day, so the price should
    // always be one of the three configured tier prices.
    let (_world, systems) = spawn_market();
    set_block_timestamp(1);

    let mut slot: u8 = 0;
    while slot < 4 {
        let price = systems.marketplace.quote(slot);
        assert!(
            price == TIER1_PRICE || price == TIER2_PRICE || price == TIER3_PRICE,
            "price is a valid tier price",
        );
        slot += 1;
    };
}

#[test]
#[should_panic(expected: ('Market: invalid slot', 'ENTRYPOINT_FAILED'))]
fn test_buy_invalid_slot_reverts() {
    let (_world, systems) = spawn_market();
    set_block_timestamp(1);
    fund(systems, BUYER(), TIER3_PRICE);
    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.marketplace.contract_address, TIER3_PRICE);
    systems.marketplace.buy(4); // slot 4 doesn't exist
}
