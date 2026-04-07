// HustlerInstance — per-token state for the Hustler ERC721.
//
// Keyed by token_id. Written by PR-1d's purchase contract on mint (records
// which template + gear loadout the buyer got), read by PR-1e's game
// contract on game start (seeds the run-time GameStore from the template
// and gear), and updated on game over to record the final score for trophy
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
    // The starterpack the hustler was minted from. Lets the UI render the
    // pack-of-origin badge without re-deriving it from the gear loadout.
    pub starterpack_id: u8,
    // Template id (denormalized for fast read).
    pub hustler_template_id: u8,
    // Gear loadout — same convention as Starterpack.gear_*.
    pub gear_weapon: u8,
    pub gear_clothes: u8,
    pub gear_feet: u8,
    pub gear_transport: u8,
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
        starterpack_id: u8,
        hustler_template_id: u8,
        gear_weapon: u8,
        gear_clothes: u8,
        gear_feet: u8,
        gear_transport: u8,
    ) -> HustlerInstance {
        HustlerInstance {
            token_id,
            starterpack_id,
            hustler_template_id,
            gear_weapon,
            gear_clothes,
            gear_feet,
            gear_transport,
            used: false,
            game_id: 0,
            final_score: 0,
        }
    }
}
