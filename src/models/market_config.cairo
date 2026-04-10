// MarketConfig — daily gear shop pricing + burn split.
//
// Singleton model. Admin writes it via marketplace::set_config before
// the shop goes live. Prices are in PAPER wei (18 decimals) per tier.
// burn_percentage controls how much of each sale is burned vs sent to
// the treasury. Treasury address is read from PaymentConfig.

use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct MarketConfig {
    #[key]
    pub key: u8,
    // PAPER price per tier (wei).
    pub tier1_price: u256,
    pub tier2_price: u256,
    pub tier3_price: u256,
    // % of the sale price burned (0..100). The remainder goes to
    // PaymentConfig.treasury_address.
    pub burn_percentage: u8,
}

pub const MARKET_CONFIG_KEY: u8 = 0;

#[generate_trait]
pub impl MarketConfigImpl of MarketConfigTrait {
    fn new(
        tier1_price: u256, tier2_price: u256, tier3_price: u256, burn_percentage: u8,
    ) -> MarketConfig {
        assert!(burn_percentage <= 100, "MarketConfig: burn > 100");
        MarketConfig { key: MARKET_CONFIG_KEY, tier1_price, tier2_price, tier3_price, burn_percentage }
    }

    fn price_for_tier(self: @MarketConfig, tier: u8) -> u256 {
        if tier == 1 {
            *self.tier1_price
        } else if tier == 2 {
            *self.tier2_price
        } else if tier == 3 {
            *self.tier3_price
        } else {
            0
        }
    }
}
