// Offline Game Engine - ports Cairo contract logic to TypeScript
import { EncountersAction, GameMode, PlayerStatus, TradeDirection } from "@/dojo/types";
import {
  CASH_VALUES,
  DRUGS_PER_LOCATION,
  DRUG_CONFIGS,
  ENCOUNTER_ODDS_DIVISOR,
  ENCOUNTER_STATS,
  GameSettings,
  HEALTH_VALUES,
  LOCATIONS,
  MAX_DRUG_LEVEL,
  MAX_ITEM_LEVEL,
  MAX_REP,
  MAX_TICK,
  MAX_WANTED,
  MAX_WANTED_SHOPPING,
  REP_BUY_ITEM,
  REP_DRUG_STEP,
  TURNS_VALUES,
  WANTED_MODE_MODIFIER,
  randomizeSettings,
} from "./config";
import { Random } from "./random";

export interface PendingTrade {
  direction: TradeDirection;
  drug: number;
  quantity: number;
  cost: number;
}

export interface PendingShop {
  slot: number;
  cost: number;
}

export type PendingAction = PendingTrade | PendingShop;

export interface EncounterState {
  type: string; // "Cops" or "Gang"
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  payout: number;
  demandPct: number;
}

export interface GameEvent {
  eventName: string;
  event: any;
  idx: number;
}

export interface EngineState {
  gameId: number;
  playerId: string;
  playerName: string;
  gameMode: GameMode;

  // Player
  cash: number;
  health: number;
  turn: number;
  maxTurns: number;
  reputation: number;
  drugLevel: number;
  location: number;
  prevLocation: number;
  nextLocation: number;
  status: PlayerStatus;

  // Inventory
  drugId: number;
  drugQuantity: number;

  // Items (levels 0-3)
  weaponLevel: number;
  clothesLevel: number;
  feetLevel: number;
  transportLevel: number;

  // Equipment slot IDs (for display)
  equipmentBySlot: number[];

  // Markets: ticks[locationIdx 0-5][drugIdx 0-3]
  marketTicks: number[][];

  // Wanted: per location [0-5] = 0-7
  wantedLevels: number[];

  // Season settings
  settings: GameSettings;

  // Encounter (when in encounter)
  encounter: EncounterState | null;

  // Events
  events: GameEvent[];

  // Game state
  isFinished: boolean;
  finalScore: number;
}

let nextGameId = 1;

export class OfflineGameEngine {
  state: EngineState;
  private rng: Random;

  constructor() {
    this.state = null as any;
    this.rng = null as any;
  }

  createGame(playerName: string, gameMode: GameMode): EngineState {
    const seed = Date.now() ^ Math.floor(Math.random() * 0x7fffffff);
    this.rng = new Random(seed);

    const settings = randomizeSettings();
    const gameId = nextGameId++;

    const initialCash = CASH_VALUES[settings.cashMode] || 1000;
    const initialHealth = Math.min(HEALTH_VALUES[settings.healthMode] || 90, 100);
    const maxTurns = TURNS_VALUES[settings.turnsMode] || 18;

    // Generate random equipment
    const weaponItem = this.rng.int(0, 5);
    const clothesItem = this.rng.int(0, 5);
    const feetItem = this.rng.int(0, 5);
    const transportItem = this.rng.int(0, 5);

    // Initialize market ticks randomly
    const marketTicks: number[][] = [];
    for (let loc = 0; loc < 6; loc++) {
      const drugs: number[] = [];
      for (let d = 0; d < DRUGS_PER_LOCATION; d++) {
        drugs.push(this.rng.int(5, 55)); // random tick 5-55
      }
      marketTicks.push(drugs);
    }

    this.state = {
      gameId,
      playerId: `offline_${gameId}`,
      playerName,
      gameMode,
      cash: initialCash,
      health: initialHealth,
      turn: 0,
      maxTurns,
      reputation: 0,
      drugLevel: 0,
      location: 0, // Home
      prevLocation: 0,
      nextLocation: 0,
      status: PlayerStatus.Normal,
      drugId: 0,
      drugQuantity: 0,
      weaponLevel: 0,
      clothesLevel: 0,
      feetLevel: 0,
      transportLevel: 0,
      equipmentBySlot: [weaponItem, clothesItem, feetItem, transportItem],
      marketTicks,
      wantedLevels: [0, 0, 0, 0, 0, 0],
      settings,
      encounter: null,
      events: [],
      isFinished: false,
      finalScore: 0,
    };

    this.addEvent("GameCreated", {
      game_id: gameId,
      player_id: this.state.playerId,
      game_mode: gameMode,
      player_name: playerName,
    });

    return this.state;
  }

