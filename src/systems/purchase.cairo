// Purchase — buy a starterpack, get a Hustler NFT.
//
// PR-1f: embeds arcade's `bundle` component directly via
// `component!(...)`, exposes `IBundle::issue/quote/get_metadata` as the
// user-facing buy entrypoint, and implements `BundleTrait::on_issue`
// to mint Hustler NFT(s) plus the matching `HustlerInstance` row(s)
// when a purchase clears.
//
// PR-1f-followup: wires the actual USDC → PAPER swap-and-burn flow
// inside on_issue using Ekubo. Mirrors the nums purchase component's
// `execute()` function (nums/contracts/src/components/purchase.cairo).
// Per-tier USDC pricing + Ekubo pool params come from PaymentConfig
// (set by the admin via `set_payment_config` before `initialize`).
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
// `base_price` is read from PaymentConfig (USDC decimals — typically 6).
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
use starknet::ContractAddress;

// Convenience constant exported for the test fixture, which still
// passes BASE_PRICE_PAPER as the PaymentConfig.base_price stand-in
// since tests use `paper` as the USDC token. Production deploys pass
// the real USDC base price (e.g. 2_000_000 = 2 USDC) via
// set_payment_config. Mirrors the v2 design doc's 1000-PAPER 1× tier
// (PAPER wei).
pub const BASE_PRICE_PAPER: u128 = 1000_u128 * 1_000_000_000_000_000_000_u128;

/// price = stake × base_price × (100 - stake) / 100
/// Mirrors the nums discount curve. Generic over the unit (u256) so
/// callers can pass either USDC (6 decimals) or PAPER (18 decimals).
pub fn discount_price_u256(stake: u8, base_price: u256) -> u256 {
    let stake_u256: u256 = stake.into();
    stake_u256 * base_price * (100_u256 - stake_u256) / 100_u256
}

#[starknet::interface]
pub trait IPurchaseAdmin<T> {
    /// Write the PaymentConfig row that drives `initialize`. Must be
    /// called once by the admin before `initialize`. The fields wire
    /// the USDC payment token, the Ekubo router/positions/pool params,
    /// the base USDC price, and the burn / treasury distribution
    /// percentages applied inside `on_issue`.
    fn set_payment_config(
        ref self: T,
        usdc: ContractAddress,
        ekubo_router: ContractAddress,
        ekubo_positions: ContractAddress,
        pool_fee: u128,
        pool_tick_spacing: u128,
        pool_extension: ContractAddress,
        pool_sqrt: u256,
        base_price: u256,
        burn_percentage: u8,
        treasury_percentage: u8,
        treasury_address: ContractAddress,
    );

    /// Register the four canonical paid tiers with the embedded
    /// BundleComponent. Must be called once after `set_payment_config`.
    /// Splitting this from `dojo_init` matches arcade's own bundle test
    /// pattern (see `packages/bundle/src/tests/contract.cairo`) where
    /// bundle registration happens via a public entrypoint *after*
    /// the test world is spawned.
    fn initialize(ref self: T);

    /// Read a starterpack from the catalog by bundle id.
    fn get_starterpack(self: @T, bundle_id: u32) -> Starterpack;
}

#[dojo::contract]
pub mod purchase {
    use bundle::component::Component as BundleComponent;
    use bundle::component::Component::{BundleQuote, BundleTrait};
    use bundle::interface::IBundle;
    use core::num::traits::Zero;
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorageTrait;
    use ekubo::components::clear::{IClearDispatcher, IClearDispatcherTrait};
    use ekubo::interfaces::erc20::IERC20Dispatcher as EkuboIERC20Dispatcher;
    use ekubo::interfaces::router::{
        IRouterDispatcher, IRouterDispatcherTrait, RouteNode, TokenAmount,
    };
    use ekubo::types::i129::i129;
    use ekubo::types::keys::PoolKey;
    use openzeppelin::interfaces::token::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use rollyourown::constants::ns;
    use rollyourown::models::hustler_instance::HustlerInstanceTrait;
    use rollyourown::models::payment_config::{
        PAYMENT_CONFIG_KEY, PaymentConfig, PaymentConfigTrait,
    };
    use rollyourown::models::starterpack::{Starterpack, StarterpackTrait};
    use rollyourown::tokens::hustler::{IHustlerDispatcher, IHustlerDispatcherTrait};
    use rollyourown::tokens::paper::{IPaperTokenDispatcher, IPaperTokenDispatcherTrait};
    use starknet::ContractAddress;
    use super::IPurchaseAdmin;

