// Reward curve ported from nums contracts.
// Calculates per-game rewards based on score, supply, and burn amount.
// Break-even: at average score and target supply, reward ≈ entry fee.

use core::num::traits::Pow;
use rollyourown::constants::{MULTIPLIER_PRECISION, TEN_POW_18};

pub const A: u256 = 665_768_430 * TEN_POW_18.into();
pub const B: u256 = 2;
pub const K: u32 = 5;

#[generate_trait]
pub impl Rewarder of RewarderTrait {
    /// Calculate the base reward for a given score.
    /// # Arguments
    /// * `score_num` - The numerator of the score fraction.
    /// * `score_den` - The denominator of the score fraction.
    /// * `max_score` - The maximum possible score (equivalent to slot_count in nums).
    /// # Returns
    /// The reward base amount (18-decimal precision).
    #[inline]
    fn base(score_num: u256, score_den: u256, max_score: u256) -> u256 {
        if score_den == 0 {
            return 0;
        }
        let den_lhs: u256 = (max_score + B).pow(K);
        let den_rhs: u256 = score_num.pow(K) / score_den.pow(K);
        if den_lhs <= den_rhs {
            return 0;
        }
        (A / (den_lhs - den_rhs) - A / den_lhs + score_num * TEN_POW_18.into() / score_den)
    }

    /// Calculate the supply multiplier for a given supply and target.
    /// Returns 0 when supply >= 2 * target (no rewards).
    #[inline]
    fn supply_multiplier(supply: u256, target: u256) -> u128 {
        if supply > target * 2 || target == 0 {
            return 0;
        }
        ((2 * target - supply) * MULTIPLIER_PRECISION.into() / target).try_into().unwrap()
    }

    /// Calculate the burn multiplier for a given burn amount and average score.
    /// burn_multiplier = burn / base(avg_score) — normalizes reward to entry cost.
    #[inline]
    fn burn_multiplier(burn: u256, score_num: u256, score_den: u256, max_score: u256) -> u128 {
        let mint = Self::base(score_num, score_den, max_score);
        if mint == 0 {
            return 0;
        }
        (burn * MULTIPLIER_PRECISION.into() / mint).try_into().unwrap()
    }

    /// Calculate the combined multiplier (supply * burn / precision).
    #[inline]
    fn multiplier(
        supply: u256,
        target: u256,
        burn: u256,
        score_num: u256,
        score_den: u256,
        max_score: u256,
    ) -> u128 {
        let supply_multiplier: u128 = Self::supply_multiplier(supply, target);
        let burn_multiplier: u128 = Self::burn_multiplier(burn, score_num, score_den, max_score);
        supply_multiplier * burn_multiplier / MULTIPLIER_PRECISION
    }

    /// Calculate the final reward amount for a given score and multiplier.
    /// # Returns
    /// The reward amount (18-decimal precision).
    #[inline]
    fn amount(score_num: u256, score_den: u256, max_score: u256, multiplier: u128) -> u256 {
        let base = Self::base(score_num, score_den, max_score);
        base * multiplier.into() / MULTIPLIER_PRECISION.into()
    }
}


// EMA helpers for tracking average score
pub const EMA_SCORE_PRECISION: u64 = 100;
pub const EMA_INITIAL_WEIGHT: u16 = 100;
pub const EMA_MAX_WEIGHT: u16 = 1000;
pub const EMA_MIN_SCORE: u32 = 100; // Minimum cash to register in EMA


#[cfg(test)]
mod tests {
    use super::*;

    const BURN: u256 = 1000 * TEN_POW_18.into(); // 1000 Paper entry fee
    const TARGET_SUPPLY: u256 = 1_000_000;
    const MAX_SCORE: u256 = 50_000;

    #[test]
    fn test_rewarder_at_target_at_average() {
        // At target supply, average score should roughly break even
        let multiplier = Rewarder::multiplier(
            TARGET_SUPPLY, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE,
        );
        let reward = Rewarder::amount(10_000, 1, MAX_SCORE, multiplier);
        // reward should be approximately BURN
        let err = if reward > BURN {
            (reward - BURN) * MULTIPLIER_PRECISION.into() / BURN
        } else {
            (BURN - reward) * MULTIPLIER_PRECISION.into() / BURN
        };
        assert!(err <= MULTIPLIER_PRECISION.into(), "reward should be close to burn at average");
    }

    #[test]
    fn test_rewarder_at_target_below_average() {
        let multiplier = Rewarder::multiplier(
            TARGET_SUPPLY, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE,
        );
        let reward = Rewarder::amount(5_000, 1, MAX_SCORE, multiplier);
        assert!(reward < BURN, "below average should earn less than burn");
    }

    #[test]
    fn test_rewarder_at_target_above_average() {
        let multiplier = Rewarder::multiplier(
            TARGET_SUPPLY, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE,
        );
        let reward = Rewarder::amount(20_000, 1, MAX_SCORE, multiplier);
        assert!(reward > BURN, "above average should earn more than burn");
    }

    #[test]
    fn test_rewarder_below_target_at_average() {
        // Below target supply → higher rewards
        let multiplier = Rewarder::multiplier(
            TARGET_SUPPLY / 2, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE,
        );
        let reward = Rewarder::amount(10_000, 1, MAX_SCORE, multiplier);
        assert!(reward > BURN, "below target supply should boost rewards");
    }

    #[test]
    fn test_rewarder_above_target_at_average() {
        // Above target supply → lower rewards
        let multiplier = Rewarder::multiplier(
            TARGET_SUPPLY * 3 / 2, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE,
        );
        let reward = Rewarder::amount(10_000, 1, MAX_SCORE, multiplier);
        assert!(reward < BURN, "above target supply should reduce rewards");
    }

    #[test]
    fn test_rewarder_at_double_target() {
        // At 2x target supply → zero rewards
        let multiplier = Rewarder::multiplier(
            TARGET_SUPPLY * 2, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE,
        );
        let reward = Rewarder::amount(10_000, 1, MAX_SCORE, multiplier);
        assert!(reward == 0, "at 2x target supply rewards should be zero");
    }

    #[test]
    fn test_rewarder_zero_score() {
        let multiplier = Rewarder::multiplier(
            TARGET_SUPPLY, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE,
        );
        let reward = Rewarder::amount(0, 1, MAX_SCORE, multiplier);
        assert!(reward == 0, "zero score should give zero reward");
    }
}
