export interface Claimable {
  totalClaimable: number;
  gameIds: Array<number>;
}

export const ClaimReward = () => {
  // No rewards to claim in offline mode
  return null;
};