    // Hustler template ids referenced by the seeded packs. Content PR
    // (PR-4) seeds the actual HustlerTemplate rows; this contract only
    // stores the ids.
    const TEMPLATE_NAKED: u8 = 1;
    const TEMPLATE_STREET: u8 = 2;
    const TEMPLATE_DEALER: u8 = 3;
    const TEMPLATE_KINGPIN: u8 = 4;

    // Number of paid tiers seeded by `initialize`.
    const PACK_COUNT: u32 = 4;

    // Per-tier gear loadouts. Gear ids match the full 72-item catalog
    // in content::dojo_init. Higher starterpack tiers pre-load better
    // items. Tier numbering follows the original dopewars convention:
    // tier 1 = best, tier 3 = worst.
    //
    //   Naked  (stake 1): no gear
    //   Street (stake 2): tier-3 items (worst) — starter gear
    //   Dealer (stake 3): tier-2 items (mid)
    //   Kingpin(stake 4): tier-1 items (best)
    //
    // One representative item per slot per pack tier. Picked from the
    // full catalog by name recognition (iconic dopewars items).
    // Weapon picks:
    const GEAR_POCKET_KNIFE: u8 = 1;   // tier 3 (Street)
    const GEAR_CHAIN: u8 = 2;          // tier 2 (Dealer)
    const GEAR_AK47: u8 = 6;           // tier 1 (Kingpin)
    // Clothes picks:
    const GEAR_WHITE_TEE: u8 = 19;     // tier 3 (Street)
    const GEAR_BLACK_HOODIE: u8 = 22;  // tier 2 (Dealer)
    const GEAR_BULLETPROOF: u8 = 23;   // tier 1 (Kingpin)
    // Feet picks:
    const GEAR_FLIP_FLOPS: u8 = 46;    // tier 3 (Street)
    const GEAR_TIMBERLANDS: u8 = 44;   // tier 2 (Dealer)
    const GEAR_AIR_FORCE: u8 = 39;     // tier 1 (Kingpin)
    // Transport picks:
    const GEAR_TRICYCLE: u8 = 58;      // tier 3 (Street)
    const GEAR_ATV: u8 = 60;           // tier 2 (Dealer)
    const GEAR_ROLLS_ROYCE: u8 = 68;   // tier 1 (Kingpin)

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
    /// the bundle to issue.
    ///
    /// Order of operations:
    ///   1. Run the Ekubo USDC->PAPER swap-and-burn (when configured)
    ///      and capture `paper_burned` — the actual PAPER amount
    ///      pulled out of the supply by this purchase.
    ///   2. Mint `quantity` Hustler NFTs and write per-token
    ///      HustlerInstance rows, distributing `paper_burned / quantity`
    ///      onto each instance so the rewarder can read on-chain
    ///      data instead of an estimate.
    ///
    /// Doing the burn first means we know the per-instance burn share
    /// before writing the HustlerInstance rows. The order also matches
    /// nums execute() which computes its rewarder multiplier from the
    /// post-swap balance.
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

