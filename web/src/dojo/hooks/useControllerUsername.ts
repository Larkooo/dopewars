// Stub for offline mode - no wallet
export const useControllerUsername = (_address?: string) => {
  return {
    username: "Player",
    isController: false,
    refetch: async () => {},
  };
};
