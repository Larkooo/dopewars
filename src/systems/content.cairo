// Content — seeds the canonical hustler + gear catalog at deploy time.
//
// Ported from the original dopewars `libraries/dopewars_items.cairo`
// which defines 72 gear items across 4 slots (18 weapons, 20 clothes,
// 17 feet, 17 transport), each assigned a tier 1-3. Tier numbering
// matches the original: **tier 1 = best, tier 3 = worst**.
//
// Base stat_boost values are the level-0 stats from the original
// `get_tier_config`. The upgrade system (levels 1-3 with escalating
// cost) is a followup — this PR ports the catalog, not the progression.
//
// ID scheme: sequential 1..72, grouped by v2 slot:
//   Weapon  (slot 0): ids  1..18
//   Clothes (slot 1): ids 19..38
//   Feet    (slot 2): ids 39..55
//   Transport(slot 3): ids 56..72

use rollyourown::models::gear_template::GearTemplate;
use rollyourown::models::hustler_template::HustlerTemplate;

// Catalog counts exported for the daily shop + marketplace.
pub const WEAPON_COUNT: u8 = 18;
pub const CLOTHES_COUNT: u8 = 20;
pub const FEET_COUNT: u8 = 17;
pub const TRANSPORT_COUNT: u8 = 17;
pub const WEAPON_FIRST_ID: u8 = 1;
pub const CLOTHES_FIRST_ID: u8 = 19;
pub const FEET_FIRST_ID: u8 = 39;
pub const TRANSPORT_FIRST_ID: u8 = 56;

#[starknet::interface]
pub trait IContent<T> {
    fn get_hustler_template(self: @T, template_id: u8) -> HustlerTemplate;
    fn get_gear_template(self: @T, gear_id: u8) -> GearTemplate;
    fn register_hustler_template(ref self: T, template: HustlerTemplate);
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

    const SLOT_WEAPON: u8 = 0;
    const SLOT_CLOTHES: u8 = 1;
    const SLOT_FEET: u8 = 2;
    const SLOT_TRANSPORT: u8 = 3;

    // Base stats from the original get_tier_config level 0.
    // Tier 1 = best, tier 3 = worst (original convention).
    //
    // Weapon/Clothes: tier1=10, tier2=12, tier3=14
    //   (paradoxically tier-3 has higher BASE but lower MAX —
    //   cheap items start ok but don't scale. We port the base.)
    // Transport: tier1=900, tier2=1000, tier3=1100
    // Feet: tier1=6, tier2=8, tier3=10

