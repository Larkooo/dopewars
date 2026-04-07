// PaymentConfig — v2 economy plumbing for the starterpack purchase flow.
//
// Mirrors the relevant portion of nums' Config model (models/index.cairo +
// models/config.cairo) but scoped to payment / Ekubo concerns. The reward-
// curve fields (target_supply, max_score, average_score, average_weight) live
// on RyoConfig from PR-1a; this model holds the things RyoConfig doesn't:
//
// - the USDC quote token used for pricing starterpacks
// - Ekubo router/positions plus pool parameters for the USDC↔PAPER swap
// - base_price (USD per 1× stake) used by the catalog price formula
// - burn / treasury distribution percentages applied to the swapped PAPER
//
// PR-1d will read this model in the purchase contract; PR-1d's setup script
// will be the first thing to write it. Until then there are no readers, so
// this PR just adds the type and constructor.

use starknet::ContractAddress;

#[derive(Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct PaymentConfig {
    #[key]
    pub key: u8,
    // payment token used for starterpack purchases (e.g. USDC).
    pub usdc: ContractAddress,
    // Ekubo addresses used to swap USDC → PAPER on purchase.
    pub ekubo_router: ContractAddress,
    pub ekubo_positions: ContractAddress,
    // pool parameters used by the swap call.
    pub pool_fee: u128,
    pub pool_tick_spacing: u128,
    pub pool_extension: ContractAddress,
    pub pool_sqrt: u256,
    // base USD price for a 1× stake starterpack (USDC decimals — typically 6).
    pub base_price: u256,
    // distribution of swapped PAPER on purchase.
    // burn_percentage + treasury_percentage <= 100; remainder stays in the
    // purchase contract or routes to the vault depending on PR-1d's design.
    pub burn_percentage: u8,
    pub treasury_percentage: u8,
}

pub const PAYMENT_CONFIG_KEY: u8 = 0;

#[generate_trait]
pub impl PaymentConfigImpl of PaymentConfigTrait {
    fn new(
        usdc: ContractAddress,
        ekubo_router: ContractAddress,
        ekubo_positions: ContractAddress,
        pool_fee: u128,
        pool_tick_spacing: u128,
        pool_extension: ContractAddress,
        pool_sqrt: u256,
        base_price: u256,
        burn_percentage: u8,
        treasury_percentage: u8,
    ) -> PaymentConfig {
        assert!(
            burn_percentage.into() + treasury_percentage.into() <= 100_u16,
            "PaymentConfig: burn+treasury > 100",
        );
        PaymentConfig {
            key: PAYMENT_CONFIG_KEY,
            usdc,
            ekubo_router,
            ekubo_positions,
            pool_fee,
            pool_tick_spacing,
            pool_extension,
            pool_sqrt,
            base_price,
            burn_percentage,
            treasury_percentage,
        }
    }
}


#[cfg(test)]
mod tests {
    use super::*;

    fn zero() -> ContractAddress {
        0.try_into().unwrap()
    }

    fn build(burn: u8, treasury: u8) -> PaymentConfig {
        PaymentConfigImpl::new(
            zero(), zero(), zero(), 0, 0, zero(), 0, 1_000_000, burn, treasury,
        )
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
}
