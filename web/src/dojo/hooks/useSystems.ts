import { useCallback, useState } from "react";
import { PendingCall } from "../class/Game";
import { EncountersAction, GameMode, Locations } from "../types";
import { useDojoContext } from "./useDojoContext";

export interface SystemsInterface {
  createGame: (
    gameMode: number,
    playerName: string,
  ) => Promise<{ gameId: string; isError?: boolean }>;
  endGame: (gameId: string, actions: Array<PendingCall>) => Promise<{ isError?: boolean }>;
  travel: (gameId: string, locationId: Locations, actions: Array<PendingCall>) => Promise<{ isError?: boolean }>;
  decide: (gameId: string, action: EncountersAction) => Promise<{ isError?: boolean }>;
  isPending: boolean;
  error?: string;
}

export const useSystems = (): SystemsInterface => {
  const { engine, gameStore } = useDojoContext();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const createGame = useCallback(
    async (gameMode: GameMode, playerName: string) => {
      setIsPending(true);
      try {
        const state = engine.createGame(playerName, gameMode);
        gameStore.initFromEngine();
        gameStore.navigate();
        setIsPending(false);
        return { gameId: `0x${state.gameId.toString(16)}` };
      } catch (e: any) {
        setError(e.toString());
        setIsPending(false);
        return { gameId: "0x0", isError: true };
      }
    },
    [engine, gameStore],
  );

  const endGame = useCallback(
    async (gameId: string, actions: Array<PendingCall>) => {
      setIsPending(true);
      try {
        gameStore.doEndGame(actions);
        setIsPending(false);
        return {};
      } catch (e: any) {
        setError(e.toString());
        setIsPending(false);
        return { isError: true };
      }
    },
    [gameStore],
  );

  const travel = useCallback(
    async (gameId: string, locationId: Locations, actions: Array<PendingCall>) => {
      setIsPending(true);
      try {
        gameStore.doTravel(locationId, actions);
        setIsPending(false);
        return {};
      } catch (e: any) {
        setError(e.toString());
        setIsPending(false);
        return { isError: true };
      }
    },
    [gameStore],
  );

  const decide = useCallback(
    async (gameId: string, action: EncountersAction) => {
      setIsPending(true);
      try {
        gameStore.doDecide(action);
        setIsPending(false);
        return {};
      } catch (e: any) {
        setError(e.toString());
        setIsPending(false);
        return { isError: true };
      }
    },
    [gameStore],
  );

  return {
    createGame,
    endGame,
    travel,
    decide,
    isPending,
    error,
  };
};
