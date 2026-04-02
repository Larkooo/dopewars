// Stub for offline mode
export const useRegisteredGamesBySeason = (_version?: number) => {
  return {
    registeredGames: [],
    isFetched: true,
    isFetching: false,
    refetch: async () => {},
  };
};
