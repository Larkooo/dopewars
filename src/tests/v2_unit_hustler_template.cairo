// HustlerTemplate constructor unit tests.
//
// Moved out of src/models/hustler_template.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation.

use rollyourown::models::hustler_template::HustlerTemplateImpl;

#[test]
fn test_field_round_trip() {
    let t = HustlerTemplateImpl::new(2, 'Street', 100, 5_000, 25, 20, 30);
    assert!(t.id == 2, "");
    assert!(t.name == 'Street', "");
    assert!(t.health == 100, "");
    assert!(t.starting_cash == 5_000, "");
    assert!(t.attack == 25, "");
    assert!(t.defense == 20, "");
    assert!(t.cargo == 30, "");
}
