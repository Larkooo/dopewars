// Integration tests for the v2 content seeding contract.
//
// Verifies that PR-4's content::dojo_init writes the 4 canonical hustler
// templates and the 12 canonical gear templates after spawn, plus the
// admin register entrypoints can rewrite catalog rows in place.

use dojo::model::ModelStorage;
use rollyourown::models::gear_template::{GearTemplate, GearTemplateTrait};
use rollyourown::models::hustler_template::{HustlerTemplate, HustlerTemplateTrait};
use rollyourown::systems::content::IContentDispatcherTrait;
use rollyourown::tests::v2_helper::{BUYER, OWNER, spawn_v2};
use starknet::testing::set_contract_address;

#[test]
fn test_dojo_init_seeds_four_hustler_templates() {
    // content::dojo_init writes hustler templates 1..4 with the
    // documented stat curve. Read them back from the world and verify
    // the names + stat shape match.
    let (world, _systems) = spawn_v2();

    let naked: HustlerTemplate = world.read_model(1_u8);
    let street: HustlerTemplate = world.read_model(2_u8);
    let dealer: HustlerTemplate = world.read_model(3_u8);
    let kingpin: HustlerTemplate = world.read_model(4_u8);

    assert!(naked.id == 1, "naked id");
    assert!(naked.name == 'Naked', "naked name");
    assert!(naked.health == 90, "naked health");
    assert!(naked.starting_cash == 0, "naked cash");

    assert!(street.id == 2, "street id");
    assert!(street.name == 'Street', "street name");
    assert!(street.health == 95, "street health");
    assert!(street.starting_cash == 500, "street cash");

    assert!(dealer.id == 3, "dealer id");
    assert!(dealer.name == 'Dealer', "dealer name");
    assert!(dealer.health == 100, "dealer health");
    assert!(dealer.starting_cash == 1500, "dealer cash");

    assert!(kingpin.id == 4, "kingpin id");
    assert!(kingpin.name == 'Kingpin', "kingpin name");
    assert!(kingpin.health == 100, "kingpin health");
    assert!(kingpin.starting_cash == 3000, "kingpin cash");
    // Kingpin is the top of the curve — verify the combat stats step
    // up monotonically from naked.
    assert!(kingpin.attack > naked.attack, "kingpin attack > naked");
    assert!(kingpin.defense > naked.defense, "kingpin defense > naked");
    assert!(kingpin.cargo > naked.cargo, "kingpin cargo > naked");
}

#[test]
fn test_dojo_init_seeds_twelve_gear_templates() {
    // content::dojo_init writes gear templates 1..12 across the four
    // slots with three tiers each. Spot-check the slot mapping and
    // tier ordering — a future content rebalance should still preserve
    // these invariants.
    let (world, _systems) = spawn_v2();

    // Three weapons (slot 0), tiers 1..3.
    let knife: GearTemplate = world.read_model(1_u8);
    let pistol: GearTemplate = world.read_model(2_u8);
    let uzi: GearTemplate = world.read_model(3_u8);
    assert!(knife.slot == 0 && knife.tier == 1, "knife = weapon t1");
    assert!(pistol.slot == 0 && pistol.tier == 2, "pistol = weapon t2");
    assert!(uzi.slot == 0 && uzi.tier == 3, "uzi = weapon t3");
    assert!(uzi.stat_boost > pistol.stat_boost, "uzi boost > pistol");
    assert!(pistol.stat_boost > knife.stat_boost, "pistol boost > knife");

    // Three clothes (slot 1).
    let hoodie: GearTemplate = world.read_model(4_u8);
    let kevlar: GearTemplate = world.read_model(6_u8);
    assert!(hoodie.slot == 1 && hoodie.tier == 1, "hoodie = clothes t1");
    assert!(kevlar.slot == 1 && kevlar.tier == 3, "kevlar = clothes t3");

    // Three feet (slot 2).
    let sneakers: GearTemplate = world.read_model(7_u8);
    let trainers: GearTemplate = world.read_model(9_u8);
    assert!(sneakers.slot == 2 && sneakers.tier == 1, "sneakers = feet t1");
    assert!(trainers.slot == 2 && trainers.tier == 3, "trainers = feet t3");

    // Three transport (slot 3).
    let bicycle: GearTemplate = world.read_model(10_u8);
    let sports_car: GearTemplate = world.read_model(12_u8);
    assert!(bicycle.slot == 3 && bicycle.tier == 1, "bicycle = transport t1");
    assert!(sports_car.slot == 3 && sports_car.tier == 3, "car = transport t3");
}

