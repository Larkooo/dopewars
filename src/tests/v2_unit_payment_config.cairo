// PaymentConfig constructor unit tests.
//
// Moved out of src/models/payment_config.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation.

use rollyourown::models::payment_config::{PAYMENT_CONFIG_KEY, PaymentConfig, PaymentConfigImpl};
use starknet::ContractAddress;

fn zero() -> ContractAddress {
    0.try_into().unwrap()
}

fn build(burn: u8, treasury: u8) -> PaymentConfig {
    PaymentConfigImpl::new(zero(), zero(), zero(), 0, 0, zero(), 0, 1_000_000, burn, treasury)
}

#[test]
fn test_burn_plus_treasury_at_boundary() {
    // 60 + 40 == 100 is allowed.
    let cfg = build(60, 40);
    assert!(cfg.burn_percentage == 60, "burn round-tripped");
    assert!(cfg.treasury_percentage == 40, "treasury round-tripped");
}

#[test]
fn test_default_split_round_trips() {
    // The pack purchase design doc commits to 80/20 by default.
    let cfg = build(80, 20);
    assert!(cfg.burn_percentage == 80, "");
    assert!(cfg.treasury_percentage == 20, "");
    assert!(cfg.key == PAYMENT_CONFIG_KEY, "singleton key");
}

#[test]
fn test_zero_split_allowed() {
    // 0 / 0 is degenerate but legal — useful for fixtures that don't
    // exercise the burn path.
    let cfg = build(0, 0);
    assert!(cfg.burn_percentage == 0, "");
    assert!(cfg.treasury_percentage == 0, "");
}

#[test]
#[should_panic(expected: "PaymentConfig: burn+treasury > 100")]
fn test_over_100_panics() {
    // 80 + 30 = 110 > 100 must reject — otherwise the pack price split
    // would over-allocate proceeds.
    let _ = build(80, 30);
}

#[test]
#[should_panic(expected: "PaymentConfig: burn+treasury > 100")]
fn test_max_u8_panics() {
    // Catch the obvious wraparound footgun: 255 + 0 must still be
    // rejected, not interpreted modulo something.
    let _ = build(255, 0);
}
