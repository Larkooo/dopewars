/**
 * Mirrors helpers/rewarder.cairo test cases verbatim, so the TS port can be
 * trusted to agree with the on-chain math. Cases use the same constants
 * (BURN, TARGET_SUPPLY, MAX_SCORE) as the Cairo tests for direct comparison.
 */

import { describe, it, expect } from "vitest";
import { MULTIPLIER_PRECISION, Rewarder } from "./rewarder";

const TEN_POW_18 = 10n ** 18n;

const BURN_WEI = 1000n * TEN_POW_18; // 1000 Paper entry fee, in wei
const BURN_PAPER = 1000; // same value, expressed as whole tokens
const TARGET_SUPPLY = 1_000_000n;
const MAX_SCORE = 50_000n;
const AVERAGE_SCORE = 10_000n;

const multiplierFor = (supply: bigint, burn: bigint, scoreNum: bigint) =>
  Rewarder.multiplier(supply, TARGET_SUPPLY, burn, scoreNum, 1n, MAX_SCORE);

const rewardFor = (supply: bigint, scoreNum: bigint) =>
  Rewarder.amount(
    scoreNum,
    1n,
    MAX_SCORE,
    multiplierFor(supply, BURN_WEI, AVERAGE_SCORE),
  );

describe("Rewarder", () => {
  describe("Cairo parity", () => {
    it("at target supply, average score → reward ≈ burn (break-even)", () => {
      const reward = rewardFor(TARGET_SUPPLY, AVERAGE_SCORE);
      // Cairo tolerance: |reward - burn| <= burn (100% relative)
      expect(Math.abs(reward - BURN_PAPER)).toBeLessThanOrEqual(BURN_PAPER);
      // Tighter sanity: should land within ~10% of break-even
      expect(reward).toBeGreaterThan(BURN_PAPER * 0.9);
      expect(reward).toBeLessThan(BURN_PAPER * 1.1);
    });

    it("at target supply, below-average score → reward < burn", () => {
      const reward = rewardFor(TARGET_SUPPLY, 5_000n);
      expect(reward).toBeLessThan(BURN_PAPER);
    });

    it("at target supply, above-average score → reward > burn", () => {
      const reward = rewardFor(TARGET_SUPPLY, 20_000n);
      expect(reward).toBeGreaterThan(BURN_PAPER);
    });

    it("below target supply, average score → reward > burn", () => {
      const reward = rewardFor(TARGET_SUPPLY / 2n, AVERAGE_SCORE);
      expect(reward).toBeGreaterThan(BURN_PAPER);
    });

    it("above target supply, average score → reward < burn", () => {
      const reward = rewardFor((TARGET_SUPPLY * 3n) / 2n, AVERAGE_SCORE);
      expect(reward).toBeLessThan(BURN_PAPER);
    });

    it("at 2× target supply → reward is zero", () => {
      const reward = rewardFor(TARGET_SUPPLY * 2n, AVERAGE_SCORE);
      expect(reward).toBe(0);
    });

    it("zero score → reward is zero", () => {
      const reward = rewardFor(TARGET_SUPPLY, 0n);
      expect(reward).toBe(0);
    });
  });

  describe("base", () => {
    it("returns 0 when scoreDen is 0", () => {
      expect(Rewarder.base(10_000n, 0n, MAX_SCORE)).toBe(0n);
    });

    it("returns 0 when score saturates the curve (score >= max + B)", () => {
      // At score == max + B, denLhs == denRhs and the curve has no more headroom
      expect(Rewarder.base(MAX_SCORE + 2n, 1n, MAX_SCORE)).toBe(0n);
    });

    it("is monotonically increasing in score within the valid range", () => {
      const lo = Rewarder.base(5_000n, 1n, MAX_SCORE);
      const mid = Rewarder.base(10_000n, 1n, MAX_SCORE);
      const hi = Rewarder.base(20_000n, 1n, MAX_SCORE);
      expect(mid).toBeGreaterThan(lo);
      expect(hi).toBeGreaterThan(mid);
    });
  });

  describe("supplyMultiplier", () => {
    it("returns precision (1×) when supply == target", () => {
      expect(Rewarder.supplyMultiplier(TARGET_SUPPLY, TARGET_SUPPLY)).toBe(
        MULTIPLIER_PRECISION,
      );
    });

    it("returns 2× precision when supply == 0", () => {
      expect(Rewarder.supplyMultiplier(0n, TARGET_SUPPLY)).toBe(
        2n * MULTIPLIER_PRECISION,
      );
    });

    it("returns 0 when supply > 2× target", () => {
      expect(
        Rewarder.supplyMultiplier(TARGET_SUPPLY * 2n + 1n, TARGET_SUPPLY),
      ).toBe(0n);
    });

    it("returns 0 when target is 0", () => {
      expect(Rewarder.supplyMultiplier(TARGET_SUPPLY, 0n)).toBe(0n);
    });

    it("decreases linearly with supply", () => {
      const half = Rewarder.supplyMultiplier(TARGET_SUPPLY / 2n, TARGET_SUPPLY);
      const at = Rewarder.supplyMultiplier(TARGET_SUPPLY, TARGET_SUPPLY);
      const oneAndHalf = Rewarder.supplyMultiplier(
        (TARGET_SUPPLY * 3n) / 2n,
        TARGET_SUPPLY,
      );
      // half-target → 1.5×, target → 1×, 1.5× target → 0.5×
      expect(half).toBe((3n * MULTIPLIER_PRECISION) / 2n);
      expect(at).toBe(MULTIPLIER_PRECISION);
      expect(oneAndHalf).toBe(MULTIPLIER_PRECISION / 2n);
    });
  });

  describe("burnMultiplier", () => {
    it("returns 0 when base mint is 0 (e.g. zero score)", () => {
      expect(Rewarder.burnMultiplier(BURN_WEI, 0n, 1n, MAX_SCORE)).toBe(0n);
    });

    it("scales linearly with burn amount", () => {
      const single = Rewarder.burnMultiplier(
        BURN_WEI,
        AVERAGE_SCORE,
        1n,
        MAX_SCORE,
      );
      const double = Rewarder.burnMultiplier(
        BURN_WEI * 2n,
        AVERAGE_SCORE,
        1n,
        MAX_SCORE,
      );
      expect(double).toBe(single * 2n);
    });
  });
});
