// Purchase discount-curve unit tests.
//
// Moved out of src/systems/purchase.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation.

use rollyourown::systems::purchase::{BASE_PRICE_PAPER, discount_price};

// 1000 PAPER * 10^18, in wei.
const ONE_K_PAPER: u128 = 1000_u128 * 1_000_000_000_000_000_000_u128;

#[test]
fn test_base_constant() {
    // Encode the base price in the test so a future "let's switch
    // base prices" change can't silently re-anchor the catalog.
    assert!(BASE_PRICE_PAPER == ONE_K_PAPER, "base = 1000 PAPER (wei)");
}

#[test]
fn test_discount_curve_matches_design_doc() {
    // The four canonical packs the design doc commits to:
    //   stake=1 (Naked):    1 * 1000 * 99 / 100 =  990 PAPER
    //   stake=2 (Street):   2 * 1000 * 98 / 100 = 1960 PAPER
    //   stake=3 (Dealer):   3 * 1000 * 97 / 100 = 2910 PAPER
    //   stake=4 (Kingpin):  4 * 1000 * 96 / 100 = 3840 PAPER
    // (the catalog table in V2_DESIGN.md shows USD prices; in PR-1d
    // we're charging in PAPER instead of USDC, so the units are
    // swapped but the curve shape is identical.)
    assert!(discount_price(1) == 990_u128 * 1_000_000_000_000_000_000_u128, "naked");
    assert!(discount_price(2) == 1960_u128 * 1_000_000_000_000_000_000_u128, "street");
    assert!(discount_price(3) == 2910_u128 * 1_000_000_000_000_000_000_u128, "dealer");
    assert!(discount_price(4) == 3840_u128 * 1_000_000_000_000_000_000_u128, "kingpin");
}

#[test]
fn test_discount_zero_stake() {
    // Edge case — should be 0 PAPER. Useful as a free-pack fixture.
    assert!(discount_price(0) == 0, "zero stake");
}

#[test]
fn test_discount_strictly_increasing_to_50() {
    // Curve is monotonically increasing in [0, 50] (the valuable
    // half) — verify a sample of the gradient so a future formula
    // tweak can't silently invert the discount inside the buyable
    // range.
    let mut prev: u128 = 0;
    for stake in 1_u8..=10_u8 {
        let p = discount_price(stake);
        assert!(p > prev, "must strictly increase in [0, 50]");
        prev = p;
    };
}

#[test]
fn test_discount_peaks_at_50() {
    // The curve peaks at stake=50 (50 * base * 50 / 100 = 25*base)
    // and decays back to 0 at stake=100. Encode the peak so the
    // formula's shape is locked in.
    let peak = discount_price(50);
    let just_under = discount_price(49);
    let just_over = discount_price(51);
    assert!(peak > just_under, "peak > 49");
    assert!(peak > just_over, "peak > 51");
}

#[test]
fn test_discount_stake_100_is_zero() {
    // At stake=100 the (100 - stake) factor zeroes the price.
    assert!(discount_price(100) == 0, "stake=100 zeros out");
}
