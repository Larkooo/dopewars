// GearTemplate — preset gear item available to bundle into a starterpack.
//
// Catalog model. PR-4 (content) seeds the 12 gear templates committed to in
// the design doc. PR-1d's setup script writes them; PR-1d's purchase
// contract reads the gear ids referenced by a Starterpack to populate the
// HustlerInstance loadout at mint time.
//
// `slot` mirrors the existing `config::hustlers::ItemSlot` enum (Weapon /
// Clothes / Feet / Transport) but stored as u8 to keep the model
// IntrospectPacked-friendly. PR-1e's game loop will translate it back to
// the enum when seeding the run.

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct GearTemplate {
    #[key]
    pub id: u8,
    // Display name.
    pub name: felt252,
    // Slot — see config::hustlers::ItemSlot for the canonical enum.
    // 0=Weapon, 1=Clothes, 2=Feet, 3=Transport.
    pub slot: u8,
    // Tier within the slot — same scale as the existing in-game upgrade tiers
    // (0..3). Affects the stat boost magnitude.
    pub tier: u8,
    // Flat stat boost applied while the hustler carries this gear.
    pub stat_boost: u16,
}

#[generate_trait]
pub impl GearTemplateImpl of GearTemplateTrait {
    fn new(id: u8, name: felt252, slot: u8, tier: u8, stat_boost: u16) -> GearTemplate {
        GearTemplate { id, name, slot, tier, stat_boost }
    }
}
