// Offline Game Store - replaces GameStoreClass for offline mode
import { action, makeObservable, observable } from "mobx";
import { NextRouter } from "next/router";
import { OfflineGameEngine, EngineState, PendingAction } from "./engine";
import { OfflineConfigStore, OfflineGameClass, OfflineEventClass } from "./game";
import { PlayerStatus, EncountersAction } from "@/dojo/types";
import { PendingCall, isTradeAction, isShopAction } from "@/dojo/class/Game";

const STORAGE_KEY = "dopewars_saved_games";

export interface SavedGameSummary {
  gameId: number;
  playerName: string;
  cash: number;
  health: number;
  turn: number;
  maxTurns: number;
  reputation: number;
  location: number;
  isFinished: boolean;
  finalScore: number;
  lastPlayed: number;
}

type OfflineGameStoreProps = {
  configStore: OfflineConfigStore;
  engine: OfflineGameEngine;
  router: NextRouter;
};

export class OfflineGameStoreClass {
  configStore: OfflineConfigStore;
  engine: OfflineGameEngine;
  router: NextRouter;

  isInitialized = false;
  game: OfflineGameClass | null = null;
  gameEvents: OfflineEventClass | null = null;
  gameInfos: any | null = null;
  gameConfig: any | null = null;
  seasonSettings: any | null = null;

  constructor({ configStore, engine, router }: OfflineGameStoreProps) {
    this.configStore = configStore;
    this.engine = engine;
    this.router = router;

    makeObservable(this, {
      game: observable,
      gameEvents: observable,
      gameInfos: observable,
      gameConfig: observable,
      seasonSettings: observable,
      reset: action,
      initFromEngine: action,
      loadGame: action,
    });
  }

  reset() {
    this.game = null;
    this.gameInfos = null;
    this.gameConfig = null;
    this.gameEvents = null;
    this.seasonSettings = null;
    this.isInitialized = false;
  }

  initFromEngine() {
    const state = this.engine.state;
    if (!state) return;

    this.game = new OfflineGameClass(this.configStore, state);
    this.gameEvents = new OfflineEventClass(state.events);
    this.gameInfos = this.game.gameInfos;
    this.gameConfig = this.game.gameConfig;
    this.seasonSettings = this.game.seasonSettings;
    this.isInitialized = true;

    this.persistCurrentGame();
  }

  // Load a saved game by gameId
  loadGame(gameId: number): boolean {
    const saved = this.getSavedGames();
    const key = `dopewars_game_${gameId}`;
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (!raw) return false;

    try {
      const state: EngineState = JSON.parse(raw);
      this.engine.state = state;
      this.engine.reseed();
      this.initFromEngine();
      return true;
    } catch {
      return false;
    }
  }

  // Navigate based on game state
  navigate() {
    const state = this.engine.state;
    if (!state) return;

    const gameId = `0x${state.gameId.toString(16)}`;

    if (state.isFinished) {
      this.router.push(`/${gameId}/end`);
      return;
    }

    if (state.status === PlayerStatus.Normal) {
      const location = this.configStore.getLocationById(state.location);
      if (location && location.location_id > 0) {
        this.router.push(`/${gameId}/${location.location.toLowerCase()}`);
      } else {
        this.router.push(`/${gameId}/queens`);
      }
    } else {
      this.router.push(`/${gameId}/event/decision`);
    }
  }

  doTravel(nextLocation: number, _pendingCalls: PendingCall[]) {
    const actions = this.getActionsWithCosts();
    this.engine.travel(nextLocation, actions);
    this.initFromEngine();
    this.navigate();
  }

  doEndGame(_pendingCalls: PendingCall[]) {
    const actions = this.getActionsWithCosts();
    this.engine.endGame(actions);
    this.initFromEngine();

    const state = this.engine.state;
    const gameId = `0x${state.gameId.toString(16)}`;
    this.router.push(`/${gameId}/end`);
  }

  doDecide(action: EncountersAction) {
    this.engine.decide(action);
    this.initFromEngine();

    const state = this.engine.state;
    const gameId = `0x${state.gameId.toString(16)}`;

    if (state.isFinished) {
      this.router.push(`/${gameId}/event/consequence`);
    } else if (state.status === PlayerStatus.Normal) {
      this.router.push(`/${gameId}/event/consequence`);
    } else {
      this.router.push(`/${gameId}/event/decision`);
    }
  }

  // === Persistence ===

  private persistCurrentGame() {
    if (typeof window === "undefined") return;
    const state = this.engine.state;
    if (!state) return;

    // Save full state
    const key = `dopewars_game_${state.gameId}`;
    localStorage.setItem(key, JSON.stringify(state));

    // Update index
    const saved = this.getSavedGames();
    const existing = saved.findIndex((g) => g.gameId === state.gameId);
    const summary: SavedGameSummary = {
      gameId: state.gameId,
      playerName: state.playerName,
      cash: state.cash,
      health: state.health,
      turn: state.turn,
      maxTurns: state.maxTurns,
      reputation: state.reputation,
      location: state.location,
      isFinished: state.isFinished,
      finalScore: state.finalScore,
      lastPlayed: Date.now(),
    };

    if (existing >= 0) {
      saved[existing] = summary;
    } else {
      saved.push(summary);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  getSavedGames(): SavedGameSummary[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  deleteSavedGame(gameId: number) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`dopewars_game_${gameId}`);
    const saved = this.getSavedGames().filter((g) => g.gameId !== gameId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }

  private getActionsWithCosts(): PendingAction[] {
    if (!this.game?.pending) return [];
    return this.game.pending.map((call) => {
      if (isTradeAction(call)) {
        return {
          direction: call.direction,
          drug: call.drug,
          quantity: call.quantity,
          cost: call.cost,
        };
      } else if (isShopAction(call)) {
        return {
          slot: call.slot,
          cost: call.cost,
        };
      }
      return call as any;
    });
  }
}
