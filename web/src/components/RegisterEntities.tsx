import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";

const RegisterEntities = observer(() => {
  const { gameId } = useRouterContext();
  const gameStore = useGameStore();

  useEffect(() => {
    if (gameStore && gameId) {
      // In offline mode, the game state is already loaded from the engine
      // Just ensure the store is initialized
      if (!gameStore.isInitialized) {
        gameStore.initFromEngine();
      }
    } else {
      gameStore.reset();
    }
  }, [gameId, gameStore]);

  return null;
});

export default RegisterEntities;
