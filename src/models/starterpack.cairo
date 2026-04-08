// Starterpack — purchasable bundle that mints one Hustler NFT.
//
// Catalog model. PR-1d's setup contract registers the four packs the design
// doc commits to (Naked $2 1×, Street $3.92 2×, Dealer $5.82 3×, Kingpin
// $7.68 4×); PR-1d's purchase contract reads a pack by id, runs the
// USDC↔PAPER swap + burn split, then mints a hustler from the pack's
// HustlerTemplate with the gear loadout from the pack's gear ids.
//
// Pricing: USD price = `PaymentConfig.base_price × stake × (1 - stake/100)`.
// `stake` is the multiplier baked into the pack (1..10) and is also the
// game multiplier the player gets at run time. The 1×/2×/3×/4× design ties
// the discount curve to the multiplier so high-stake packs feel cheaper per
// unit of stake.
//
// Per-pack `gear_ids` are stored as a fixed-size array of 4 u8 slots
// (one per ItemSlot — Weapon/Clothes/Feet/Transport). Slot index = ItemSlot
// u8 value. A `0` means "no gear in that slot" (the Naked $2 pack uses all
// zeros). Keeping it fixed-size makes the model IntrospectPacked-friendly
// without dragging in Span-based introspection.

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Starterpack {
    #[key]
    pub id: u8,
    // Display name.
    pub name: felt252,
    // HustlerTemplate id minted by this pack.
    pub hustler_template_id: u8,
    // Gear ids by slot. 0 = no gear in that slot.
    pub gear_weapon: u8,
    pub gear_clothes: u8,
    pub gear_feet: u8,
    pub gear_transport: u8,
    // Multiplier baked into the pack (1..10). Used both as the game
    // multiplier at run time and as an input to the price formula.
    pub stake_multiplier: u8,
    // Price in PAPER wei. PR-1d's purchase contract reads this directly so
    // the discount formula only runs once at registration time. PR-1f will
    // add a USDC quote on top (the buyer pays USDC, the contract still
    // burns this amount of PAPER via the Ekubo swap).
    pub price_paper: u128,
    // Whether this pack is currently buyable. Lets admin disable a pack
    // without re-deploying — e.g. retire a season's free pack.
    pub enabled: bool,
}

#[generate_trait]
pub impl StarterpackImpl of StarterpackTrait {
    fn new(
        id: u8,
        name: felt252,
        hustler_template_id: u8,
        gear_weapon: u8,
        gear_clothes: u8,
        gear_feet: u8,
        gear_transport: u8,
        stake_multiplier: u8,
        price_paper: u128,
    ) -> Starterpack {
        Starterpack {
            id,
            name,
            hustler_template_id,
            gear_weapon,
            gear_clothes,
            gear_feet,
            gear_transport,
            stake_multiplier,
            price_paper,
            enabled: true,
        }
    }
}
