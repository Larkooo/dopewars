// Purchase discount-curve unit tests.
//
// `discount_price_u256(stake, base_price)` is the canonical curve.
// Tests pin its shape in both PAPER (18-decimal) and USDC (6-decimal)
// units so a future PaymentConfig change can't silently re-anchor the
// catalog. PR #1 dropped the legacy u128 PAPER `discount_price`
// helper — the u256 variant covers both paths.

use rollyourown::systems::purchase::{BASE_PRICE_PAPER, discount_price_u256};

// 1000 PAPER * 10^18, in wei.
const ONE_K_PAPER: u128 = 1000_u128 * 1_000_000_000_000_000_000_u128;
const TWO_USDC: u256 = 2_000_000_u256;

#[test]
fn test_base_constant() {
    // Encode the base price in the test so a future "let's switch
    // base prices" change can't silently re-anchor the catalog.
    assert!(BASE_PRICE_PAPER == ONE_K_PAPER, "base = 1000 PAPER (wei)");
}

#[test]
fn test_paper_discount_curve_matches_design_doc() {
    // The four canonical packs the design doc commits to, in PAPER
    // wei (the test fixture's USDC stand-in unit):
    //   stake=1 (Junkie):    1 * 1000 * 99 / 100 =  990 PAPER
    //   stake=2 (Street):   2 * 1000 * 98 / 100 = 1960 PAPER
    //   stake=3 (Dealer):   3 * 1000 * 97 / 100 = 2910 PAPER
    //   stake=4 (Kingpin):  4 * 1000 * 96 / 100 = 3840 PAPER
    let base: u256 = BASE_PRICE_PAPER.into();
    let one_paper: u256 = 1_000_000_000_000_000_000_u256;
    assert!(discount_price_u256(1, base) == 990_u256 * one_paper, "naked");
    assert!(discount_price_u256(2, base) == 1960_u256 * one_paper, "street");
    assert!(discount_price_u256(3, base) == 2910_u256 * one_paper, "dealer");
    assert!(discount_price_u256(4, base) == 3840_u256 * one_paper, "kingpin");
}

#[test]
fn test_usdc_discount_curve_matches_design_doc() {
    // 1× tier base = 2 USDC = 2_000_000 (6 decimals). The catalog
    // table in V2_DESIGN.md uses these exact USDC values.
    //   stake=1 (Junkie):    1 * 2_000_000 * 99 / 100 = 1_980_000
    //   stake=2 (Street):   2 * 2_000_000 * 98 / 100 = 3_920_000
    //   stake=3 (Dealer):   3 * 2_000_000 * 97 / 100 = 5_820_000
    //   stake=4 (Kingpin):  4 * 2_000_000 * 96 / 100 = 7_680_000
    assert!(discount_price_u256(1, TWO_USDC) == 1_980_000, "naked usdc");
    assert!(discount_price_u256(2, TWO_USDC) == 3_920_000, "street usdc");
    assert!(discount_price_u256(3, TWO_USDC) == 5_820_000, "dealer usdc");
    assert!(discount_price_u256(4, TWO_USDC) == 7_680_000, "kingpin usdc");
}

#[test]
fn test_discount_zero_stake() {
    // Edge case — should be 0. Useful as a free-pack fixture.
    assert!(discount_price_u256(0, TWO_USDC) == 0, "zero stake usdc");
    assert!(discount_price_u256(0, BASE_PRICE_PAPER.into()) == 0, "zero stake paper");
}

#[test]
fn test_discount_zero_base_zeros_out() {
    // A base of 0 produces 0 price across the curve regardless of stake.
    for stake in 1_u8..=4_u8 {
        assert!(discount_price_u256(stake, 0) == 0, "zero base = zero price");
    };
}

#[test]
fn test_discount_strictly_increasing_to_50() {
    // Curve is monotonically increasing in [0, 50] (the valuable
    // half) — verify a sample of the gradient so a future formula
    // tweak can't silently invert the discount inside the buyable
    // range.
    let base: u256 = BASE_PRICE_PAPER.into();
    let mut prev: u256 = 0;
    for stake in 1_u8..=10_u8 {
        let p = discount_price_u256(stake, base);
        assert!(p > prev, "must strictly increase in [0, 50]");
        prev = p;
    };
}

#[test]
fn test_discount_peaks_at_50() {
    // The curve peaks at stake=50 (50 * base * 50 / 100 = 25*base)
    // and decays back to 0 at stake=100. Encode the peak so the
    // formula's shape is locked in.
    let base: u256 = BASE_PRICE_PAPER.into();
    let peak = discount_price_u256(50, base);
    let just_under = discount_price_u256(49, base);
    let just_over = discount_price_u256(51, base);
    assert!(peak > just_under, "peak > 49");
    assert!(peak > just_over, "peak > 51");
}

#[test]
fn test_discount_stake_100_is_zero() {
    // At stake=100 the (100 - stake) factor zeroes the price.
    let base: u256 = BASE_PRICE_PAPER.into();
    assert!(discount_price_u256(100, base) == 0, "stake=100 zeros out");
}
