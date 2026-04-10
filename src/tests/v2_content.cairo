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
fn test_dojo_init_seeds_72_gear_templates() {
    // content::dojo_init writes the full 72-item gear catalog ported
    // from the original dopewars. Verify total count + slot ranges +
    // spot-check some iconic items.
    let (world, _systems) = spawn_v2();

    // Count all seeded gear templates (ids 1..72).
    let mut count: u32 = 0;
    let mut id: u8 = 1;
    while id <= 72 {
        let g: GearTemplate = world.read_model(id);
        if g.slot <= 3 && g.tier >= 1 && g.tier <= 3 {
            count += 1;
        }
        id += 1;
    };
    assert!(count == 72, "72 gear templates seeded");

    // Spot-check weapons (slot 0, ids 1..18).
    let pocket_knife: GearTemplate = world.read_model(1_u8);
    assert!(pocket_knife.slot == 0 && pocket_knife.tier == 3, "Pocket Knife = weapon t3");
    let ak47: GearTemplate = world.read_model(6_u8);
    assert!(ak47.slot == 0 && ak47.tier == 1, "AK47 = weapon t1 (best)");
    let uzi: GearTemplate = world.read_model(18_u8);
    assert!(uzi.slot == 0 && uzi.tier == 1, "Uzi = weapon t1");

    // Spot-check clothes (slot 1, ids 19..38).
    let bulletproof: GearTemplate = world.read_model(23_u8);
    assert!(bulletproof.slot == 1 && bulletproof.tier == 1, "Bulletproof Vest = clothes t1");
    let bikini: GearTemplate = world.read_model(26_u8);
    assert!(bikini.slot == 1 && bikini.tier == 3, "Bikini = clothes t3");

    // Spot-check feet (slot 2, ids 39..55).
    let af1: GearTemplate = world.read_model(39_u8);
    assert!(af1.slot == 2 && af1.tier == 1, "Black AF1s = feet t1");
    let barefoot: GearTemplate = world.read_model(55_u8);
    assert!(barefoot.slot == 2 && barefoot.tier == 3, "Barefoot = feet t3");

    // Spot-check transport (slot 3, ids 56..72).
    let rolls: GearTemplate = world.read_model(68_u8);
    assert!(rolls.slot == 3 && rolls.tier == 1, "Rolls Royce = transport t1");
    let tricycle: GearTemplate = world.read_model(58_u8);
    assert!(tricycle.slot == 3 && tricycle.tier == 3, "Tricycle = transport t3");
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
    // Chain is id 2 in the full catalog (weapon, tier 2).
    let chain = systems.content.get_gear_template(2_u8);
    assert!(chain.name == 'Chain', "Chain via dispatcher");
    assert!(chain.slot == 0, "weapon slot");
    assert!(chain.tier == 2, "tier 2");
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
