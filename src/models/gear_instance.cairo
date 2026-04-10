// GearInstance — a single owned gear unit.
//
// Minted by the marketplace when a player buys from the daily shop.
// Single-use: once equipped onto a hustler via `marketplace.equip`,
// the gear is consumed (equipped_to set to the hustler's token_id).
// When the hustler plays and dies (single-use), the gear dies with it.
// Owner is set at mint and stays — no transfer entrypoint for v1.

use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct GearInstance {
    #[key]
    pub id: u32,
    // Wallet that owns this gear unit.
    pub owner: ContractAddress,
    // Which GearTemplate this is an instance of.
    pub template_id: u8,
    // Day number (block_timestamp / 86400) when it was purchased.
    pub purchased_day: u32,
    // Hustler token_id this gear is equipped to. 0 = in inventory
    // (available to equip). Non-zero = consumed (bound to a hustler,
    // can't be equipped elsewhere).
    pub equipped_to: u64,
}

#[generate_trait]
pub impl GearInstanceImpl of GearInstanceTrait {
    fn new(
        id: u32, owner: ContractAddress, template_id: u8, purchased_day: u32,
    ) -> GearInstance {
        GearInstance { id, owner, template_id, purchased_day, equipped_to: 0 }
    }
}
