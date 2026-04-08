// HustlerInstance constructor unit tests.
//
// Moved out of src/models/hustler_instance.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation.

use rollyourown::models::hustler_instance::HustlerInstanceImpl;

#[test]
fn test_new_instance_is_unused() {
    // Fresh hustler must start with used=false, game_id=0,
    // final_score=0. PR-1e's create_game asserts !used; if this
    // default ever flips, every newly minted hustler immediately
    // bricks itself.
    let instance = HustlerInstanceImpl::new_from_pack(42, 3, 3, 5, 6, 7, 8);
    assert!(!instance.used, "must start unused");
    assert!(instance.game_id == 0, "no bound game");
    assert!(instance.final_score == 0, "no score yet");
}

#[test]
fn test_new_instance_round_trips_loadout() {
    // Positional layout sanity — same reasoning as the Starterpack
    // round-trip test.
    let instance = HustlerInstanceImpl::new_from_pack(42, 3, 4, 11, 12, 13, 14);
    assert!(instance.token_id == 42, "");
    assert!(instance.starterpack_id == 3, "");
    assert!(instance.hustler_template_id == 4, "");
    assert!(instance.gear_weapon == 11, "");
    assert!(instance.gear_clothes == 12, "");
    assert!(instance.gear_feet == 13, "");
    assert!(instance.gear_transport == 14, "");
}
