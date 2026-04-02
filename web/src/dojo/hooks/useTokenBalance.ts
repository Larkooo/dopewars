// Stub for offline mode - no token balances
export const useTokenBalance = (_opts?: any) => {
  return {
    balance: 0n,
    isInitializing: false,
    refresh: async () => {},
  };
};
