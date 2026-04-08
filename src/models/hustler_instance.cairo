// HustlerInstance — per-token state for the Hustler ERC721.
//
// Keyed by token_id. Written by the purchase contract's BundleTrait::on_issue
// callback on mint (records which template + gear loadout the buyer got, plus
// the actual PAPER amount burned to fund this hustler), read by PR-1e's game
// contract on game start (seeds the run-time GameStore from the template and
// gear), and updated on game over to record the final score for trophy
// display + leaderboard.
//
// We keep this off the Hustler contract's storage so the game contract can
// read/write it via the world (no cross-contract dispatch on every game
// action). Burning the underlying NFT does NOT auto-clear this model — the
// game contract is expected to leave a final-score record around for the
// leaderboard.

#[derive(Copy, Drop, Serde, IntrospectPacked)]
#[dojo::model]
pub struct HustlerInstance {
    #[key]
    pub token_id: u64,
    // The bundle (starterpack) the hustler was minted from. PR-1f keys
    // the Starterpack catalog by bundle_id (the u32 returned by
    // BundleComponent::register), so this stores the same id for fast
    // round-trip lookup from a hustler back to its pack metadata.
    pub bundle_id: u32,
    // Template id (denormalized for fast read).
    pub hustler_template_id: u8,
    // Gear loadout — same convention as Starterpack.gear_*.
    pub gear_weapon: u8,
    pub gear_clothes: u8,
    pub gear_feet: u8,
    pub gear_transport: u8,
    // PR #1: actual PAPER burned to fund this specific hustler, in wei.
    // Written by purchase::on_issue with the per-instance share of the
    // Ekubo swap result (`paper_received / quantity`). season_manager's
    // register_score reads this as the rewarder burn input — closing
    // the rewarder loop with on-chain data instead of the static
    // Starterpack.price_paper estimate that PR-1f used as a stopgap.
    //
    // Zero when on_issue's swap path is skipped (the test fixture's
    // ekubo_router=0 path) or when the bundle was free. The rewarder
    // collapses the multiplier to 0 in that case, which is the right
    // behavior for free / dev games.
    pub paper_burned: u128,
    // Once a game has been played with this hustler the contract sets `used`
    // to true. PR-1e decides whether `used` hustlers can be re-played, burned,
    // or kept as trophies — for now we just record the flag.
    pub used: bool,
    // Game id of the run that consumed this hustler (0 if unused).
    pub game_id: u32,
    // Final score recorded on game over (0 if unused or still in progress).
    pub final_score: u32,
}

#[generate_trait]
pub impl HustlerInstanceImpl of HustlerInstanceTrait {
    fn new_from_pack(
        token_id: u64,
        bundle_id: u32,
        hustler_template_id: u8,
        gear_weapon: u8,
        gear_clothes: u8,
        gear_feet: u8,
        gear_transport: u8,
        paper_burned: u128,
    ) -> HustlerInstance {
        HustlerInstance {
            token_id,
            bundle_id,
            hustler_template_id,
            gear_weapon,
            gear_clothes,
            gear_feet,
            gear_transport,
            paper_burned,
            used: false,
            game_id: 0,
            final_score: 0,
        }
    }
}
