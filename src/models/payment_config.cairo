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
