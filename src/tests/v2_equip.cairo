// Integration tests for the equip flow.
//
// Uses the full spawn_v2 fixture (which includes paper + hustler +
// purchase + content + marketplace) so we have real HustlerInstances
// to equip GearInstances onto.
//
// The equip flow:
//   1. Buy a starterpack (issue) → gets a hustler with junk gear
//   2. Buy gear from the marketplace → gets a GearInstance
//   3. Call equip(hustler_token_id, gear_instance_id) → overwrites
//      the hustler's gear_* slot with the new template_id
//   4. GearInstance.equipped_to is set → gear is consumed

use bundle::interface::IBundleDispatcherTrait;
use dojo::model::ModelStorage;
use dojo::world::WorldStorageTrait;
use openzeppelin::interfaces::token::erc20::IERC20DispatcherTrait;
use rollyourown::models::gear_instance::GearInstance;
use rollyourown::models::hustler_instance::HustlerInstance;
use rollyourown::models::starterpack::Starterpack;
use rollyourown::systems::marketplace::{
    IEquipDispatcher, IEquipDispatcherTrait, IMarketplaceAdminDispatcher,
    IMarketplaceAdminDispatcherTrait, IMarketplaceDispatcher, IMarketplaceDispatcherTrait,
};
use rollyourown::tests::v2_helper::{BUYER, OTHER, fund_buyer, spawn_v2};
use starknet::testing::{set_block_timestamp, set_contract_address};

// Prices for the marketplace (same as v2_marketplace tests).
const TIER1_PRICE: u256 = 500_000_000_000_000_000;
const TIER2_PRICE: u256 = 2_000_000_000_000_000_000;
const TIER3_PRICE: u256 = 5_000_000_000_000_000_000;

/// Find a bundle_id by stake (same helper as v2_purchase).
fn find_bundle_id_by_stake(world: dojo::world::WorldStorage, stake: u8) -> Option<u32> {
    let mut id: u32 = 0;
    while id < 256 {
        let pack: Starterpack = world.read_model(id);
        if pack.stake_multiplier == stake && pack.hustler_template_id != 0 {
            return Option::Some(id);
        }
        id += 1;
    };
    Option::None
}

/// Buy a hustler via starterpack issue. Returns the token_id.
fn buy_hustler(
    world: dojo::world::WorldStorage,
    systems: rollyourown::tests::v2_helper::V2Systems,
    buyer: starknet::ContractAddress,
) -> u64 {
    let bundle_id = find_bundle_id_by_stake(world, 1).expect('bundle');
    let quote = systems.purchase.quote(bundle_id, 1, false, 0);
    fund_buyer(systems, buyer, quote.total_cost);
    set_contract_address(buyer);
    systems.paper_erc20.approve(systems.purchase.contract_address, quote.total_cost);
    systems
        .purchase
        .issue(
            recipient: buyer,
            bundle_id: bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );
    // First hustler minted gets token_id 1.
    1_u64
}

/// Configure the marketplace and buy a gear item. Returns the
/// GearInstance id (read from DailyPurchase).
fn buy_gear(
    world: dojo::world::WorldStorage,
    systems: rollyourown::tests::v2_helper::V2Systems,
    marketplace: IMarketplaceDispatcher,
    marketplace_admin: IMarketplaceAdminDispatcher,
    buyer: starknet::ContractAddress,
    slot: u8,
) -> u32 {
    use rollyourown::models::daily_purchase::DailyPurchase;
    use rollyourown::helpers::daily_shop;

    // Configure marketplace pricing (idempotent).
    set_contract_address(rollyourown::tests::v2_helper::OWNER());
    marketplace_admin.set_config(TIER1_PRICE, TIER2_PRICE, TIER3_PRICE, 100);

    let price = marketplace.quote(slot);
    fund_buyer(systems, buyer, price);
    set_contract_address(buyer);
    systems.paper_erc20.approve(marketplace.contract_address, price);
    marketplace.buy(slot);

    let day = daily_shop::day_number(starknet::get_block_timestamp());
    let daily: DailyPurchase = world.read_model((buyer, slot, day));
    daily.gear_instance_id
}

#[test]
fn test_equip_happy_path() {
    let (world, systems) = spawn_v2();
    set_block_timestamp(86400 + 1); // day 1, avoids timestamp-0 issues

    let hustler_id = buy_hustler(world, systems, BUYER());
    let equip = IEquipDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };

    // Buy a weapon from the marketplace.
    let marketplace = IMarketplaceDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    let marketplace_admin = IMarketplaceAdminDispatcher {
        contract_address: marketplace.contract_address,
    };
    let gear_id = buy_gear(world, systems, marketplace, marketplace_admin, BUYER(), 0);

    // Read the gear's template to know what to expect.
    let gear: GearInstance = world.read_model(gear_id);
    let expected_template = gear.template_id;

    // Equip it.
    set_contract_address(BUYER());
    equip.equip(hustler_id, gear_id);

    // [Verify] HustlerInstance.gear_weapon updated.
    let hustler: HustlerInstance = world.read_model(hustler_id);
    assert!(hustler.gear_weapon == expected_template, "weapon slot updated");

    // [Verify] GearInstance marked as consumed.
    let gear_after: GearInstance = world.read_model(gear_id);
    assert!(gear_after.equipped_to == hustler_id, "gear consumed");
}

