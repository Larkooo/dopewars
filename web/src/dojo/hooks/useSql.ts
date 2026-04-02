// Stub for offline mode - no SQL queries
export const useSql = (_query?: string) => {
  return {
    data: null,
    isFetched: true,
    isFetching: false,
    refetch: async () => {},
  };
};
