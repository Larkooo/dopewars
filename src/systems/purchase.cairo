// Purchase — buy a starterpack, get a Hustler NFT.
//
// First call site for the v2 economy plumbing. Wires together everything
// PR-1a..1c laid down:
//
//   - Reads a Starterpack from the catalog (PR-1c)
//   - Pulls PAPER from the buyer via ERC20::transfer_from (PR-1b)
//   - Burns the PAPER, applying real supply pressure that the rewarder reads
//     in PR-1e's register_score (PR-1a math)
//   - Mints a Hustler NFT to the buyer via the Hustler ERC721 (PR-1c)
//   - Writes a HustlerInstance with the pack's loadout so the game contract
//     in PR-1e can seed run-time state from it
//
// Deferred to PR-1f: Ekubo USDC↔PAPER swap so buyers can pay in stable USDC
// instead of holding PAPER directly. This contract's interface stays the
// same; the burn step just gets sourced from a swap result instead of a
// direct transfer_from.
//
// MINTER_ROLE on PAPER and Hustler must be granted to this contract by the
// admin after deploy via the standard IAccessControl::grant_role
// entrypoint. Burning PAPER does not require MINTER_ROLE — only the
// hustler.mint call does — but the symmetric grant is documented here so
// the deploy script doesn't have to guess.

use rollyourown::models::starterpack::Starterpack;

#[starknet::interface]
pub trait IPurchase<T> {
    /// Buy `pack_id` from the catalog. Pulls `Starterpack.price_paper` PAPER
    /// from the caller (which must have been pre-approved), burns it, and
    /// mints one fresh Hustler NFT to the caller. Returns the new
    /// hustler token id.
    fn buy(ref self: T, pack_id: u8) -> u64;

    /// Read a starterpack from the catalog. Convenience wrapper for clients
    /// that don't want to talk to dojo directly.
    fn get_starterpack(self: @T, pack_id: u8) -> Starterpack;

    /// Admin: register or replace a starterpack. The dojo_init below seeds
    /// the four packs the design doc commits to; this entrypoint lets the
    /// admin add seasonal / promotional packs without redeploying.
    fn register_starterpack(ref self: T, pack: Starterpack);

    /// Admin: enable / disable a pack without rewriting it.
    fn set_pack_enabled(ref self: T, pack_id: u8, enabled: bool);
}

#[dojo::contract]
pub mod purchase {
    use dojo::model::ModelStorage;
    use dojo::utils::selector_from_names;
    use dojo::world::{IWorldDispatcherTrait, WorldStorageTrait};
    use openzeppelin::interfaces::token::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use rollyourown::constants::ns;
    use rollyourown::models::hustler_instance::HustlerInstanceTrait;
    use rollyourown::models::starterpack::{Starterpack, StarterpackTrait};
    use rollyourown::tokens::hustler::{IHustlerDispatcher, IHustlerDispatcherTrait};
    use rollyourown::tokens::paper::{IPaperTokenDispatcher, IPaperTokenDispatcherTrait};
    use starknet::get_caller_address;

    // Price formula constants. Mirrors the design doc's
    //   `price = stake * base * (100 - stake) / 100`
    // (the 1×/2×/3×/4× discount curve from nums) so a $2 base + multiplier
    // of 1..4 yields {Naked: 1.98, Street: 3.92, Dealer: 5.82, Kingpin: 7.68}.
    //
    // PR-1d uses PAPER as the entry currency, so BASE_PRICE_PAPER is in
    // PAPER wei (1000 PAPER * 10^18). PR-1f swaps the semantics: base price
    // becomes USDC and the swap result fixes the burn-side amount.
    const BASE_PRICE_PAPER: u128 = 1000_u128 * 1_000_000_000_000_000_000_u128;

    // Pack ids registered at init.
    const PACK_NAKED: u8 = 1;
    const PACK_STREET: u8 = 2;
    const PACK_DEALER: u8 = 3;
    const PACK_KINGPIN: u8 = 4;

    // Hustler template ids referenced by the seeded packs. Content PR seeds
    // the actual HustlerTemplate rows; this contract only stores the ids.
    const TEMPLATE_NAKED: u8 = 1;
    const TEMPLATE_STREET: u8 = 2;
    const TEMPLATE_DEALER: u8 = 3;
    const TEMPLATE_KINGPIN: u8 = 4;

    // Errors

    pub mod ERRORS {
        pub const PURCHASE_PACK_DISABLED: felt252 = 'Purchase: pack disabled';
        pub const PURCHASE_PACK_MISSING: felt252 = 'Purchase: pack does not exist';
        pub const PURCHASE_NOT_OWNER: felt252 = 'Purchase: caller not owner';
    }