#[test]
#[should_panic(expected: ('Equip: gear already consumed', 'ENTRYPOINT_FAILED'))]
fn test_equip_consumed_gear_reverts() {
    let (world, systems) = spawn_v2();
    set_block_timestamp(86400 + 1);

    let hustler_id = buy_hustler(world, systems, BUYER());
    let equip = IEquipDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    let marketplace = IMarketplaceDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    let marketplace_admin = IMarketplaceAdminDispatcher {
        contract_address: marketplace.contract_address,
    };
    let gear_id = buy_gear(world, systems, marketplace, marketplace_admin, BUYER(), 0);

    // Equip once — OK.
    set_contract_address(BUYER());
    equip.equip(hustler_id, gear_id);

    // Buy a second hustler to try equipping the same gear.
    let bundle_id = find_bundle_id_by_stake(world, 1).expect('bundle');
    let quote = systems.purchase.quote(bundle_id, 1, false, 0);
    fund_buyer(systems, BUYER(), quote.total_cost);
    set_contract_address(BUYER());
    systems.paper_erc20.approve(systems.purchase.contract_address, quote.total_cost);
    systems
        .purchase
        .issue(
            recipient: BUYER(),
            bundle_id: bundle_id,
            quantity: 1,
            referrer: Option::None,
            referrer_group: Option::None,
            client: Option::None,
            client_percentage: 0,
            voucher_key: Option::None,
            signature: Option::None,
        );
    let hustler_id_2 = 2_u64;

    // Try equipping the consumed gear onto the second hustler → revert.
    equip.equip(hustler_id_2, gear_id);
}

#[test]
#[should_panic(expected: ('Equip: hustler already used', 'ENTRYPOINT_FAILED'))]
fn test_equip_used_hustler_reverts() {
    // We can't easily run create_game in this fixture (needs the full
    // game world), so we manually set hustler.used = true.
    let (mut world, systems) = spawn_v2();
    set_block_timestamp(86400 + 1);

    let hustler_id = buy_hustler(world, systems, BUYER());

    // Manually mark the hustler as used. Need to call as OWNER
    // since the test caller doesn't have writer permission.
    set_contract_address(rollyourown::tests::v2_helper::OWNER());
    let mut hustler: HustlerInstance = world.read_model(hustler_id);
    hustler.used = true;
    world.write_model(@hustler);

    let equip = IEquipDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    let marketplace = IMarketplaceDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    let marketplace_admin = IMarketplaceAdminDispatcher {
        contract_address: marketplace.contract_address,
    };
    let gear_id = buy_gear(world, systems, marketplace, marketplace_admin, BUYER(), 0);

    set_contract_address(BUYER());
    equip.equip(hustler_id, gear_id); // → revert
}

#[test]
#[should_panic(expected: ('Equip: not gear owner', 'ENTRYPOINT_FAILED'))]
fn test_equip_not_gear_owner_reverts() {
    let (world, systems) = spawn_v2();
    set_block_timestamp(86400 + 1);

    // BUYER buys a hustler.
    let hustler_id = buy_hustler(world, systems, BUYER());

    // OTHER buys gear from the marketplace.
    let marketplace = IMarketplaceDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    let marketplace_admin = IMarketplaceAdminDispatcher {
        contract_address: marketplace.contract_address,
    };
    let gear_id = buy_gear(world, systems, marketplace, marketplace_admin, OTHER(), 0);

    // BUYER tries to equip OTHER's gear → revert.
    let equip = IEquipDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    set_contract_address(BUYER());
    equip.equip(hustler_id, gear_id);
}

#[test]
fn test_equip_overwrites_pack_gear() {
    // The hustler starts with Razor Blade (id 12) as the weapon from
    // the starterpack. Equipping a marketplace-bought weapon should
    // overwrite it.
    let (world, systems) = spawn_v2();
    set_block_timestamp(86400 + 1);

    let hustler_id = buy_hustler(world, systems, BUYER());

    // Verify the starter gear is Razor Blade.
    let hustler_before: HustlerInstance = world.read_model(hustler_id);
    assert!(hustler_before.gear_weapon == 12, "starts with Razor Blade");

    let equip = IEquipDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    let marketplace = IMarketplaceDispatcher {
        contract_address: world.dns_address(@"marketplace").expect('mkt'),
    };
    let marketplace_admin = IMarketplaceAdminDispatcher {
        contract_address: marketplace.contract_address,
    };
    let gear_id = buy_gear(world, systems, marketplace, marketplace_admin, BUYER(), 0);

    let gear: GearInstance = world.read_model(gear_id);
    let new_template = gear.template_id;

    set_contract_address(BUYER());
    equip.equip(hustler_id, gear_id);

    let hustler_after: HustlerInstance = world.read_model(hustler_id);
    assert!(hustler_after.gear_weapon == new_template, "weapon overwritten");
    assert!(hustler_after.gear_weapon != 12, "not the old Razor Blade");
}
