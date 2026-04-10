// DailyPurchase — tracks the one-per-slot-per-day limit.
//
// Keyed by (player, slot, day). If a row exists with `purchased ==
// true`, the player already bought that slot's gear for that day.
// We use a boolean instead of checking `gear_instance_id != 0`
// because the world's uuid counter starts at 0 and the first gear
// mint can legitimately get id 0.

use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct DailyPurchase {
    #[key]
    pub player: ContractAddress,
    #[key]
    pub slot: u8,
    #[key]
    pub day: u32,
    // Whether the player already bought this slot today.
    pub purchased: bool,
    // The GearInstance id minted for this purchase.
    pub gear_instance_id: u32,
}
