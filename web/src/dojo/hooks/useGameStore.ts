import { useDojoContext } from "./useDojoContext";

export const useGameStore = () => {
  const { gameStore } = useDojoContext();
  return gameStore;
};
