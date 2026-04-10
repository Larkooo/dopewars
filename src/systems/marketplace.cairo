// Marketplace — daily gear shop.
//
// Each day the shop offers one random gear item per slot from the
// full 72-item catalog. The pick is deterministic: poseidon_hash(day,
// slot) % items_in_slot. Pricing is based on the item's tier read
// from the GearTemplate model (tier 1 = best/most expensive, tier 3
// = worst/cheapest — original dopewars convention).
//
// Each player can buy at most 1 item per slot per day. Payment is in
// PAPER: a configurable `burn_percentage` of the price is burned
// (deflationary pressure on PAPER supply), the remainder is sent to
// `PaymentConfig.treasury_address`.
//
// The marketplace reads MarketConfig for per-tier pricing and
// PaymentConfig for the treasury address. Both must be set by the
// admin before the shop is usable.

#[starknet::interface]
pub trait IMarketplace<T> {
    /// What's on sale today. Returns (weapon_template, clothes_template,
    /// feet_template, transport_template, _reserved, day_number).
    fn today_offer(self: @T) -> (u8, u8, u8, u8, u8, u32);

    /// Buy one item from today's shop for the given slot (0..3).
    /// Caller must have pre-approved the marketplace for the PAPER
    /// price of today's item (varies by tier).
    fn buy(ref self: T, slot: u8);

    /// Quote the PAPER price for a slot in today's shop. Reads the
    /// item's tier from GearTemplate and returns the per-tier price
    /// from MarketConfig.
    fn quote(self: @T, slot: u8) -> u256;
}

#[starknet::interface]
pub trait IMarketplaceAdmin<T> {
    /// Set the per-tier PAPER prices and the burn split.
    fn set_config(
        ref self: T,
        tier1_price: u256,
        tier2_price: u256,
        tier3_price: u256,
        burn_percentage: u8,
    );
}

#[dojo::contract]
pub mod marketplace {
    use core::num::traits::Zero;
    use dojo::model::ModelStorage;
    use dojo::world::{IWorldDispatcherTrait, WorldStorageTrait};
    use openzeppelin::interfaces::token::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use rollyourown::constants::ns;
    use rollyourown::helpers::daily_shop;
    use rollyourown::models::daily_purchase::DailyPurchase;
    use rollyourown::models::gear_instance::GearInstanceTrait;
    use rollyourown::models::gear_template::GearTemplate;
    use rollyourown::models::market_config::{MARKET_CONFIG_KEY, MarketConfig, MarketConfigTrait};
    use rollyourown::models::payment_config::{PAYMENT_CONFIG_KEY, PaymentConfig};
    use rollyourown::tokens::paper::{IPaperTokenDispatcher, IPaperTokenDispatcherTrait};
    use super::{IMarketplace, IMarketplaceAdmin};

    pub mod ERRORS {
        pub const INVALID_SLOT: felt252 = 'Market: invalid slot';
        pub const ALREADY_BOUGHT: felt252 = 'Market: already bought today';
        pub const PRICE_ZERO: felt252 = 'Market: price not configured';
    }

    fn dojo_init(ref self: ContractState) {
        // No-op. Admin calls set_config after deploy.
    }

    #[abi(embed_v0)]
    impl MarketplaceImpl of IMarketplace<ContractState> {
        fn today_offer(self: @ContractState) -> (u8, u8, u8, u8, u8, u32) {
            let now = starknet::get_block_timestamp();
            let day = daily_shop::day_number(now);
            (
                daily_shop::todays_item(now, 0),
                daily_shop::todays_item(now, 1),
                daily_shop::todays_item(now, 2),
                daily_shop::todays_item(now, 3),
                0, // reserved
                day,
            )
        }

        fn buy(ref self: ContractState, slot: u8) {
            // [Check] Valid slot.
            assert(slot <= 3, ERRORS::INVALID_SLOT);

            let mut world = self.world(@ns());
            let now = starknet::get_block_timestamp();
            let day = daily_shop::day_number(now);
            let template_id = daily_shop::todays_item(now, slot);
            let caller = starknet::get_caller_address();

            // [Check] One per slot per day.
            let existing: DailyPurchase = world.read_model((caller, slot, day));
            assert(!existing.purchased, ERRORS::ALREADY_BOUGHT);

            // [Read] The item's tier from the catalog to look up pricing.
            let gear: GearTemplate = world.read_model(template_id);
            let market_config: MarketConfig = world.read_model(MARKET_CONFIG_KEY);
            let price = market_config.price_for_tier(gear.tier);
            assert(price > 0, ERRORS::PRICE_ZERO);

            // [Read] Treasury address from PaymentConfig.
            let payment_config: PaymentConfig = world.read_model(PAYMENT_CONFIG_KEY);

            // [Interaction] Pull PAPER from buyer.
            let paper_address = world.dns_address(@"paper").expect('paper not found');
            let paper_erc20 = IERC20Dispatcher { contract_address: paper_address };
            let this = starknet::get_contract_address();
            paper_erc20.transfer_from(caller, this, price);

            // [Interaction] Burn share.
            let burn_amount = price * market_config.burn_percentage.into() / 100_u256;
            if burn_amount > 0 {
                let paper = IPaperTokenDispatcher { contract_address: paper_address };
                paper.burn(burn_amount);
            }

            // [Interaction] Treasury share (remainder).
            let treasury_amount = price - burn_amount;
            if treasury_amount > 0
                && payment_config.treasury_address.is_non_zero() {
                paper_erc20.transfer(payment_config.treasury_address, treasury_amount);
            }

            // [Effect] Mint GearInstance.
            let gear_id = world.dispatcher.uuid();
            let instance = GearInstanceTrait::new(gear_id, caller, template_id, day);
            world.write_model(@instance);

            // [Effect] Record the daily purchase limit.
            let daily = DailyPurchase {
                player: caller,
                slot: slot,
                day: day,
                purchased: true,
                gear_instance_id: gear_id,
            };
            world.write_model(@daily);
        }

        fn quote(self: @ContractState, slot: u8) -> u256 {
            assert(slot <= 3, ERRORS::INVALID_SLOT);
            let world = self.world(@ns());
            let now = starknet::get_block_timestamp();
            let template_id = daily_shop::todays_item(now, slot);
            // Read the item's tier from the catalog.
            let gear: GearTemplate = world.read_model(template_id);
            let market_config: MarketConfig = world.read_model(MARKET_CONFIG_KEY);
            market_config.price_for_tier(gear.tier)
        }
    }

    #[abi(embed_v0)]
    impl MarketplaceAdminImpl of IMarketplaceAdmin<ContractState> {
        fn set_config(
            ref self: ContractState,
            tier1_price: u256,
            tier2_price: u256,
            tier3_price: u256,
            burn_percentage: u8,
        ) {
            let mut world = self.world(@ns());
            let config = MarketConfigTrait::new(
                tier1_price, tier2_price, tier3_price, burn_percentage,
            );
            world.write_model(@config);
        }
    }
}
