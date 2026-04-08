// GearTemplate constructor unit tests.
//
// Moved out of src/models/gear_template.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation.

use rollyourown::models::gear_template::GearTemplateImpl;

#[test]
fn test_field_round_trip() {
    let g = GearTemplateImpl::new(7, 'AK47', 0, 1, 80);
    assert!(g.id == 7, "");
    assert!(g.name == 'AK47', "");
    assert!(g.slot == 0, "weapon slot");
    assert!(g.tier == 1, "tier-1 = best");
    assert!(g.stat_boost == 80, "");
}