    fn dojo_init(ref self: ContractState) {
        // Seed the four packs the design doc commits to. Gear ids are 0
        // (no gear) so PR-1d ships a buyable catalog without depending on
        // PR-4's content. Admin can re-register any pack later via
        // register_starterpack.
        //
        // The Naked pack ships with no gear at all — buyers fill the slots
        // from a future marketplace. Higher-tier packs would normally
        // pre-load gear; for PR-1d we keep them empty too and let PR-4
        // overwrite with real loadouts.
        let mut world = self.world(@ns());
        let mut packs = array![
            self.build_pack(PACK_NAKED, 'Naked', TEMPLATE_NAKED, 1),
            self.build_pack(PACK_STREET, 'Street', TEMPLATE_STREET, 2),
            self.build_pack(PACK_DEALER, 'Dealer', TEMPLATE_DEALER, 3),
            self.build_pack(PACK_KINGPIN, 'Kingpin', TEMPLATE_KINGPIN, 4),
        ];
        while let Option::Some(pack) = packs.pop_front() {
            world.write_model(@pack);
        };
    }

    #[abi(embed_v0)]
    impl PurchaseImpl of super::IPurchase<ContractState> {
        fn buy(ref self: ContractState, pack_id: u8) -> u64 {
            let mut world = self.world(@ns());
            let buyer = get_caller_address();

            // [Read] pack
            let pack: Starterpack = world.read_model(pack_id);
            assert(pack.id == pack_id, ERRORS::PURCHASE_PACK_MISSING);
            assert(pack.enabled, ERRORS::PURCHASE_PACK_DISABLED);

            // [Lookup] PAPER + Hustler dispatchers via the world DNS.
            let paper_address = world.dns_address(@"paper").expect('paper not found');
            let hustler_address = world.dns_address(@"hustler").expect('hustler not found');
            let paper_erc20 = IERC20Dispatcher { contract_address: paper_address };
            let paper = IPaperTokenDispatcher { contract_address: paper_address };
            let hustler = IHustlerDispatcher { contract_address: hustler_address };

            // [Effect] Pull PAPER from the buyer to this contract. The
            // buyer must have called paper.approve(this, price_paper) first.
            let price: u256 = pack.price_paper.into();
            let this = starknet::get_contract_address();
            paper_erc20.transfer_from(buyer, this, price);

            // [Effect] Burn the PAPER. paper.burn() burns from the caller,
            // which is now this contract.
            paper.burn(price);

            // [Effect] Mint a Hustler NFT to the buyer.
            let token_id = hustler.mint(buyer, false);

            // [Effect] Record the per-token state so PR-1e's game loop can
            // seed runs from it.
            let instance = HustlerInstanceTrait::new_from_pack(
                token_id,
                pack.id,
                pack.hustler_template_id,
                pack.gear_weapon,
                pack.gear_clothes,
                pack.gear_feet,
                pack.gear_transport,
            );
            world.write_model(@instance);

            token_id
        }

        fn get_starterpack(self: @ContractState, pack_id: u8) -> Starterpack {
            let world = self.world(@ns());
            world.read_model(pack_id)
        }

        fn register_starterpack(ref self: ContractState, pack: Starterpack) {
            self.assert_caller_is_owner();
            let mut world = self.world(@ns());
            world.write_model(@pack);
        }

        fn set_pack_enabled(ref self: ContractState, pack_id: u8, enabled: bool) {
            self.assert_caller_is_owner();
            let mut world = self.world(@ns());
            let mut pack: Starterpack = world.read_model(pack_id);
            assert(pack.id == pack_id, ERRORS::PURCHASE_PACK_MISSING);
            pack.enabled = enabled;
            world.write_model(@pack);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Build a pack with the formula price already applied. Gear ids are
        /// 0 (no gear pre-equipped); PR-4 will overwrite with real loadouts.
        fn build_pack(
            self: @ContractState, id: u8, name: felt252, template_id: u8, stake: u8,
        ) -> Starterpack {
            StarterpackTrait::new(
                id,
                name,
                template_id,
                0, // gear_weapon
                0, // gear_clothes
                0, // gear_feet
                0, // gear_transport
                stake,
                discount_price(stake),
            )
        }

        #[inline(always)]
        fn assert_caller_is_owner(self: @ContractState) {
            let caller = get_caller_address();
            let selector = selector_from_names(@ns(), @"purchase");
            assert(
                self.world(@ns()).dispatcher.is_owner(selector, caller),
                ERRORS::PURCHASE_NOT_OWNER,
            );
        }
    }

    /// price_paper = stake × BASE_PRICE_PAPER × (100 - stake) / 100
    /// Mirrors the nums discount curve. Used by both dojo_init seeding and
    /// the design doc's catalog table.
    fn discount_price(stake: u8) -> u128 {
        let stake_u128: u128 = stake.into();
        stake_u128 * BASE_PRICE_PAPER * (100_u128 - stake_u128) / 100_u128
    }
}
