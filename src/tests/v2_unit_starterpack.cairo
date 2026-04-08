// Starterpack constructor unit tests.
//
// Moved out of src/models/starterpack.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation.

use rollyourown::models::starterpack::StarterpackImpl;

#[test]
fn test_new_pack_is_enabled_by_default() {
    // Catalog newly registered packs should be buyable immediately.
    // The admin can flip `enabled` later via systems::purchase.
    let pack = StarterpackImpl::new(1, 'Naked', 1, 0, 0, 0, 0, 1, 1_000);
    assert!(pack.enabled, "new pack must be enabled");
}

#[test]
fn test_field_round_trip() {
    // Sanity check that the constructor doesn't reorder fields. The
    // packed introspect layout is positional, so swapping any two of
    // these silently corrupts every read.
    let pack = StarterpackImpl::new(7, 'Kingpin', 4, 11, 12, 13, 14, 4, 7_680_000);
    assert!(pack.id == 7, "id");
    assert!(pack.name == 'Kingpin', "name");
    assert!(pack.hustler_template_id == 4, "template");
    assert!(pack.gear_weapon == 11, "weapon");
    assert!(pack.gear_clothes == 12, "clothes");
    assert!(pack.gear_feet == 13, "feet");
    assert!(pack.gear_transport == 14, "transport");
    assert!(pack.stake_multiplier == 4, "stake");
    assert!(pack.price_paper == 7_680_000, "price");
}

#[test]
fn test_naked_pack_uses_zero_gear() {
    // The Naked $2 pack ships with all four slots empty so the buyer
    // can fill them later from a marketplace. Encode that contract
    // here so a future refactor doesn't quietly slip a default item
    // in.
    let pack = StarterpackImpl::new(1, 'Naked', 1, 0, 0, 0, 0, 1, 1_000);
    assert!(pack.gear_weapon == 0, "naked weapon");
    assert!(pack.gear_clothes == 0, "naked clothes");
    assert!(pack.gear_feet == 0, "naked feet");
    assert!(pack.gear_transport == 0, "naked transport");
}
