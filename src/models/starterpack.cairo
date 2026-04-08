// Starterpack — per-bundle metadata for the v2 purchase flow.
//
// Catalog model. Keyed by the **bundle_id** returned by the embedded
// BundleComponent at registration time. The bundle component owns
// price / payment_token / reissuable / total_issued state inside its
// own `Bundle` model; this row stores the dopewars-specific bits the
// bundle component doesn't know about — which HustlerTemplate to mint
// and what gear to bake into the minted instance.
//
// Written by `purchase::initialize` once per tier (alongside the
// `bundle.register` call), then read by the BundleTrait::on_issue
// callback when a buyer calls `purchase.issue(...)`. The bundle_id
// flows through from the user's call → BundleComponent::issue →
// on_issue, so the lookup is straightforward.
//
// PR #1 dropped the legacy `price_paper` rewarder estimate field.
// season_manager now reads the actual burn share from
// HustlerInstance.paper_burned, which on_issue stamps from the real
// Ekubo swap result.

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct Starterpack {
    #[key]
    pub bundle_id: u32,
    // HustlerTemplate id minted by this pack.
    pub hustler_template_id: u8,
    // Gear ids by slot. 0 = no gear in that slot.
    pub gear_weapon: u8,
    pub gear_clothes: u8,
    pub gear_feet: u8,
    pub gear_transport: u8,
    // Multiplier baked into the pack (1..10). Used at run time as the
    // game multiplier; also used at registration time as an input to
    // the discount-curve price formula (see purchase::initialize).
    pub stake_multiplier: u8,
}

#[generate_trait]
pub impl StarterpackImpl of StarterpackTrait {
    fn new(
        bundle_id: u32,
        hustler_template_id: u8,
        gear_weapon: u8,
        gear_clothes: u8,
        gear_feet: u8,
        gear_transport: u8,
        stake_multiplier: u8,
    ) -> Starterpack {
        Starterpack {
            bundle_id,
            hustler_template_id,
            gear_weapon,
            gear_clothes,
            gear_feet,
            gear_transport,
            stake_multiplier,
        }
    }
}
