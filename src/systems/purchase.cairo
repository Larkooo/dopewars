// Purchase — buy a starterpack, get a Hustler NFT.
//
// PR-1f redesign: this contract now mirrors the nums Setup contract
// (nums/contracts/src/systems/setup.cairo). It embeds arcade's
// `bundle` component directly via `component!(...)`, exposes the
// standard `IBundle::issue(...)` entrypoint to buyers, and implements
// the `BundleTrait::on_issue` callback to mint Hustler NFT(s) plus the
// matching `HustlerInstance` row(s) when a purchase clears.
//
// The bundle component owns the catalog state (price, payment_token,
// reissuable, total_issued, allower) inside its own `Bundle` model,
// runs the ERC20 `transfer_from` payment + referral / protocol fee
// distribution, then dispatches into the on_issue hook below — all
// in-process within this single contract. There is **no** external
// registry to deploy.
//
// Pricing: USDC. Each tier's price is computed once at registration
// time using the same discount curve as nums:
//
//     price = stake × base_price × (100 - stake) / 100
//
// `base_price` is currently a contract const matching the design doc's
// 1× tier (1000 PAPER wei). PR-1f-followup will wire the real USDC
// price + Ekubo swap-and-burn flow.
//
// Per-tier metadata (which HustlerTemplate to mint, gear loadout, stake
// multiplier) lives in the dopewars-side `Starterpack` model keyed by
// the bundle id the bundle component returns from `register(...)`. The
// on_issue callback reads it back to learn how to fill the
// HustlerInstance row.
//
// MINTER_ROLE on the Hustler ERC721 must be granted to this contract by
// the admin after deploy via the standard IAccessControl::grant_role
// entrypoint, same as PR-1d.

use rollyourown::models::starterpack::Starterpack;

// Discount curve constants — also exported for tests / clients that
// want to derive the canonical price without spinning up a contract.
//
// `BASE_PRICE_PAPER` mirrors the v2 design doc's 1000-PAPER 1× tier.
// PR-1f registers bundles with this as the payment amount; PR-1f-
// followup will swap it to USDC + an Ekubo PAPER burn.
pub const BASE_PRICE_PAPER: u128 = 1000_u128 * 1_000_000_000_000_000_000_u128;

/// price_paper = stake × BASE_PRICE_PAPER × (100 - stake) / 100
/// Mirrors the nums discount curve.
pub fn discount_price(stake: u8) -> u128 {
    let stake_u128: u128 = stake.into();
    stake_u128 * BASE_PRICE_PAPER * (100_u128 - stake_u128) / 100_u128
}

#[starknet::interface]
pub trait IPurchaseAdmin<T> {
    /// Register the four canonical paid tiers with the embedded
    /// BundleComponent. Must be called once after deploy. Splitting
    /// this from `dojo_init` matches arcade's own bundle test pattern
    /// (see `packages/bundle/src/tests/contract.cairo`) where bundle
    /// registration happens via a public entrypoint *after* the test
    /// world is spawned. The deploy script is expected to call this
    /// once on the production world too.
    fn initialize(ref self: T);

    /// Read a starterpack from the catalog by bundle id.
    fn get_starterpack(self: @T, bundle_id: u32) -> Starterpack;
}

#[dojo::contract]
pub mod purchase {
    use bundle::component::Component as BundleComponent;
    use bundle::component::Component::{BundleQuote, BundleTrait};
    use bundle::interface::IBundle;
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorageTrait;
    use rollyourown::constants::ns;
    use rollyourown::models::hustler_instance::HustlerInstanceTrait;
    use rollyourown::models::starterpack::{Starterpack, StarterpackTrait};
    use rollyourown::tokens::hustler::{IHustlerDispatcher, IHustlerDispatcherTrait};
    use starknet::ContractAddress;
    use super::IPurchaseAdmin;

    // Hustler template ids referenced by the seeded packs. Content PR
    // (PR-4) seeds the actual HustlerTemplate rows; this contract only
    // stores the ids.
    const TEMPLATE_NAKED: u8 = 1;
    const TEMPLATE_STREET: u8 = 2;
    const TEMPLATE_DEALER: u8 = 3;
    const TEMPLATE_KINGPIN: u8 = 4;

    // Number of paid tiers seeded by dojo_init.
    const PACK_COUNT: u32 = 4;

    // Components
    component!(path: BundleComponent, storage: bundle, event: BundleEvent);
    impl BundleInternalImpl = BundleComponent::InternalImpl<ContractState>;
    // Default no-op fee impl — protocol fee left at zero. A future
    // admin entrypoint can wire a real fee receiver if/when the
    // cartridge protocol fee gets activated.
    impl BundleFeeImpl of BundleComponent::BundleFeeTrait<ContractState> {}

