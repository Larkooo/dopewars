// HustlerInstance constructor unit tests.

use rollyourown::models::hustler_instance::HustlerInstanceImpl;

#[test]
fn test_new_instance_is_unused() {
    // Fresh hustler must start with used=false, game_id=0,
    // final_score=0. PR-1e's create_game asserts !used; if this
    // default ever flips, every newly minted hustler immediately
    // bricks itself. PR #1: paper_burned is the new last positional
    // arg — set non-zero here so the assertion-vs-zero pattern can
    // catch a future param-order swap.
    let instance = HustlerInstanceImpl::new_from_pack(42, 3_u32, 3, 5, 6, 7, 8, 999_u128);
    assert!(!instance.used, "must start unused");
    assert!(instance.game_id == 0, "no bound game");
    assert!(instance.final_score == 0, "no score yet");
    assert!(instance.paper_burned == 999, "paper_burned round trip");
}

#[test]
fn test_new_instance_round_trips_loadout() {
    // Positional layout sanity — the Introspect packed layout is
    // positional, so swapping any two of these silently corrupts
    // every read. PR #1 added paper_burned as the last positional
    // arg.
    let instance = HustlerInstanceImpl::new_from_pack(42, 3_u32, 4, 11, 12, 13, 14, 7_777_u128);
    assert!(instance.token_id == 42, "token_id");
    assert!(instance.bundle_id == 3, "bundle_id");
    assert!(instance.hustler_template_id == 4, "template");
    assert!(instance.gear_weapon == 11, "weapon");
    assert!(instance.gear_clothes == 12, "clothes");
    assert!(instance.gear_feet == 13, "feet");
    assert!(instance.gear_transport == 14, "transport");
    assert!(instance.paper_burned == 7_777, "paper_burned");
}

#[test]
fn test_new_instance_zero_burn_is_default() {
    // Test fixtures and dev / devtools fake games pass paper_burned=0
    // (the on_issue swap path is gated). The rewarder collapses to a
    // zero multiplier in that case so devtools fake games don't mint
    // PAPER. Pin the default.
    let instance = HustlerInstanceImpl::new_from_pack(1, 1_u32, 1, 0, 0, 0, 0, 0_u128);
    assert!(instance.paper_burned == 0, "zero burn = no reward");
}
