// Starterpack constructor unit tests.
//
// The catalog is keyed by `bundle_id: u32` (the value the embedded
// BundleComponent returns from register), not by a local u8 enum.
// PR #1 dropped the legacy `price_paper` rewarder estimate field —
// season_manager now reads the actual burn share from
// HustlerInstance.paper_burned, which on_issue stamps from the real
// Ekubo swap result.

use rollyourown::models::starterpack::StarterpackImpl;

#[test]
fn test_field_round_trip() {
    // Sanity check that the constructor doesn't reorder fields. The
    // packed introspect layout is positional, so swapping any two of
    // these silently corrupts every read.
    let pack = StarterpackImpl::new(42_u32, 4, 11, 12, 13, 14, 4);
    assert!(pack.bundle_id == 42, "bundle_id");
    assert!(pack.hustler_template_id == 4, "template");
    assert!(pack.gear_weapon == 11, "weapon");
    assert!(pack.gear_clothes == 12, "clothes");
    assert!(pack.gear_feet == 13, "feet");
    assert!(pack.gear_transport == 14, "transport");
    assert!(pack.stake_multiplier == 4, "stake");
}

#[test]
fn test_naked_pack_uses_zero_gear() {
    // The Junkie pack ships with all four slots empty so the buyer can
    // fill them later from a marketplace. Encode that contract here so
    // a future refactor doesn't quietly slip a default item in.
    let pack = StarterpackImpl::new(1_u32, 1, 0, 0, 0, 0, 1);
    assert!(pack.gear_weapon == 0, "naked weapon");
    assert!(pack.gear_clothes == 0, "naked clothes");
    assert!(pack.gear_feet == 0, "naked feet");
    assert!(pack.gear_transport == 0, "naked transport");
}