    /// `BundleTrait::on_issue` — called by the embedded BundleComponent
    /// after `IBundle::issue` has pulled the buyer's payment token and
    /// distributed referral / protocol fees. The bundle id is the one
    /// the buyer specified, the recipient is the address that should
    /// receive the minted NFT(s), and `quantity` is how many copies of
    /// the bundle to issue (the bundle component already enforced
    /// `assert_quantity_allowed`).
    impl BundleImpl of BundleTrait<ContractState> {
        fn on_issue(
            ref self: BundleComponent::ComponentState<ContractState>,
            recipient: ContractAddress,
            bundle_id: u32,
            mut quantity: u32,
        ) {
            // [Setup] Lift back to the contract's WorldStorage so we
            // can read/write the dopewars-side models.
            let mut contract_state = self.get_contract_mut();
            let mut world = contract_state.world(@ns());

            // [Read] Pack metadata for this bundle id (template, gear).
            let pack: Starterpack = world.read_model(bundle_id);

            // [Lookup] Hustler ERC721 dispatcher.
            let hustler_address = world.dns_address(@"hustler").expect('hustler not found');
            let hustler = IHustlerDispatcher { contract_address: hustler_address };

            // [Effect] Mint `quantity` hustlers + write per-token state.
            while quantity > 0 {
                let token_id = hustler.mint(recipient, false);
                let instance = HustlerInstanceTrait::new_from_pack(
                    token_id,
                    bundle_id,
                    pack.hustler_template_id,
                    pack.gear_weapon,
                    pack.gear_clothes,
                    pack.gear_feet,
                    pack.gear_transport,
                );
                world.write_model(@instance);
                quantity -= 1;
            };
        }

        fn supply(
            self: @BundleComponent::ComponentState<ContractState>, bundle_id: u32,
        ) -> Option<u32> {
            // Unlimited supply. The bundle component skips its supply
            // assertion when None is returned.
            let _ = bundle_id;
            Option::None
        }
    }

    #[storage]
    struct Storage {
        #[substorage(v0)]
        bundle: BundleComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        BundleEvent: BundleComponent::Event,
    }

    /// `dojo_init` registers the four canonical paid tiers with the
    /// embedded BundleComponent and writes a Starterpack row for each
    /// `dojo_init` is intentionally a no-op. Bundle registration must
    /// happen via the `initialize` admin entrypoint below — see the
    /// IPurchaseAdmin doc for why.
    fn dojo_init(ref self: ContractState, admin: ContractAddress) {
        let _ = admin;
    }

    // Expose the bundle component's IBundle entrypoints as the
    // user-facing API. Buyers call `purchase.issue(...)` directly with
    // the payment token pre-approved.
    #[abi(embed_v0)]
    impl IBundleImpl of IBundle<ContractState> {
        fn get_metadata(self: @ContractState, bundle_id: u32) -> ByteArray {
            let world = self.world(@ns());
            self.bundle.get_metadata(world, bundle_id)
        }

        fn quote(
            self: @ContractState,
            bundle_id: u32,
            quantity: u32,
            has_referrer: bool,
            client_percentage: u8,
        ) -> BundleQuote {
            let world = self.world(@ns());
            self.bundle.quote(world, bundle_id, quantity, has_referrer, client_percentage)
        }

        fn issue(
            ref self: ContractState,
            recipient: ContractAddress,
            bundle_id: u32,
            quantity: u32,
            referrer: Option<ContractAddress>,
            referrer_group: Option<felt252>,
            client: Option<ContractAddress>,
            client_percentage: u8,
            voucher_key: Option<felt252>,
            signature: Option<Span<felt252>>,
        ) {
            let mut world = self.world(@ns());
            self
                .bundle
                .issue(
                    world,
                    recipient,
                    bundle_id,
                    quantity,
                    referrer,
                    referrer_group,
                    client,
                    client_percentage,
                    voucher_key,
                    signature,
                )
        }
    }

    // dopewars-specific catalog admin. Kept separate from IBundle so
    // we don't pollute the bundle interface with our own model shape.
    #[abi(embed_v0)]
    impl PurchaseAdminImpl of IPurchaseAdmin<ContractState> {
        fn initialize(ref self: ContractState) {
            // [Effect] Register the four paid tiers with the embedded
            // bundle component. payment_receiver = this contract so a
            // followup PR can swap-and-burn the accumulated USDC.
            // allower = 0 means no SRC6 voucher (anyone can buy).
            // payment_token is the dopewars paper contract for now —
            // PR-1f-followup will swap to USDC.
            let mut world = self.world(@ns());

            let payment_receiver = starknet::get_contract_address();
            let allower: ContractAddress = 0.try_into().unwrap();
            let payment_token = world.dns_address(@"paper").expect('paper not found');

            let templates = array![
                TEMPLATE_NAKED, TEMPLATE_STREET, TEMPLATE_DEALER, TEMPLATE_KINGPIN,
            ];

            let mut idx: u32 = 0;
            while idx < PACK_COUNT {
                let stake: u8 = (idx + 1).try_into().unwrap();
                let price_u128 = super::discount_price(stake);
                let price: u256 = price_u128.into();
                let template_id = *templates.at(idx);

                let bundle_id = self
                    .bundle
                    .register(
                        world,
                        referral_percentage: 0,
                        reissuable: true,
                        price: price,
                        payment_token: payment_token,
                        payment_receiver: payment_receiver,
                        metadata: "starterpack",
                        allower: allower,
                    );

                // [Effect] Write the dopewars-side catalog row keyed by
                // the bundle id we just got back. Gear ids are 0 (no
                // gear pre-equipped) — PR-4 / a future admin entrypoint
                // will overwrite per-tier loadouts.
                let pack = StarterpackTrait::new(
                    bundle_id,
                    template_id,
                    0, // gear_weapon
                    0, // gear_clothes
                    0, // gear_feet
                    0, // gear_transport
                    stake,
                    price_u128,
                );
                world.write_model(@pack);

                idx += 1;
            };
        }

        fn get_starterpack(self: @ContractState, bundle_id: u32) -> Starterpack {
            let world = self.world(@ns());
            world.read_model(bundle_id)
        }
    }
}