  // Process travel with pending actions (trades + shops)
  travel(nextLocation: number, pendingActions: PendingAction[]): EngineState {
    if (this.state.isFinished) return this.state;

    // Process pending trades
    for (const action of pendingActions) {
      if ("direction" in action) {
        this.processTrade(action as PendingTrade);
      } else if ("slot" in action) {
        this.processShop(action as PendingShop);
      }
    }

    // Update wanted levels
    this.updateWantedLevels(nextLocation);

    // Set travel state
    this.state.prevLocation = this.state.location;
    this.state.nextLocation = nextLocation;
    this.state.location = nextLocation;

    // Increment turn
    this.state.turn++;

    // Reputation gain for carrying drugs
    if (this.state.drugQuantity > 5) {
      this.addReputation(2);
    } else {
      this.addReputation(1);
    }

    // Update drug level
    this.updateDrugLevel();

    // Vary market prices
    this.varyMarkets();

    // Add traveled event
    this.addEvent("Traveled", {
      game_id: this.state.gameId,
      player_id: this.state.playerId,
      turn: this.state.turn,
      from_location: this.state.prevLocation,
      to_location: nextLocation,
    });

    // Check for encounter (not on first turn)
    if (this.state.turn > 1) {
      const hasEncounter = this.checkEncounter(nextLocation);
      if (hasEncounter) {
        return this.state;
      }
    }

    return this.state;
  }

  // End game (process remaining actions and finish)
  endGame(pendingActions: PendingAction[]): EngineState {
    // Process pending trades
    for (const action of pendingActions) {
      if ("direction" in action) {
        this.processTrade(action as PendingTrade);
      } else if ("slot" in action) {
        this.processShop(action as PendingShop);
      }
    }

    this.state.isFinished = true;
    this.state.finalScore = this.state.cash;

    this.addEvent("GameOver", {
      game_id: this.state.gameId,
      player_id: this.state.playerId,
      player_name: this.state.playerName,
      turn: this.state.turn,
      cash: this.state.cash,
      health: this.state.health,
      reputation: this.state.reputation,
      drug_level: this.state.drugLevel,
    });

    return this.state;
  }

  // Handle encounter decision
  decide(action: EncountersAction): EngineState {
    if (!this.state.encounter || this.state.status === PlayerStatus.Normal) {
      return this.state;
    }

    const encounter = this.state.encounter;
    const actionName = action === EncountersAction.Pay ? "Pay" : action === EncountersAction.Run ? "Run" : "Fight";

    // Track round-by-round combat data for consequence screen
    const result = {
      game_id: this.state.gameId,
      player_id: this.state.playerId,
      turn: this.state.turn,
      action: actionName,
      outcome: "",
      rounds: 0,
      dmg_dealt: [] as Array<Array<{ value: number }>>,
      dmg_taken: [] as Array<Array<{ value: number }>>,
      cash_earnt: 0,
      cash_loss: 0,
      drug_id: this.state.drugId,
      drug_loss: [] as number[],
      turn_loss: 0,
      rep_pos: 0,
      rep_neg: 0,
    };

    const repBefore = this.state.reputation;

    switch (action) {
      case EncountersAction.Pay:
        this.handlePayWithResult(encounter, result);
        break;
      case EncountersAction.Run:
        this.handleRunWithResult(encounter, result);
        break;
      case EncountersAction.Fight:
        this.handleFightWithResult(encounter, result);
        break;
      default:
        return this.state;
    }

    // Calculate rep changes
    const repAfter = this.state.reputation;
    if (repAfter > repBefore) result.rep_pos = repAfter - repBefore;
    if (repAfter < repBefore) result.rep_neg = repBefore - repAfter;

    this.addEvent("TravelEncounterResult", result);

    // Check death
    if (this.state.health <= 0) {
      this.state.health = 0;
      this.state.isFinished = true;
      this.state.finalScore = this.state.cash;
      this.state.status = PlayerStatus.Normal;
      this.state.encounter = null;

      this.addEvent("GameOver", {
        game_id: this.state.gameId,
        player_id: this.state.playerId,
        player_name: this.state.playerName,
        turn: this.state.turn,
        cash: this.state.cash,
        health: 0,
        reputation: this.state.reputation,
        drug_level: this.state.drugLevel,
      });
    }

    return this.state;
  }

  // --- Private helpers ---

