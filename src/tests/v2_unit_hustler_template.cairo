// HustlerTemplate unit tests.
//
// Moved out of src/models/hustler_template.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation. PR-4b added the
// apply_to tests below.

use rollyourown::config::game::GameConfig;
use rollyourown::models::hustler_template::{HustlerTemplateImpl, HustlerTemplateTrait};

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

/// Build a baseline GameConfig matching the v0 "Average / Hustler"
/// season settings (cash 1000, health 90). All other fields zero — the
/// helper only touches cash + health.
fn baseline_config() -> GameConfig {
    GameConfig {
        season_version: 1,
        cash: 1000,
        health: 90,
        max_turns: 0,
        max_wanted_shopping: 0,
        max_rounds: 0,
        rep_drug_step: 0,
        rep_buy_item: 0,
        rep_carry_drugs: 0,
        rep_hospitalized: 0,
        rep_jailed: 0,
    }
}

#[test]
fn test_apply_to_naked_uses_season_defaults() {
    // Junkie has starting_cash=0 and health=90. Cash stays at the season
    // baseline; health gets explicitly written even though it matches.
    // This is the canonical PR-4 Junkie template.
    let mut cfg = baseline_config();
    let junkie = HustlerTemplateImpl::new(1, 'Junkie', 90, 0, 10, 10, 10);
    junkie.apply_to(ref cfg);
    assert!(cfg.cash == 1000, "junkie = season cash baseline");
    assert!(cfg.health == 90, "junkie health override matches default");
}

#[test]
fn test_apply_to_street_adds_cash_bonus() {
    // Street: starting_cash=500 → cash = 1000 + 500 = 1500.
    let mut cfg = baseline_config();
    let street = HustlerTemplateImpl::new(2, 'Street', 95, 500, 15, 12, 12);
    street.apply_to(ref cfg);
    assert!(cfg.cash == 1500, "street adds 500 cash bonus");
    assert!(cfg.health == 95, "street overrides health");
}

#[test]
fn test_apply_to_kingpin_max_stats() {
    // Kingpin: starting_cash=3000 (the biggest bonus) and health=100
    // (max). Verify the additive cash math and the health override.
    let mut cfg = baseline_config();
    let kingpin = HustlerTemplateImpl::new(4, 'Kingpin', 100, 3000, 30, 25, 25);
    kingpin.apply_to(ref cfg);
    assert!(cfg.cash == 4000, "kingpin = baseline + 3000");
    assert!(cfg.health == 100, "kingpin health = 100");
}

#[test]
fn test_apply_to_health_zero_keeps_season_default() {
    // A template with health=0 means "use the season default" — the
    // canonical PR-4 templates all set health explicitly, but a future
    // template might want to opt out of overriding it. Verify the
    // season's health survives.
    let mut cfg = baseline_config();
    let no_health = HustlerTemplateImpl::new(99, 'NoHealth', 0, 100, 1, 1, 1);
    no_health.apply_to(ref cfg);
    assert!(cfg.health == 90, "season default preserved");
    assert!(cfg.cash == 1100, "cash bonus still applied");
}

#[test]
fn test_apply_to_zero_cash_skips_addition() {
    // A template with starting_cash=0 should leave the season cash
    // untouched (no additive 0). The health override still fires.
    let mut cfg = baseline_config();
    let zero_cash = HustlerTemplateImpl::new(99, 'ZeroCash', 80, 0, 1, 1, 1);
    zero_cash.apply_to(ref cfg);
    assert!(cfg.cash == 1000, "cash unchanged");
    assert!(cfg.health == 80, "health override applied");
}

#[test]
fn test_apply_to_is_additive_across_calls() {
    // apply_to mutates in place — calling it twice with the same
    // template should add the cash bonus twice. This isn't a real use
    // case (each game gets one fresh GameConfig copy from the store)
    // but it pins the additive semantics so a future "absolute set"
    // refactor can't silently change behavior.
    let mut cfg = baseline_config();
    let dealer = HustlerTemplateImpl::new(3, 'Dealer', 100, 1500, 20, 18, 18);
    dealer.apply_to(ref cfg);
    dealer.apply_to(ref cfg);
    assert!(cfg.cash == 4000, "1000 + 1500 + 1500");
    assert!(cfg.health == 100, "health override is idempotent");
}