    fn dojo_init(ref self: ContractState) {
        let mut world = self.world(@ns());

        // === HustlerTemplates 1..4 ===
        // All four share identical stats — the only thing that differs
        // across tiers is the stake multiplier (set on the Starterpack,
        // not on the template). This means a Junkie and a Kingpin start
        // every run with the same health / cash / combat — the Kingpin
        // just gets a bigger reward payout at game end. No pay-to-win;
        // gear progression is 100% earned via the marketplace + in-game
        // shop.
        let mut hustlers = array![
            HustlerTemplateTrait::new(1, 'Junkie', 90, 0, 10, 10, 10),
            HustlerTemplateTrait::new(2, 'Street', 90, 0, 10, 10, 10),
            HustlerTemplateTrait::new(3, 'Dealer', 90, 0, 10, 10, 10),
            HustlerTemplateTrait::new(4, 'Kingpin', 90, 0, 10, 10, 10),
        ];
        while let Option::Some(t) = hustlers.pop_front() {
            world.write_model(@t);
        };

        // === Weapons (slot 0, ids 1..18) ===
        // Ported from dopewars_items.cairo slot 0.
        // tier assignment matches the original get_item_tier.
        let mut weapons = array![
            GearTemplateTrait::new(1, 'Pocket Knife', SLOT_WEAPON, 3, 14),
            GearTemplateTrait::new(2, 'Chain', SLOT_WEAPON, 2, 12),
            GearTemplateTrait::new(3, 'Knife', SLOT_WEAPON, 3, 14),
            GearTemplateTrait::new(4, 'Crowbar', SLOT_WEAPON, 3, 14),
            GearTemplateTrait::new(5, 'Handgun', SLOT_WEAPON, 1, 10),
            GearTemplateTrait::new(6, 'AK47', SLOT_WEAPON, 1, 10),
            GearTemplateTrait::new(7, 'Shovel', SLOT_WEAPON, 2, 12),
            GearTemplateTrait::new(8, 'Baseball Bat', SLOT_WEAPON, 2, 12),
            GearTemplateTrait::new(9, 'Tire Iron', SLOT_WEAPON, 3, 14),
            GearTemplateTrait::new(10, 'Police Baton', SLOT_WEAPON, 3, 14),
            GearTemplateTrait::new(11, 'Pepper Spray', SLOT_WEAPON, 2, 12),
            GearTemplateTrait::new(12, 'Razor Blade', SLOT_WEAPON, 3, 14),
            GearTemplateTrait::new(13, 'Drone', SLOT_WEAPON, 1, 10),
            GearTemplateTrait::new(14, 'Taser', SLOT_WEAPON, 2, 12),
            GearTemplateTrait::new(15, 'Brass Knuckles', SLOT_WEAPON, 3, 14),
            GearTemplateTrait::new(16, 'Shotgun', SLOT_WEAPON, 1, 10),
            GearTemplateTrait::new(17, 'Glock', SLOT_WEAPON, 1, 10),
            GearTemplateTrait::new(18, 'Uzi', SLOT_WEAPON, 1, 10),
        ];
        while let Option::Some(g) = weapons.pop_front() {
            world.write_model(@g);
        };

        // === Clothes (slot 1, ids 19..38) ===
        let mut clothes = array![
            GearTemplateTrait::new(19, 'White T Shirt', SLOT_CLOTHES, 3, 14),
            GearTemplateTrait::new(20, 'Black T Shirt', SLOT_CLOTHES, 3, 14),
            GearTemplateTrait::new(21, 'White Hoodie', SLOT_CLOTHES, 2, 12),
            GearTemplateTrait::new(22, 'Black Hoodie', SLOT_CLOTHES, 2, 12),
            GearTemplateTrait::new(23, 'Bulletproof Vest', SLOT_CLOTHES, 1, 10),
            GearTemplateTrait::new(24, '3 Piece Suit', SLOT_CLOTHES, 1, 10),
            GearTemplateTrait::new(25, 'Checkered Shirt', SLOT_CLOTHES, 3, 14),
            GearTemplateTrait::new(26, 'Bikini', SLOT_CLOTHES, 3, 14),
            GearTemplateTrait::new(27, 'Golden Shirt', SLOT_CLOTHES, 2, 12),
            GearTemplateTrait::new(28, 'Leather Vest', SLOT_CLOTHES, 2, 12),
            GearTemplateTrait::new(29, 'Blood Stained Shirt', SLOT_CLOTHES, 1, 10),
            GearTemplateTrait::new(30, 'Police Uniform', SLOT_CLOTHES, 1, 10),
            GearTemplateTrait::new(31, 'Combat Jacket', SLOT_CLOTHES, 1, 10),
            GearTemplateTrait::new(32, 'Basketball Jersey', SLOT_CLOTHES, 2, 12),
            GearTemplateTrait::new(33, 'Track Suit', SLOT_CLOTHES, 2, 12),
            GearTemplateTrait::new(34, 'Trenchcoat', SLOT_CLOTHES, 1, 10),
            GearTemplateTrait::new(35, 'White Tank Top', SLOT_CLOTHES, 1, 10),
            GearTemplateTrait::new(36, 'Black Tank Top', SLOT_CLOTHES, 1, 10),
            GearTemplateTrait::new(37, 'Shirtless', SLOT_CLOTHES, 3, 14),
            GearTemplateTrait::new(38, 'Naked', SLOT_CLOTHES, 3, 14),
        ];
        while let Option::Some(g) = clothes.pop_front() {
            world.write_model(@g);
        };

        // === Feet (slot 2, ids 39..55) ===
        // Original slot 5, remapped to v2 slot 2.
        let mut feet = array![
            GearTemplateTrait::new(39, 'Black Air Force 1s', SLOT_FEET, 1, 6),
            GearTemplateTrait::new(40, 'White Forces', SLOT_FEET, 1, 6),
            GearTemplateTrait::new(41, 'Air Jordan 1s', SLOT_FEET, 1, 6),
            GearTemplateTrait::new(42, 'Gucci Tennis 84', SLOT_FEET, 1, 6),
            GearTemplateTrait::new(43, 'Air Max 95', SLOT_FEET, 1, 6),
            GearTemplateTrait::new(44, 'Timberlands', SLOT_FEET, 2, 8),
            GearTemplateTrait::new(45, 'Reebok Classics', SLOT_FEET, 1, 6),
            GearTemplateTrait::new(46, 'Flip Flops', SLOT_FEET, 3, 10),
            GearTemplateTrait::new(47, 'Nike Cortez', SLOT_FEET, 1, 6),
            GearTemplateTrait::new(48, 'Dress Shoes', SLOT_FEET, 3, 10),
            GearTemplateTrait::new(49, 'Converse All Stars', SLOT_FEET, 2, 8),
            GearTemplateTrait::new(50, 'White Slippers', SLOT_FEET, 2, 8),
            GearTemplateTrait::new(51, 'Gucci Slides', SLOT_FEET, 2, 8),
            GearTemplateTrait::new(52, 'Alligator Shoes', SLOT_FEET, 3, 10),
            GearTemplateTrait::new(53, 'Socks', SLOT_FEET, 3, 10),
            GearTemplateTrait::new(54, 'Open Toe Sandals', SLOT_FEET, 3, 10),
            GearTemplateTrait::new(55, 'Barefoot', SLOT_FEET, 3, 10),
        ];
        while let Option::Some(g) = feet.pop_front() {
            world.write_model(@g);
        };

        // === Transport (slot 3, ids 56..72) ===
        // Original slot 2, remapped to v2 slot 3.
        let mut transport = array![
            GearTemplateTrait::new(56, 'Dodge', SLOT_TRANSPORT, 1, 900),
            GearTemplateTrait::new(57, 'Porsche', SLOT_TRANSPORT, 1, 900),
            GearTemplateTrait::new(58, 'Tricycle', SLOT_TRANSPORT, 3, 1100),
            GearTemplateTrait::new(59, 'Scooter', SLOT_TRANSPORT, 3, 1100),
            GearTemplateTrait::new(60, 'ATV', SLOT_TRANSPORT, 2, 1000),
            GearTemplateTrait::new(61, 'Push Bike', SLOT_TRANSPORT, 3, 1100),
            GearTemplateTrait::new(62, 'Electric Scooter', SLOT_TRANSPORT, 2, 1000),
            GearTemplateTrait::new(63, 'Golf Cart', SLOT_TRANSPORT, 3, 1100),
            GearTemplateTrait::new(64, 'Chopper', SLOT_TRANSPORT, 2, 1000),
            GearTemplateTrait::new(65, 'Rollerblades', SLOT_TRANSPORT, 3, 1100),
            GearTemplateTrait::new(66, 'Lowrider', SLOT_TRANSPORT, 1, 900),
            GearTemplateTrait::new(67, 'Camper', SLOT_TRANSPORT, 1, 900),
            GearTemplateTrait::new(68, 'Rolls Royce', SLOT_TRANSPORT, 1, 900),
            GearTemplateTrait::new(69, 'BMW M3', SLOT_TRANSPORT, 2, 1000),
            GearTemplateTrait::new(70, 'Bike', SLOT_TRANSPORT, 3, 1100),
            GearTemplateTrait::new(71, 'C63 AMG', SLOT_TRANSPORT, 2, 1000),
            GearTemplateTrait::new(72, 'G Wagon', SLOT_TRANSPORT, 1, 900),
        ];
        while let Option::Some(g) = transport.pop_front() {
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
