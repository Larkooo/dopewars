use rollyourown::helpers::rewarder::{EMA_MAX_WEIGHT, EMA_SCORE_PRECISION};
use rollyourown::models::season::{Season, SeasonImpl};
use starknet::get_block_timestamp;

const TWO_MIN: u16 = 120;
// const ONE_HOUR: u16 = 3600;
// const HALF_HOUR: u16 = 1800;
//
const HALF_HOUR: u32 = 1800;
const ONE_HOUR: u32 = 3600;
const HALF_DAY: u32 = 43_200;
const ONE_DAY: u32 = 86_400;
const ONE_WEEK: u32 = 604_800;

const TEMP_VALUE: u32 = 1200;

// PR-1g: dropped the v0 jackpot/treasury fields:
//   paper_fee, paper_reward_launderer, treasury_fee_pct, treasury_balance.
// They modeled the laundromat/season-jackpot economy that v2 replaced with
// the supply-aware rewarder curve in PR-1a..1e. Per-pack price + burn/
// treasury split now live on `models::payment_config::PaymentConfig`;
// per-game reward is computed by `helpers::rewarder` against the live
// PAPER total_supply at register_score time.
#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct RyoConfig {
    #[key]
    pub key: u8,
    pub initialized: bool,
    pub paused: bool,
    //
    pub season_version: u16,
    pub season_duration: u32,
    pub season_time_limit: u16,
    //
    pub f2p_hustlers: bool,
    pub play_with_loot: bool,
    pub play_with_hustlers: bool,
    //
    // Reward curve parameters (nums-style). Call sites in season_manager.
    pub target_supply: u64, // Target Paper supply (whole tokens)
    pub max_score: u32, // Max possible cash score (curve ceiling)
    pub average_score: u64, // EMA weighted score numerator
    pub average_weight: u16 // EMA weight denominator
}


#[generate_trait]
pub impl RyoConfigImpl of RyoConfigTrait {
    fn build_initial_ryo_config(season_duration: u32, season_time_limit: u16) -> RyoConfig {
        RyoConfig {
            key: 0,
            initialized: true,
            paused: false,
            season_version: 1,
            season_duration,
            season_time_limit,
            f2p_hustlers: true,
            play_with_loot: true,
            play_with_hustlers: false,
            // Reward curve defaults
            target_supply: 1_000_000, // 1M Paper target supply
            max_score: 50_000, // Max cash score for curve ceiling
            average_score: 100
                * 10_000
                * EMA_SCORE_PRECISION, // EMA seed: 100 games * 10k cash * precision
            average_weight: 100 // Initial EMA weight
        }
    }

    fn build_season(self: RyoConfig, season_version: u16) -> Season {
        Season {
            version: season_version,
            //
            // season config copied from RyoConfig
            season_duration: self.season_duration,
            season_time_limit: self.season_time_limit,
            // season datas
            next_version_timestamp: get_block_timestamp() + self.season_duration.into(),
            high_score: 0,
        }
    }

    /// Returns the average score as (numerator, denominator) for use with the rewarder.
    fn get_average_score(self: RyoConfig) -> (u64, u64) {
        (self.average_score, self.average_weight.into() * EMA_SCORE_PRECISION)
    }

    /// Push a new score into the EMA tracker.
    fn push_score(ref self: RyoConfig, score: u32) {
        if score < rollyourown::helpers::rewarder::EMA_MIN_SCORE {
            return;
        }
        if self.average_weight < EMA_MAX_WEIGHT {
            self.average_score += score.into() * EMA_SCORE_PRECISION;
            self.average_weight += 1;
        } else {
            let avg: u64 = self.average_score / self.average_weight.into();
            self.average_score = self.average_score + score.into() * EMA_SCORE_PRECISION - avg;
        }
    }
}
