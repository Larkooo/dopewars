// Stub for offline mode
export const useClaimable = (_playerId?: string) => {
  return {
    claimable: [],
    isFetching: false,
    refetch: async () => {},
  };
};