  private processTrade(trade: PendingTrade) {
    if (trade.direction === TradeDirection.Buy) {
      this.state.cash -= trade.cost;
      if (this.state.drugQuantity === 0 || this.state.drugId === trade.drug) {
        this.state.drugId = trade.drug;
        this.state.drugQuantity += trade.quantity;
      }
      this.addEvent("TradeDrug", {
        game_id: this.state.gameId,
        player_id: this.state.playerId,
        turn: this.state.turn,
        drug: trade.drug,
        quantity: trade.quantity,
        cost: trade.cost,
        is_buy: true,
      });
    } else {
      this.state.cash += trade.cost;
      this.state.drugQuantity -= trade.quantity;
      if (this.state.drugQuantity <= 0) {
        this.state.drugQuantity = 0;
      }
      this.addEvent("TradeDrug", {
        game_id: this.state.gameId,
        player_id: this.state.playerId,
        turn: this.state.turn,
        drug: trade.drug,
        quantity: trade.quantity,
        cost: trade.cost,
        is_buy: false,
      });
    }
  }

  private processShop(shop: PendingShop) {
    this.state.cash -= shop.cost;
    this.addReputation(REP_BUY_ITEM);

    switch (shop.slot) {
      case 0:
        this.state.weaponLevel = Math.min(this.state.weaponLevel + 1, MAX_ITEM_LEVEL);
        break;
      case 1:
        this.state.clothesLevel = Math.min(this.state.clothesLevel + 1, MAX_ITEM_LEVEL);
        break;
      case 2:
        this.state.feetLevel = Math.min(this.state.feetLevel + 1, MAX_ITEM_LEVEL);
        break;
      case 3:
        this.state.transportLevel = Math.min(this.state.transportLevel + 1, MAX_ITEM_LEVEL);
        break;
    }

    this.addEvent("UpgradeItem", {
      game_id: this.state.gameId,
      player_id: this.state.playerId,
      turn: this.state.turn,
      slot: shop.slot,
      cost: shop.cost,
    });
  }

  private updateWantedLevels(nextLocation: number) {
    const locIdx = nextLocation - 1;
    if (locIdx < 0 || locIdx >= 6) return;

    // Decrease wanted at locations we're not at
    for (let i = 0; i < 6; i++) {
      if (i !== locIdx && this.state.wantedLevels[i] > 0) {
        this.state.wantedLevels[i] = Math.max(0, this.state.wantedLevels[i] - 1);
      }
    }

    // Increase wanted at destination
    if (this.state.location === nextLocation) {
      // Returning to same location
      this.state.wantedLevels[locIdx] = Math.min(MAX_WANTED, this.state.wantedLevels[locIdx] + 3);
    }

    if (this.state.drugQuantity > 0) {
      // Carrying drugs increases wanted
      this.state.wantedLevels[locIdx] = Math.min(MAX_WANTED, this.state.wantedLevels[locIdx] + 1);
    }
  }

  private checkEncounter(locationId: number): boolean {
    const locIdx = locationId - 1;
    if (locIdx < 0 || locIdx >= 6) return false;

    const wantedTick = this.state.wantedLevels[locIdx];
    const riskPct = wantedTick * 15 - (WANTED_MODE_MODIFIER[this.state.settings.wantedMode] || 0);

    const isWarrior = this.state.gameMode === GameMode.Warrior;
    const hasEncounter = isWarrior || (riskPct > 0 && this.rng.int(0, 100) < riskPct);

    if (!hasEncounter) return false;

    // Determine encounter type
    const isCops = this.rng.bool(0.5);
    const encounterType = isCops ? "Cops" : "Gang";

    // Determine encounter level
    const divisor = ENCOUNTER_ODDS_DIVISOR[this.state.settings.encountersOddsMode] || 16;
    const level = Math.min(6, Math.max(1, Math.floor(this.state.reputation / divisor) + 1));

    // Get encounter stats
    const stats = (ENCOUNTER_STATS[this.state.settings.encountersMode] || ENCOUNTER_STATS.NoJokes).find(
      (s) => s.encounter === encounterType && s.level === level,
    );

    if (!stats) return false;

    // Determine demand percentage
    const demandRoll = this.rng.int(1, 100);
    let demandPct: number;
    if (demandRoll <= 1) demandPct = 69;
    else if (demandRoll <= 11) demandPct = 50;
    else if (demandRoll <= 31) demandPct = 40;
    else if (demandRoll <= 81) demandPct = 30;
    else demandPct = 20;

    // Calculate payout
    const turnBonus = Math.floor(this.state.turn / 5);
    const payout = (level * 3 + turnBonus * turnBonus) * 1000;

    this.state.encounter = {
      type: encounterType,
      level,
      health: stats.health,
      maxHealth: stats.health,
      attack: stats.attack,
      defense: stats.defense,
      speed: stats.speed,
      payout,
      demandPct,
    };

    this.state.status = isCops ? PlayerStatus.BeingArrested : PlayerStatus.BeingMugged;

    this.addEvent("TravelEncounter", {
      game_id: this.state.gameId,
      player_id: this.state.playerId,
      turn: this.state.turn,
      encounter: encounterType,
      level,
      health: stats.health,
      attack: stats.attack,
      defense: stats.defense,
      speed: stats.speed,
      payout,
      demand_pct: demandPct,
    });

    return true;
  }

