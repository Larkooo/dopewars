// Rewarder math unit tests.
//
// Moved out of src/helpers/rewarder.cairo as part of PR-2b's
// "all tests live under src/tests/" consolidation.

use rollyourown::constants::{MULTIPLIER_PRECISION, TEN_POW_18};
use rollyourown::helpers::rewarder::Rewarder;

const BURN: u256 = 1000 * TEN_POW_18.into(); // 1000 Paper entry fee
const TARGET_SUPPLY: u256 = 1_000_000;
const MAX_SCORE: u256 = 50_000;

#[test]
fn test_rewarder_at_target_at_average() {
    // At target supply, average score should roughly break even
    let multiplier = Rewarder::multiplier(TARGET_SUPPLY, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE);
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
    let multiplier = Rewarder::multiplier(TARGET_SUPPLY, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE);
    let reward = Rewarder::amount(5_000, 1, MAX_SCORE, multiplier);
    assert!(reward < BURN, "below average should earn less than burn");
}

#[test]
fn test_rewarder_at_target_above_average() {
    let multiplier = Rewarder::multiplier(TARGET_SUPPLY, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE);
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
    let multiplier = Rewarder::multiplier(TARGET_SUPPLY, TARGET_SUPPLY, BURN, 10_000, 1, MAX_SCORE);
    let reward = Rewarder::amount(0, 1, MAX_SCORE, multiplier);
    assert!(reward == 0, "zero score should give zero reward");
}
