// Purchase discount-curve unit tests.
//
// Moved out of src/systems/purchase.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation.

use rollyourown::systems::purchase::{BASE_PRICE_PAPER, discount_price, discount_price_u256};

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

// PR-1f-followup: discount_price_u256 unit tests. The u256 variant
// is the production path — purchase::initialize reads base_price from
// PaymentConfig (USDC decimals — typically 6) and feeds it through
// discount_price_u256. Tests pin the curve shape across both unit
// systems (PAPER 18-decimal and USDC 6-decimal) so a future
// PaymentConfig change can't silently re-anchor the catalog.

const TWO_USDC: u256 = 2_000_000_u256;

#[test]
fn test_u256_discount_curve_matches_design_doc_in_usdc() {
    // 1× tier base = 2 USDC = 2_000_000 (6 decimals).
    //   stake=1 (Naked):    1 * 2_000_000 * 99 / 100 = 1_980_000
    //   stake=2 (Street):   2 * 2_000_000 * 98 / 100 = 3_920_000
    //   stake=3 (Dealer):   3 * 2_000_000 * 97 / 100 = 5_820_000
    //   stake=4 (Kingpin):  4 * 2_000_000 * 96 / 100 = 7_680_000
    // The catalog table in V2_DESIGN.md uses these exact USDC values.
    assert!(discount_price_u256(1, TWO_USDC) == 1_980_000, "naked usdc");
    assert!(discount_price_u256(2, TWO_USDC) == 3_920_000, "street usdc");
    assert!(discount_price_u256(3, TWO_USDC) == 5_820_000, "dealer usdc");
    assert!(discount_price_u256(4, TWO_USDC) == 7_680_000, "kingpin usdc");
}

#[test]
fn test_u256_discount_matches_u128_at_paper_base() {
    // discount_price_u256(stake, BASE_PRICE_PAPER.into()) should
    // produce the same numbers as the u128 helper. This pins the two
    // implementations together so a future formula tweak doesn't
    // accidentally diverge them.
    let base: u256 = BASE_PRICE_PAPER.into();
    for stake in 1_u8..=4_u8 {
        let u128_price: u256 = discount_price(stake).into();
        let u256_price = discount_price_u256(stake, base);
        assert!(u128_price == u256_price, "u128 and u256 paths agree");
    };
}

#[test]
fn test_u256_discount_zero_base_zeros_out() {
    // Sanity: a base of 0 produces 0 price across the curve. Tests
    // the test fixture's "free pack" path indirectly.
    for stake in 1_u8..=4_u8 {
        assert!(discount_price_u256(stake, 0) == 0, "zero base = zero price");
    };
}