            // [Interaction] Buy-and-burn via Ekubo. Skipped when the
            // PaymentConfig isn't fully wired (ekubo_router == 0,
            // burn_percentage == 0, etc) — that's the test path. The
            // production deploy script writes a real PaymentConfig
            // before calling initialize.
            //
            // Mirrors nums components/purchase.cairo execute(). The
            // burn share is computed against the bundle's stake
            // multiplier and the configured base_price + burn_percentage.
            // The contract just received `quantity * bundle.price` USDC
            // from the bundle component's transfer_from; we forward the
            // burn share to the Ekubo router, swap to PAPER, clear it
            // back to the contract, and burn it.
            //
            // The total `paper_burned` is captured here and then split
            // evenly across the minted hustlers (`paper_burned /
            // quantity` per instance) so season_manager's rewarder can
            // read on-chain data per game instead of using a static
            // estimate.
            let config: PaymentConfig = world.read_model(PAYMENT_CONFIG_KEY);
            let mut paper_burned: u128 = 0;
            if config.ekubo_router.is_non_zero()
                && config.burn_percentage > 0
                && pack.stake_multiplier > 0 {
                let stake: u256 = pack.stake_multiplier.into();
                let burn_amount = quantity.into()
                    * stake
                    * config.base_price
                    * config.burn_percentage.into()
                    / 100_u256;

                if burn_amount > 0 {
                    let paper_address = world
                        .dns_address(@"paper")
                        .expect('paper not found');
                    let usdc = IERC20Dispatcher { contract_address: config.usdc };
                    let router = IRouterDispatcher {
                        contract_address: config.ekubo_router,
                    };

                    // [Interaction] Forward the burn share to Ekubo.
                    usdc.transfer(router.contract_address, burn_amount);

                    // [Interaction] Swap USDC -> PAPER. token0 must be
                    // the lower address per Ekubo's PoolKey ordering.
                    let (token0, token1) = if config.usdc < paper_address {
                        (config.usdc, paper_address)
                    } else {
                        (paper_address, config.usdc)
                    };
                    let pool_key = PoolKey {
                        token0: token0,
                        token1: token1,
                        fee: config.pool_fee,
                        tick_spacing: config.pool_tick_spacing,
                        extension: config.pool_extension,
                    };
                    let route_node = RouteNode {
                        pool_key: pool_key,
                        sqrt_ratio_limit: config.pool_sqrt,
                        skip_ahead: 0,
                    };
                    let token_amount = TokenAmount {
                        token: config.usdc,
                        amount: i129 { mag: burn_amount.low, sign: false },
                    };
                    router.swap(route_node, token_amount);

                    // [Interaction] Clear the swapped PAPER + any
                    // leftover USDC back to this contract. Same address
                    // hosts both router + clearer in Ekubo.
                    let clearer = IClearDispatcher {
                        contract_address: config.ekubo_router,
                    };
                    clearer
                        .clear_minimum(
                            EkuboIERC20Dispatcher { contract_address: paper_address },
                            0,
                        );
                    clearer
                        .clear(EkuboIERC20Dispatcher { contract_address: config.usdc });

                    // [Interaction] Burn all PAPER we got from the
                    // swap. paper.burn() burns from the caller (this
                    // contract). Capture the burned amount as a u128
                    // (PAPER wei fits) so we can distribute it across
                    // the minted hustlers below.
                    let paper_erc20 = IERC20Dispatcher { contract_address: paper_address };
                    let paper_received = paper_erc20
                        .balance_of(starknet::get_contract_address());
                    if paper_received > 0 {
                        let paper = IPaperTokenDispatcher {
                            contract_address: paper_address,
                        };
                        paper.burn(paper_received);
                        paper_burned = paper_received.try_into().unwrap_or(0);
                    }
                }
            }

            // [Interaction] PR #3: pay the treasury share. Mirrors
            // nums execute() lines 178-193 (vault dividend + team
            // transfer collapsed into a single hop). Computed against
            // the contract's USDC balance **after** the burn step, so
            // production gets `(payment - burn_share) * treasury_pct
            // / 100` USDC routed to the treasury_address. The
            // remainder stays in the contract for future use or
            // admin sweep.
            //
            // Skipped when treasury_percentage == 0 OR
            // treasury_address is zero. Tests can opt out by leaving
            // either field unset; the default v2_helper fixture sets
            // treasury_percentage = 0 so existing tests stay green.
            if config.treasury_percentage > 0 && config.treasury_address.is_non_zero() {
                let usdc_for_treasury = IERC20Dispatcher {
                    contract_address: config.usdc,
                };
                let usdc_balance = usdc_for_treasury
                    .balance_of(starknet::get_contract_address());
                let treasury_amount = usdc_balance
                    * config.treasury_percentage.into()
                    / 100_u256;
                if treasury_amount > 0 {
                    usdc_for_treasury.transfer(config.treasury_address, treasury_amount);
                }
            }

            // [Compute] Per-instance burn share. Integer division means
            // a remainder of up to (quantity - 1) PAPER wei may be lost
            // if the total isn't evenly divisible — negligible at PAPER
            // wei precision but worth noting if we ever switch to a
            // 0-decimal token.
            let burn_per_instance: u128 = if quantity > 0 {
                paper_burned / quantity.into()
            } else {
                0
            };

