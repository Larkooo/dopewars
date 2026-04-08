// HustlerTemplate — preset stats for a hustler archetype.
//
// Catalog model. PR-4's content contract seeds the four templates the
// design doc commits to (Naked / Street / Dealer / Kingpin); PR-1d's
// purchase contract reads the template id off a Starterpack to write into
// HustlerInstance at mint time; PR-4b's create_game reads the template via
// the HustlerInstance and applies its stats on top of the season's
// GameConfig defaults to seed the new player.
//
// Stats are deliberately small and additive — gear gets layered on top via
// GearTemplate. The numbers themselves are content (PR-4); PR-1c only
// commits to the schema.

use rollyourown::config::game::GameConfig;

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

    /// Apply this template's stats on top of a season's GameConfig in
    /// place. Used by create_game to seed the per-run Player from the
    /// template the buyer selected at purchase time.
    ///
    /// Semantics:
    /// - `starting_cash` is **additive** on top of the season's baseline.
    ///   A template value of 0 (e.g. Naked) means "use the season default
    ///   only" — no bonus.
    /// - `health` **overrides** the season default if non-zero. A
    ///   template value of 0 means "use the season default" (a future
    ///   template might want this; the four canonical PR-4 templates all
    ///   set health explicitly).
    ///
    /// This method does NOT touch attack / defense / cargo — those flow
    /// into combat / encounters via a separate path that PR-4b doesn't
    /// wire. Once those consumers exist they'll read the template
    /// directly from the world rather than going through GameConfig.
    fn apply_to(self: HustlerTemplate, ref game_config: GameConfig) {
        if self.starting_cash > 0 {
            game_config.cash += self.starting_cash;
        }
        if self.health > 0 {
            game_config.health = self.health;
        }
    }
}
