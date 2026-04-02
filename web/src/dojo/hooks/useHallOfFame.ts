// Stub for offline mode
export const useHallOfFame = () => {
  return {
    hallOfFame: [],
    isFetchingHallOfFame: false,
    refetchHallOfFame: async () => {},
  };
};
