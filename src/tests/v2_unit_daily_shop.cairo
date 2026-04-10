// Unit tests for helpers::daily_shop — pure functions, no world.

use rollyourown::helpers::daily_shop;
use rollyourown::systems::content;

#[test]
fn test_day_number_at_epoch() {
    assert!(daily_shop::day_number(0) == 0, "epoch = day 0");
}

#[test]
fn test_day_number_increments_at_86400() {
    assert!(daily_shop::day_number(86399) == 0, "just before day 1");
    assert!(daily_shop::day_number(86400) == 1, "exactly day 1");
    assert!(daily_shop::day_number(86401) == 1, "just after day 1");
}

#[test]
fn test_items_in_slot_matches_catalog() {
    assert!(daily_shop::items_in_slot(0) == content::WEAPON_COUNT, "weapons");
    assert!(daily_shop::items_in_slot(1) == content::CLOTHES_COUNT, "clothes");
    assert!(daily_shop::items_in_slot(2) == content::FEET_COUNT, "feet");
    assert!(daily_shop::items_in_slot(3) == content::TRANSPORT_COUNT, "transport");
    assert!(daily_shop::items_in_slot(4) == 0, "invalid slot");
}

#[test]
fn test_first_id_for_slot_matches_catalog() {
    assert!(daily_shop::first_id_for_slot(0) == content::WEAPON_FIRST_ID, "weapons");
    assert!(daily_shop::first_id_for_slot(1) == content::CLOTHES_FIRST_ID, "clothes");
    assert!(daily_shop::first_id_for_slot(2) == content::FEET_FIRST_ID, "feet");
    assert!(daily_shop::first_id_for_slot(3) == content::TRANSPORT_FIRST_ID, "transport");
}

#[test]
fn test_todays_item_in_valid_range() {
    // Over 30 days, every slot's pick must be within its id range.
    let mut day: u64 = 0;
    while day < 30 {
        let ts = day * 86400 + 1;
        let w = daily_shop::todays_item(ts, 0);
        assert!(w >= 1 && w <= 18, "weapon in [1,18]");
        let c = daily_shop::todays_item(ts, 1);
        assert!(c >= 19 && c <= 38, "clothes in [19,38]");
        let f = daily_shop::todays_item(ts, 2);
        assert!(f >= 39 && f <= 55, "feet in [39,55]");
        let t = daily_shop::todays_item(ts, 3);
        assert!(t >= 56 && t <= 72, "transport in [56,72]");
        day += 1;
    };
}

#[test]
fn test_todays_item_varies_across_days() {
    // Over 100 days, weapon slot should NOT always pick the same item.
    let first = daily_shop::todays_item(1, 0);
    let mut different_count: u32 = 0;
    let mut day: u64 = 1;
    while day < 100 {
        let ts = day * 86400 + 1;
        if daily_shop::todays_item(ts, 0) != first {
            different_count += 1;
        }
        day += 1;
    };
    assert!(different_count > 50, "should vary across days");
}

#[test]
fn test_todays_item_deterministic() {
    let ts: u64 = 86400 * 42 + 12345;
    let a = daily_shop::todays_item(ts, 2);
    let b = daily_shop::todays_item(ts, 2);
    assert!(a == b, "deterministic");
}

#[test]
fn test_todays_item_invalid_slot_returns_zero() {
    assert!(daily_shop::todays_item(1, 4) == 0, "slot 4 = 0");
    assert!(daily_shop::todays_item(1, 255) == 0, "slot 255 = 0");
}
