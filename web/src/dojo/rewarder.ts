/**
 * Reward curve calculator — mirrors helpers/rewarder.cairo.
 * Calculates per-game rewards based on score, supply, and burn amount.
 * Break-even: at average score and target supply, reward ≈ entry fee.
 */

const TEN_POW_18 = 10n ** 18n;
const A = 665_768_430n * TEN_POW_18;
const B = 2n;
const K = 5n;
export const MULTIPLIER_PRECISION = 1_000_000n;

export class Rewarder {
  /**
   * Calculate the base reward for a given score.
   * @param scoreNum  - Numerator of the score fraction (e.g., cash earned)
   * @param scoreDen  - Denominator of the score fraction (1 for whole numbers)
   * @param maxScore  - Maximum possible score (curve ceiling)
   * @returns Base reward (18-decimal bigint)
   */
  static base(scoreNum: bigint, scoreDen: bigint, maxScore: bigint): bigint {
    if (scoreDen === 0n) return 0n;
    const denLhs = (maxScore + B) ** K;
    const denRhs = scoreNum ** K / scoreDen ** K;
    if (denLhs <= denRhs) return 0n;
    return A / (denLhs - denRhs) - A / denLhs + (scoreNum * TEN_POW_18) / scoreDen;
  }

  /**
   * Calculate the supply multiplier (MULTIPLIER_PRECISION-based, 1_000_000 = 1x).
   * Returns 0 when supply >= 2 * target (no rewards).
   */
  static supplyMultiplier(supply: bigint, target: bigint): bigint {
    if (supply > target * 2n || target === 0n) return 0n;
    return ((2n * target - supply) * MULTIPLIER_PRECISION) / target;
  }

  /**
   * Calculate the burn multiplier (MULTIPLIER_PRECISION-based).
   * burn_multiplier = burn / base(avg_score) — normalizes reward to entry cost.
   */
  static burnMultiplier(burn: bigint, scoreNum: bigint, scoreDen: bigint, maxScore: bigint): bigint {
    const mint = Rewarder.base(scoreNum, scoreDen, maxScore);
    if (mint === 0n) return 0n;
    return (burn * MULTIPLIER_PRECISION) / mint;
  }

  /**
   * Calculate the combined multiplier (supply * burn / precision).
   */
  static multiplier(
    supply: bigint,
    target: bigint,
    burn: bigint,
    scoreNum: bigint,
    scoreDen: bigint,
    maxScore: bigint,
  ): bigint {
    const supplyMultiplier = Rewarder.supplyMultiplier(supply, target);
    const burnMultiplier = Rewarder.burnMultiplier(burn, scoreNum, scoreDen, maxScore);
    return (supplyMultiplier * burnMultiplier) / MULTIPLIER_PRECISION;
  }

  /**
   * Calculate the final reward amount.
   * @returns Reward in whole Paper tokens (number)
   */
  static amount(scoreNum: bigint, scoreDen: bigint, maxScore: bigint, multiplier: bigint): number {
    const base = Rewarder.base(scoreNum, scoreDen, maxScore);
    return Number((base * multiplier) / MULTIPLIER_PRECISION / TEN_POW_18);
  }

  /**
   * Estimate the reward multiplier for display purposes.
   * @param paperFee      - Entry fee in whole Paper tokens
   * @param gameMultiplier - Game multiplier (1-10)
   * @param maxScore      - Max possible cash score
   * @param averageScore  - EMA average score numerator
   * @param averageWeight - EMA weight
   * @param currentSupply - Current Paper supply in laundromat (wei)
   * @param targetSupply  - Target Paper supply (wei)
   * @returns float multiplier (1.0 = 1x, break-even at average score)
   */
  static estimate(
    paperFee: bigint,
    gameMultiplier: bigint,
    maxScore: bigint,
    averageScore: bigint,
    averageWeight: bigint,
    currentSupply: bigint,
    targetSupply: bigint,
  ): number {
    const EMA_SCORE_PRECISION = 100n;

    if (targetSupply === 0n || currentSupply === 0n) return 1;

    // burn = paper_fee * game_multiplier (in wei)
    const burn = paperFee * gameMultiplier * TEN_POW_18;

    const avgDen = averageWeight * EMA_SCORE_PRECISION;
    const multiplier = Rewarder.multiplier(currentSupply, targetSupply, burn, averageScore, avgDen, maxScore);
    return Number(multiplier) / Number(MULTIPLIER_PRECISION);
  }

  /**
   * Calculate the break-even score — the minimum cash needed for reward > entry fee.
   * @param paperFee      - Entry fee in whole Paper tokens
   * @param gameMultiplier - Game multiplier (1-10)
   * @param maxScore      - Max possible cash score
   * @param multiplier    - Pre-calculated multiplier (MULTIPLIER_PRECISION scale)
   * @param paperPrice    - USD price per Paper token
   * @returns Break-even cash score, or maxScore if never reached
   */
  static breakEven(
    paperFee: number,
    gameMultiplier: number,
    maxScore: number,
    multiplier: bigint,
    paperPrice: number,
  ): number {
    if (paperPrice === 0) return maxScore;

    const entryCostUsd = paperFee * gameMultiplier * paperPrice;

    // Scan scores from 0 to maxScore to find break-even
    for (let score = 0; score <= maxScore; score += Math.max(1, Math.floor(maxScore / 1000))) {
      const reward = Rewarder.amount(BigInt(score), 1n, BigInt(maxScore), multiplier);
      if (reward * paperPrice > entryCostUsd) return score;
    }

    return maxScore;
  }
}