            // [Lookup] Hustler ERC721 dispatcher.
            let hustler_address = world.dns_address(@"hustler").expect('hustler not found');
            let hustler = IHustlerDispatcher { contract_address: hustler_address };

            // [Effect] Mint `quantity` hustlers + write per-token state
            // including the per-instance burn share.
            let mut remaining = quantity;
            while remaining > 0 {
                let token_id = hustler.mint(recipient, false);
                let instance = HustlerInstanceTrait::new_from_pack(
                    token_id,
                    bundle_id,
                    pack.hustler_template_id,
                    pack.gear_weapon,
                    pack.gear_clothes,
                    pack.gear_feet,
                    pack.gear_transport,
                    burn_per_instance,
                );
                world.write_model(@instance);
                remaining -= 1;
            };
            let _ = quantity;
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

    /// `dojo_init` is intentionally a no-op. PaymentConfig + bundle
    /// registration both happen via the IPurchaseAdmin entrypoints
    /// below — see those doc comments for why.
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

    #[abi(embed_v0)]
    impl PurchaseAdminImpl of IPurchaseAdmin<ContractState> {
        fn set_payment_config(
            ref self: ContractState,
            usdc: ContractAddress,
            ekubo_router: ContractAddress,
            ekubo_positions: ContractAddress,
            pool_fee: u128,
            pool_tick_spacing: u128,
            pool_extension: ContractAddress,
            pool_sqrt: u256,
            base_price: u256,
            burn_percentage: u8,
            treasury_percentage: u8,
            treasury_address: ContractAddress,
        ) {
            let mut world = self.world(@ns());
            let config = PaymentConfigTrait::new(
                usdc,
                ekubo_router,
                ekubo_positions,
                pool_fee,
                pool_tick_spacing,
                pool_extension,
                pool_sqrt,
                base_price,
                burn_percentage,
                treasury_percentage,
                treasury_address,
            );
            world.write_model(@config);
        }

        fn initialize(ref self: ContractState) {
            // [Effect] Register the four paid tiers with the embedded
            // bundle component. payment_receiver = this contract so
            // on_issue can swap-and-burn the accumulated USDC.
            // allower = 0 means no SRC6 voucher (anyone can buy).
            //
            // base_price + payment_token come from PaymentConfig. The
            // admin must call set_payment_config before initialize.
            let mut world = self.world(@ns());
            let config: PaymentConfig = world.read_model(PAYMENT_CONFIG_KEY);

            let payment_receiver = starknet::get_contract_address();
            let allower: ContractAddress = 0.try_into().unwrap();
            let payment_token = config.usdc;
            let base_price = config.base_price;

            let templates = array![
                TEMPLATE_NAKED, TEMPLATE_STREET, TEMPLATE_DEALER, TEMPLATE_KINGPIN,
            ];
            // Per-tier gear loadouts indexed by stake-1.
            // Naked = no gear; Street = tier-3 (worst); Dealer = tier-2;
            // Kingpin = tier-1 (best). Tier numbering matches the
            // original dopewars convention (tier 1 = best).
            let weapons = array![0, GEAR_POCKET_KNIFE, GEAR_CHAIN, GEAR_AK47];
            let clothes = array![0, GEAR_WHITE_TEE, GEAR_BLACK_HOODIE, GEAR_BULLETPROOF];
            let feet = array![0, GEAR_FLIP_FLOPS, GEAR_TIMBERLANDS, GEAR_AIR_FORCE];
            let transport = array![0, GEAR_TRICYCLE, GEAR_ATV, GEAR_ROLLS_ROYCE];

            let mut idx: u32 = 0;
            while idx < PACK_COUNT {
                let stake: u8 = (idx + 1).try_into().unwrap();
                let price = super::discount_price_u256(stake, base_price);
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
                // the bundle id we just got back. Gear ids match the
                // PR #4 per-tier loadout.
                let pack = StarterpackTrait::new(
                    bundle_id,
                    template_id,
                    *weapons.at(idx),
                    *clothes.at(idx),
                    *feet.at(idx),
                    *transport.at(idx),
                    stake,
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
