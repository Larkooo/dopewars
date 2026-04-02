// Offline Game Store - replaces GameStoreClass for offline mode
import { action, makeObservable, observable } from "mobx";
import { NextRouter } from "next/router";
import { OfflineGameEngine, EngineState, PendingAction } from "./engine";
import { OfflineConfigStore, OfflineGameClass, OfflineEventClass } from "./game";
import { PlayerStatus, EncountersAction, Locations } from "@/dojo/types";
import { PendingCall, isTradeAction, isShopAction } from "@/dojo/class/Game";
import { DojoEvent } from "@/dojo/class/Events";

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
      if (state.location === 0) {
        // At home - go to first location or travel
        this.router.push(`/${gameId}/travel`);
      } else {
        const location = this.configStore.getLocationById(state.location);
        if (location) {
          this.router.push(`/${gameId}/${location.location.toLowerCase()}`);
        }
      }
    } else {
      // In encounter
      this.router.push(`/${gameId}/event/decision`);
    }
  }

  // Process travel action
  doTravel(nextLocation: number, pendingCalls: PendingCall[]) {
    const actions = this.pendingCallsToActions(pendingCalls);
    this.engine.travel(nextLocation, actions);
    this.initFromEngine();
    this.navigate();
  }

  // Process end game
  doEndGame(pendingCalls: PendingCall[]) {
    const actions = this.pendingCallsToActions(pendingCalls);
    this.engine.endGame(actions);
    this.initFromEngine();

    const state = this.engine.state;
    const gameId = `0x${state.gameId.toString(16)}`;
    this.router.push(`/${gameId}/end`);
  }

  // Process encounter decision
  doDecide(action: EncountersAction) {
    this.engine.decide(action);
    this.initFromEngine();

    const state = this.engine.state;
    const gameId = `0x${state.gameId.toString(16)}`;

    if (state.isFinished) {
      this.router.push(`/${gameId}/event/consequence`);
    } else if (state.status === PlayerStatus.Normal) {
      // Encounter resolved - show consequence then go to location
      this.router.push(`/${gameId}/event/consequence`);
    } else {
      // Still in encounter (shouldn't happen with current logic)
      this.router.push(`/${gameId}/event/decision`);
    }
  }

  private pendingCallsToActions(pendingCalls: PendingCall[]): PendingAction[] {
    return pendingCalls.map((call) => {
      if (isTradeAction(call)) {
        return {
          direction: call.direction,
          drug: call.drug,
          quantity: call.quantity,
          cost: 0, // Cost is computed by engine
        };
      } else if (isShopAction(call)) {
        return {
          slot: call.slot,
          cost: 0,
        };
      }
      return call as any;
    });
  }
}