  private handlePayWithResult(encounter: EncounterState, result: any) {
    result.rounds = 0;

    if (encounter.type === "Cops") {
      // Cops want drugs
      const drugsLost = Math.ceil(this.state.drugQuantity * encounter.demandPct / 100);
      result.drug_loss = [drugsLost];
      this.state.drugQuantity = Math.max(0, this.state.drugQuantity - drugsLost);
      if (this.state.drugQuantity === 0) {
        this.state.drugId = 0;
      }
    } else {
      // Gang wants cash
      const cashLost = Math.ceil(this.state.cash * encounter.demandPct / 100);
      result.cash_loss = cashLost;
      this.state.cash = Math.max(0, this.state.cash - cashLost);
      // Gang also takes 1 HP (can't kill)
      if (this.state.health > 1) {
        this.state.health -= 1;
      }
    }

    this.addReputation(-encounter.level * 5);
    result.outcome = "Paid";
    this.state.status = PlayerStatus.Normal;
    this.state.encounter = null;
  }

  private handleRunWithResult(encounter: EncounterState, result: any) {
    const maxRounds = 3;

    for (let round = 0; round < maxRounds; round++) {
      result.rounds = round + 1;

      // Speed contest
      const playerSpeed = this.getPlayerSpeed();
      const playerRoll = this.rng.int(0, playerSpeed);
      const encounterRoll = this.rng.int(0, encounter.speed);

      if (playerRoll >= encounterRoll) {
        // Escaped
        this.addReputation(encounter.level * 2);
        result.outcome = "Escaped";
        this.state.status = PlayerStatus.Normal;
        this.state.encounter = null;
        return;
      }

      // Failed to escape - take damage and lose some drugs
      const rawDamage = Math.max(1, Math.floor(encounter.attack / 5));
      const defensePct = this.getPlayerDefense();
      const blocked = Math.floor(rawDamage * defensePct / 100);
      const netDamage = Math.max(1, rawDamage - blocked);
      this.state.health = Math.max(0, this.state.health - netDamage);

      result.dmg_taken.push([{ value: rawDamage }, { value: blocked }]);

      // Lose some drugs while running
      const drugsLost = Math.min(2, this.state.drugQuantity);
      if (drugsLost > 0) {
        result.drug_loss.push(drugsLost);
        this.state.drugQuantity -= drugsLost;
        if (this.state.drugQuantity <= 0) {
          this.state.drugQuantity = 0;
        }
      }

      if (this.state.health <= 0) {
        result.outcome = "Died";
        this.state.status = PlayerStatus.Normal;
        this.state.encounter = null;
        return;
      }
    }

    // Caught after max rounds
    if (encounter.type === "Cops") {
      result.outcome = "Jailed";
      result.turn_loss = 2;
      this.state.turn = Math.min(this.state.turn + 2, this.state.maxTurns);
      this.addReputation(6);
      this.state.location = this.rng.int(1, 6);
    } else {
      result.outcome = "Hospitalized";
      result.turn_loss = 1;
      this.state.turn = Math.min(this.state.turn + 1, this.state.maxTurns);
      this.addReputation(4);
      this.state.location = this.rng.int(1, 6);
    }

    this.state.status = PlayerStatus.Normal;
    this.state.encounter = null;
  }