#[test]
fn test_get_hustler_template_dispatch() {
    // Read via the contract dispatcher path (not just direct world
    // read_model) — exercises the get_hustler_template entrypoint
    // clients will use.
    let (_world, systems) = spawn_v2();
    let dealer = systems.content.get_hustler_template(3_u8);
    assert!(dealer.name == 'Dealer', "dealer via dispatcher");
    assert!(dealer.starting_cash == 1500, "stats round-trip");
}

#[test]
fn test_get_gear_template_dispatch() {
    let (_world, systems) = spawn_v2();
    let pistol = systems.content.get_gear_template(2_u8);
    assert!(pistol.name == 'Pistol', "pistol via dispatcher");
    assert!(pistol.slot == 0, "weapon slot");
    assert!(pistol.tier == 2, "tier 2");
}

#[test]
fn test_register_hustler_template_admin_overwrites_existing() {
    // Admin re-registers Naked with rebalanced stats. Verify the
    // catalog row reflects the new values without leaving the old
    // state behind.
    let (world, systems) = spawn_v2();

    set_contract_address(OWNER());
    let rebalanced = HustlerTemplateTrait::new(1, 'Naked', 80, 250, 12, 11, 11);
    systems.content.register_hustler_template(rebalanced);

    let updated: HustlerTemplate = world.read_model(1_u8);
    assert!(updated.health == 80, "rebalanced health");
    assert!(updated.starting_cash == 250, "rebalanced cash");
    assert!(updated.attack == 12, "rebalanced attack");
}

#[test]
fn test_register_hustler_template_admin_can_add_new_id() {
    // Admin adds a brand-new template id 99 (a seasonal/promo
    // hustler). Verify it's readable after register.
    let (world, systems) = spawn_v2();

    set_contract_address(OWNER());
    let promo = HustlerTemplateTrait::new(99, 'Promo', 100, 5000, 40, 40, 40);
    systems.content.register_hustler_template(promo);

    let added: HustlerTemplate = world.read_model(99_u8);
    assert!(added.id == 99, "new id");
    assert!(added.name == 'Promo', "new name");
    assert!(added.starting_cash == 5000, "new cash");
}

#[test]
fn test_register_gear_template_admin_overwrites_existing() {
    let (world, systems) = spawn_v2();

    set_contract_address(OWNER());
    let rebalanced = GearTemplateTrait::new(2, 'Pistol', 0, 2, 25);
    systems.content.register_gear_template(rebalanced);

    let updated: GearTemplate = world.read_model(2_u8);
    assert!(updated.stat_boost == 25, "rebalanced boost");
}

#[test]
#[should_panic(expected: ('Content: caller not owner', 'ENTRYPOINT_FAILED'))]
fn test_register_hustler_template_non_owner_reverts() {
    // Only the world owner can rewrite the catalog. BUYER is a
    // regular account; calling register_hustler_template must revert.
    let (_world, systems) = spawn_v2();
    set_contract_address(BUYER());
    let promo = HustlerTemplateTrait::new(99, 'Promo', 100, 5000, 40, 40, 40);
    systems.content.register_hustler_template(promo);
}

#[test]
#[should_panic(expected: ('Content: caller not owner', 'ENTRYPOINT_FAILED'))]
fn test_register_gear_template_non_owner_reverts() {
    let (_world, systems) = spawn_v2();
    set_contract_address(BUYER());
    let promo = GearTemplateTrait::new(99, 'Promo', 0, 3, 100);
    systems.content.register_gear_template(promo);
}
