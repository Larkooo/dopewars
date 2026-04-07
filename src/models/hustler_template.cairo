// HustlerTemplate — preset stats for a hustler archetype.
//
// Catalog model. PR-1d's setup script seeds the four templates the design
// doc commits to (Naked / Street / Dealer / Kingpin); PR-1d's purchase
// contract reads the template referenced by a Starterpack to mint a fresh
// hustler with those stats. PR-1e's game contract reads the template id off
// the HustlerInstance to seed run-time state.
//
// Stats are deliberately small and additive — gear gets layered on top via
// GearTemplate. The numbers themselves are content (PR-4); PR-1c only
// commits to the schema.

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct HustlerTemplate {
    #[key]
    pub id: u8,
    // Display name (felt252 is fine — short string).
    pub name: felt252,
    // Base stats. Gear adds on top of these.
    pub health: u8,
    pub starting_cash: u32,
    pub attack: u8,
    pub defense: u8,
    pub cargo: u8,
}

#[generate_trait]
pub impl HustlerTemplateImpl of HustlerTemplateTrait {
    fn new(
        id: u8,
        name: felt252,
        health: u8,
        starting_cash: u32,
        attack: u8,
        defense: u8,
        cargo: u8,
    ) -> HustlerTemplate {
        HustlerTemplate { id, name, health, starting_cash, attack, defense, cargo }
    }
}