  private handleFightWithResult(encounter: EncounterState, result: any) {
    let encounterHealth = encounter.health;

    // Determine initiative
    const playerSpeed = this.getPlayerSpeed();
    const playerGoesFirst = this.rng.int(0, playerSpeed) >= this.rng.int(0, encounter.speed);

    const maxRounds = 10;
    for (let round = 0; round < maxRounds; round++) {
      result.rounds = round + 1;

      if (playerGoesFirst || round > 0) {
        // Player attacks
        const baseAttack = this.getPlayerAttack();
        const attackVariance = Math.floor(baseAttack * 0.2);
        const rawPlayerDmg = this.rng.int(baseAttack - attackVariance, baseAttack + attackVariance);
        const blocked = Math.floor(rawPlayerDmg * encounter.defense / 100);
        const netDamage = Math.max(1, rawPlayerDmg - blocked);
        // Encounter takes reduced damage (1/3)
        const actualDmg = Math.max(1, Math.floor(netDamage / 3));
        encounterHealth -= actualDmg;

        result.dmg_dealt.push([{ value: actualDmg }, { value: blocked }]);

        if (encounterHealth <= 0) {
          result.outcome = "Victorious";
          result.cash_earnt = encounter.payout;
          this.state.cash += encounter.payout;
          this.addReputation(encounter.level * 3);
          this.state.status = PlayerStatus.Normal;
          this.state.encounter = null;
          return;
        }
      }

      // Encounter attacks
      const encounterAttackVariance = Math.floor(encounter.attack * 0.2);
      const rawEncounterDmg = this.rng.int(
        encounter.attack - encounterAttackVariance,
        encounter.attack + encounterAttackVariance,
      );
      const playerDefensePct = this.getPlayerDefense();
      const playerBlocked = Math.floor(rawEncounterDmg * playerDefensePct / 100);
      const netEncounterDmg = Math.max(1, rawEncounterDmg - playerBlocked);
      this.state.health -= netEncounterDmg;

      result.dmg_taken.push([{ value: rawEncounterDmg }, { value: playerBlocked }]);

      if (this.state.health <= 0) {
        this.state.health = 0;
        result.outcome = "Died";
        this.state.status = PlayerStatus.Normal;
        this.state.encounter = null;
        return;
      }
    }

    // After max rounds, player survives
    this.addReputation(encounter.level * 2);
    result.outcome = "Escaped";
    this.state.status = PlayerStatus.Normal;
    this.state.encounter = null;
  }

  private getPlayerAttack(): number {
    // Get from item tier config - simplified
    return 10 + this.state.weaponLevel * 15;
  }

  private getPlayerDefense(): number {
    return 5 + this.state.clothesLevel * 12;
  }

  private getPlayerSpeed(): number {
    return 5 + this.state.feetLevel * 12;
  }

  private addReputation(amount: number) {
    this.state.reputation = Math.max(0, Math.min(MAX_REP, this.state.reputation + amount));
  }

  private updateDrugLevel() {
    const newLevel = Math.min(MAX_DRUG_LEVEL, Math.floor(this.state.reputation / REP_DRUG_STEP));
    this.state.drugLevel = newLevel;
  }

  private varyMarkets() {
    for (let loc = 0; loc < 6; loc++) {
      for (let drug = 0; drug < DRUGS_PER_LOCATION; drug++) {
        const roll = this.rng.int(1, 1000);
        let delta = 0;

        if (roll <= 200 || roll >= 800) {
          delta = roll <= 200 ? -1 : 1;
        } else if (roll <= 350 || roll >= 650) {
          delta = roll <= 350 ? -2 : 2;
        } else if (roll <= 470 || roll >= 530) {
          delta = roll <= 470 ? -4 : 4;
        } else if (roll <= 493 || roll >= 507) {
          delta = roll <= 493 ? -6 : 6;
        } else {
          delta = this.rng.bool(0.5) ? -12 : 12;
          // High volatility event
          this.addEvent("HighVolatility", {
            game_id: this.state.gameId,
            player_id: this.state.playerId,
            turn: this.state.turn,
            location: loc + 1,
            drug,
          });
        }

        const newTick = Math.max(0, Math.min(MAX_TICK, this.state.marketTicks[loc][drug] + delta));
        this.state.marketTicks[loc][drug] = newTick;
      }
    }
  }

  private addEvent(eventName: string, event: any) {
    const turn = this.state?.turn || 0;
    let basePriority = 0;
    switch (eventName) {
      case "Traveled":
        basePriority = 0;
        break;
      case "TradeDrug":
        basePriority = event.is_buy ? 30 : 1;
        break;
      case "UpgradeItem":
        basePriority = 20;
        break;
      case "TravelEncounter":
        basePriority = 50;
        break;
      case "TravelEncounterResult":
        basePriority = 51;
        break;
      case "GameOver":
        basePriority = 70;
        break;
      case "HighVolatility":
        basePriority = 10;
        break;
      default:
        basePriority = 0;
    }

    this.state.events.push({
      eventName,
      event,
      idx: turn * 100 + basePriority + this.state.events.length,
    });
  }
}
