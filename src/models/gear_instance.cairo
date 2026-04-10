// GearInstance — a single owned gear unit.
//
// Minted by the marketplace when a player buys from the daily shop.
// Decoupled from HustlerInstance so gear can persist across hustler
// runs and be re-equipped to a fresh hustler later (equip flow is a
// separate PR). Owner is set at mint and stays — no transfer entrypoint
// for v1.

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
}

#[generate_trait]
pub impl GearInstanceImpl of GearInstanceTrait {
    fn new(
        id: u32, owner: ContractAddress, template_id: u8, purchased_day: u32,
    ) -> GearInstance {
        GearInstance { id, owner, template_id, purchased_day }
    }
}
