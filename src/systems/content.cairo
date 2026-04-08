// Content — seeds the canonical hustler + gear catalog at deploy time.
//
// PR-1c committed to the schema for `HustlerTemplate` and `GearTemplate`;
// PR-1d's purchase contract references hustler template ids 1..4 from its
// own dojo_init seed but leaves the actual template + gear rows for "PR-4
// content". This contract is that PR-4: a single dojo_init that writes the
// 16 catalog rows the design doc commits to.
//
// Why a separate contract instead of folding the seeding into purchase or
// ryo:
//   - separation of concerns: purchase deals with the buy flow, ryo holds
//     game-wide config, content holds catalog content
//   - lets ops re-seed content (via the admin entrypoints below) without
//     touching the purchase flow or risking double-init on a re-deploy
//   - the production deploy script can grant content the writer role on
//     just the catalog models, not the full namespace
//
// Stat consumers (Player::new reading template stats, gear stat_boost
// flowing into trading/encounters/combat) are NOT wired in this PR. The
// dopewars game loop still pulls initial cash + health from
// SeasonSettings → GameConfig, and gear effects use the legacy item-tier
// path. PR-4 plants the data; a follow-up wires it through.

use rollyourown::models::gear_template::GearTemplate;
use rollyourown::models::hustler_template::HustlerTemplate;

#[starknet::interface]
pub trait IContent<T> {
    /// Read a hustler template from the catalog.
    fn get_hustler_template(self: @T, template_id: u8) -> HustlerTemplate;
    /// Read a gear template from the catalog.
    fn get_gear_template(self: @T, gear_id: u8) -> GearTemplate;
    /// Admin: register or replace a hustler template. Lets the admin add
    /// seasonal hustlers or rebalance stats without redeploying the
    /// contract.
    fn register_hustler_template(ref self: T, template: HustlerTemplate);
    /// Admin: register or replace a gear template.
    fn register_gear_template(ref self: T, gear: GearTemplate);
}

#[dojo::contract]
pub mod content {
    use dojo::model::ModelStorage;
    use dojo::utils::selector_from_names;
    use dojo::world::IWorldDispatcherTrait;
    use rollyourown::constants::ns;
    use rollyourown::models::gear_template::{GearTemplate, GearTemplateTrait};
    use rollyourown::models::hustler_template::{HustlerTemplate, HustlerTemplateTrait};
    use starknet::get_caller_address;

    pub mod ERRORS {
        pub const CONTENT_NOT_OWNER: felt252 = 'Content: caller not owner';
    }

    // Slot ids — mirror config::hustlers::ItemSlot but stored as u8 since
    // GearTemplate.slot is u8 (IntrospectPacked-friendly).
    const SLOT_WEAPON: u8 = 0;
    const SLOT_CLOTHES: u8 = 1;
    const SLOT_FEET: u8 = 2;
    const SLOT_TRANSPORT: u8 = 3;

    fn dojo_init(ref self: ContractState) {
        let mut world = self.world(@ns());

        // [Seed] HustlerTemplates 1..4. Stats step up by tier — Naked is
        // the entry-point template (cheapest pack, weakest stats), Kingpin
        // is top of the curve. Numbers are deliberately conservative so a
        // future balancing pass can revise without breaking the schema.
        //
        // Health is bounded above 100 (the legacy SeasonSettings::Healthy
        // ceiling) so a Kingpin hustler isn't auto-capped by the existing
        // game loop. Starting cash is layered on top of the season's
        // initial cash — these template values are intended as additive
        // bonuses once a future PR wires them into Player::new.
        let mut hustlers = array![
            HustlerTemplateTrait::new(1, 'Naked', 90, 0, 10, 10, 10),
            HustlerTemplateTrait::new(2, 'Street', 95, 500, 15, 12, 12),
            HustlerTemplateTrait::new(3, 'Dealer', 100, 1500, 20, 18, 18),
            HustlerTemplateTrait::new(4, 'Kingpin', 100, 3000, 30, 25, 25),
        ];
        while let Option::Some(t) = hustlers.pop_front() {
            world.write_model(@t);
        };

        // [Seed] GearTemplates 1..12 — three items per slot, tiers 1..3.
        // tier=1 is the entry item with a small stat boost, tier=3 is the
        // best in slot. stat_boost values are illustrative; the consumer
        // (a future PR that translates gear ids into trading/combat
        // modifiers) will likely scale them.
        let mut gear = array![
            // Weapons (slot 0)
            GearTemplateTrait::new(1, 'Knife', SLOT_WEAPON, 1, 5),
            GearTemplateTrait::new(2, 'Pistol', SLOT_WEAPON, 2, 15),
            GearTemplateTrait::new(3, 'Uzi', SLOT_WEAPON, 3, 30),
            // Clothes (slot 1)
            GearTemplateTrait::new(4, 'Hoodie', SLOT_CLOTHES, 1, 5),
            GearTemplateTrait::new(5, 'Leather', SLOT_CLOTHES, 2, 15),
            GearTemplateTrait::new(6, 'Kevlar', SLOT_CLOTHES, 3, 30),
            // Feet (slot 2)
            GearTemplateTrait::new(7, 'Sneakers', SLOT_FEET, 1, 5),
            GearTemplateTrait::new(8, 'Boots', SLOT_FEET, 2, 15),
            GearTemplateTrait::new(9, 'Trainers', SLOT_FEET, 3, 30),
            // Transport (slot 3)
            GearTemplateTrait::new(10, 'Bicycle', SLOT_TRANSPORT, 1, 5),
            GearTemplateTrait::new(11, 'Scooter', SLOT_TRANSPORT, 2, 15),
            GearTemplateTrait::new(12, 'Sports Car', SLOT_TRANSPORT, 3, 30),
        ];
        while let Option::Some(g) = gear.pop_front() {
            world.write_model(@g);
        };
    }

    #[abi(embed_v0)]
    impl ContentImpl of super::IContent<ContractState> {
        fn get_hustler_template(self: @ContractState, template_id: u8) -> HustlerTemplate {
            let world = self.world(@ns());
            world.read_model(template_id)
        }

        fn get_gear_template(self: @ContractState, gear_id: u8) -> GearTemplate {
            let world = self.world(@ns());
            world.read_model(gear_id)
        }

        fn register_hustler_template(ref self: ContractState, template: HustlerTemplate) {
            self.assert_caller_is_owner();
            let mut world = self.world(@ns());
            world.write_model(@template);
        }

        fn register_gear_template(ref self: ContractState, gear: GearTemplate) {
            self.assert_caller_is_owner();
            let mut world = self.world(@ns());
            world.write_model(@gear);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        #[inline(always)]
        fn assert_caller_is_owner(self: @ContractState) {
            let caller = get_caller_address();
            let selector = selector_from_names(@ns(), @"content");
            assert(
                self.world(@ns()).dispatcher.is_owner(selector, caller),
                ERRORS::CONTENT_NOT_OWNER,
            );
        }
    }
}
