// Offline Game Engine - 1:1 port of Cairo contract logic
// References: src/systems/helpers/traveling.cairo, game_loop.cairo, trading.cairo, shopping.cairo
//             src/packing/game_store.cairo, markets_packed.cairo, player.cairo
import { EncountersAction, GameMode, PlayerStatus, TradeDirection } from "@/dojo/types";
import {
  CASH_VALUES,
  DRUGS_PER_LOCATION,
  ENCOUNTER_ODDS_DIVISOR,
  GameSettings,
  HEALTH_VALUES,
  MAX_DRUG_LEVEL,
  MAX_ITEM_LEVEL,
  MAX_REP,
  MAX_ROUNDS,
  MAX_TICK,
  MAX_WANTED,
  REP_BUY_ITEM,
  REP_CARRY_DRUGS,
  REP_DRUG_STEP,
  REP_FIGHT_MULTIPLIER,
  REP_HOSPITALIZED,
  REP_JAILED,
  REP_PAY_MULTIPLIER,
  REP_RUN_MULTIPLIER,
  TURNS_VALUES,
  WANTED_LEAVE_WITH_DRUGS,
  WANTED_RISK_MODIFIER,
  WANTED_TRAVEL_BACK,
  getEncounterStats,
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
  type: string;
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
  drugId: number;
  drugQuantity: number;
  weaponLevel: number;
  clothesLevel: number;
  feetLevel: number;
  transportLevel: number;
  equipmentBySlot: number[];
  marketTicks: number[][];
  wantedLevels: number[];
  settings: GameSettings;
  encounter: EncounterState | null;
  events: GameEvent[];
  isFinished: boolean;
  finalScore: number;
}

function getNextGameId(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem("dopewars_saved_games");
    const saved = raw ? JSON.parse(raw) : [];
    const maxId = saved.reduce((max: number, g: any) => Math.max(max, g.gameId || 0), 0);
    return maxId + 1;
  } catch {
    return Date.now();
  }
}

export class OfflineGameEngine {
  state: EngineState;
  private rng: Random;

  constructor() {
    this.state = null as any;
    this.rng = null as any;
  }

  // Re-seed RNG for a loaded game
  reseed() {
    const seed = Date.now() ^ Math.floor(Math.random() * 0x7fffffff);
    this.rng = new Random(seed);
  }

  createGame(playerName: string, gameMode: GameMode): EngineState {
    const seed = Date.now() ^ Math.floor(Math.random() * 0x7fffffff);
    this.rng = new Random(seed);

    const settings = randomizeSettings();
    const gameId = getNextGameId();

    const initialCash = CASH_VALUES[settings.cashMode] || 1000;
    const initialHealth = Math.min(HEALTH_VALUES[settings.healthMode] || 90, 100);
    const maxTurns = TURNS_VALUES[settings.turnsMode] || 18;

    const weaponItem = this.rng.int(0, 5);
    const clothesItem = this.rng.int(0, 5);
    const feetItem = this.rng.int(0, 5);
    const transportItem = this.rng.int(0, 5);

    const marketTicks: number[][] = [];
    for (let loc = 0; loc < 6; loc++) {
      const drugs: number[] = [];
      for (let d = 0; d < DRUGS_PER_LOCATION; d++) {
        drugs.push(this.rng.int(5, 55));
      }
      marketTicks.push(drugs);
    }

    const startLocation = this.rng.int(1, 6);

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
      location: startLocation,
      prevLocation: 0,
      nextLocation: startLocation,
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

  // Matches game.cairo::travel + game_loop.cairo::on_travel + on_turn_end
  travel(nextLocation: number, pendingActions: PendingAction[]): EngineState {
    if (this.state.isFinished) return this.state;

    // 1. Execute pending trades/shops (trading.cairo, shopping.cairo)
    for (const action of pendingActions) {
      if ("direction" in action) {
        this.processTrade(action as PendingTrade);
      } else if ("slot" in action) {
        this.processShop(action as PendingShop);
      }
    }

    // 2. Update wanted levels BEFORE encounter check (game_store.cairo::update_wanted)
    this.updateWanted(nextLocation);

    // 3. Check encounter BEFORE turn increment (game_loop.cairo: skip if turn == 0)
    if (this.state.turn > 0) {
      const hasEncounter = this.checkEncounter(nextLocation);
      if (hasEncounter) {
        // Set next_location so decide() knows where to go after resolution
        this.state.nextLocation = nextLocation;
        return this.state;
      }
    }

    // 4. on_turn_end: update locations, increment turn, rep, drug level, markets
    this.onTurnEnd(nextLocation);

    return this.state;
  }

  endGame(pendingActions: PendingAction[]): EngineState {
    for (const action of pendingActions) {
      if ("direction" in action) {
        this.processTrade(action as PendingTrade);
      } else if ("slot" in action) {
        this.processShop(action as PendingShop);
      }
    }
    this.onGameOver();
    return this.state;
  }

  // Matches decide.cairo + traveling.cairo::decide
  decide(action: EncountersAction): EngineState {
    if (!this.state.encounter || this.state.status === PlayerStatus.Normal) {
      return this.state;
    }

    const encounter = this.state.encounter;
    const actionName = action === EncountersAction.Pay ? "Pay" : action === EncountersAction.Run ? "Run" : "Fight";
    const isWarrior = this.state.gameMode === GameMode.Warrior;

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
        this.onPay(encounter, result, isWarrior);
        break;
      case EncountersAction.Run:
        this.onRun(encounter, result, isWarrior);
        break;
      case EncountersAction.Fight:
        this.onFight(encounter, result, isWarrior);
        break;
      default:
        return this.state;
    }

    const repAfter = this.state.reputation;
    if (repAfter > repBefore) result.rep_pos = repAfter - repBefore;
    if (repAfter < repBefore) result.rep_neg = repBefore - repAfter;

    this.addEvent("TravelEncounterResult", result);

    if (this.state.health <= 0) {
      this.state.health = 0;
      this.onGameOver();
    } else {
      // Encounter resolved, complete the turn (game_loop::on_turn_end)
      this.state.status = PlayerStatus.Normal;
      this.state.encounter = null;
      this.onTurnEnd(this.state.nextLocation);
    }

    return this.state;
  }

  // === game_loop.cairo::on_turn_end ===
  private onTurnEnd(nextLocation: number) {
    // Update locations
    this.state.prevLocation = this.state.location;
    this.state.location = nextLocation;
    this.state.nextLocation = nextLocation;

    // Increment turn (capped to max_turns)
    this.state.turn = Math.min(this.state.turn + 1, this.state.maxTurns);

    // Reputation: rep_carry_drugs if quantity > 5, else 1
    if (this.state.drugQuantity > 5) {
      this.addReputation(REP_CARRY_DRUGS);
    } else {
      this.addReputation(1);
    }

    // Level up drug
    this.updateDrugLevel();

    // Market variations
    this.varyMarkets();

    // Emit traveled event
    this.addEvent("Traveled", {
      game_id: this.state.gameId,
      player_id: this.state.playerId,
      turn: this.state.turn,
      from_location: this.state.prevLocation,
      to_location: this.state.location,
    });
  }

  private onGameOver() {
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
      health: this.state.health,
      reputation: this.state.reputation,
      drug_level: this.state.drugLevel,
    });
  }

  // === trading.cairo ===
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

  // === shopping.cairo ===
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

  // === game_store.cairo::update_wanted ===
  private updateWanted(nextLocation: number) {
    const wantedMode = this.state.settings.wantedMode;
    const travelBackMod = WANTED_TRAVEL_BACK[wantedMode] || 3;
    const leaveWithDrugsMod = WANTED_LEAVE_WITH_DRUGS[wantedMode] || 5;

    for (let i = 0; i < 6; i++) {
      const locId = i + 1;

      if (locId === nextLocation && locId === this.state.location) {
        // Traveling back to same location
        this.state.wantedLevels[i] = Math.min(MAX_WANTED, this.state.wantedLevels[i] + travelBackMod);
      } else if (locId === this.state.location && this.state.drugQuantity > 0) {
        // Leaving current location with drugs
        this.state.wantedLevels[i] = Math.min(MAX_WANTED, this.state.wantedLevels[i] + leaveWithDrugsMod);
      } else if (locId !== nextLocation && locId !== this.state.prevLocation && locId !== this.state.location) {
        // Other locations: decrease by 1
        this.state.wantedLevels[i] = Math.max(0, this.state.wantedLevels[i] - 1);
      }
    }
  }

  // === traveling.cairo::on_travel ===
  private checkEncounter(nextLocationId: number): boolean {
    const locIdx = nextLocationId - 1;
    if (locIdx < 0 || locIdx >= 6) return false;

    const wantedTick = this.state.wantedLevels[locIdx];
    const riskPct = wantedTick * 15 - (WANTED_RISK_MODIFIER[this.state.settings.wantedMode] || 0);

    const isWarrior = this.state.gameMode === GameMode.Warrior;
    const hasEncounter = isWarrior || (riskPct > 0 && this.rng.int(0, 100) < riskPct);

    if (!hasEncounter) return false;

    // Determine encounter type (50/50 cops vs gang)
    const isCops = this.rng.bool(0.5);
    const encounterType = isCops ? "Cops" : "Gang";

    // Encounter level: reputation / divisor + 1, max 6
    const divisor = ENCOUNTER_ODDS_DIVISOR[this.state.settings.encountersOddsMode] || 16;
    const level = Math.min(6, Math.max(1, Math.floor(this.state.reputation / divisor) + 1));

    // Get stats from config (base + level * step)
    const stats = getEncounterStats(this.state.settings.encountersMode, encounterType, level);

    // Demand percentage distribution (encounters.cairo)
    const demandRoll = this.rng.int(1, 100);
    let demandPct: number;
    if (demandRoll <= 1) demandPct = 69;
    else if (demandRoll <= 10) demandPct = 50;
    else if (demandRoll <= 20) demandPct = 40;
    else if (demandRoll <= 50) demandPct = 30;
    else demandPct = 20;

    // Payout: (level*3 + (turn/5)^2) * 1000
    const turnMod = Math.floor(this.state.turn / 5);
    const payout = (level * 3 + turnMod * turnMod) * 1000;

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

  // === traveling.cairo::on_pay ===
  private onPay(encounter: EncounterState, result: any, isWarrior: boolean) {
    result.rounds = 0;

    if (encounter.type === "Cops") {
      // Cops seize drugs
      const drugsLost = Math.ceil((this.state.drugQuantity * encounter.demandPct) / 100);
      result.drug_loss = [drugsLost];
      this.state.drugQuantity = Math.max(0, this.state.drugQuantity - drugsLost);
      if (this.state.drugQuantity === 0) this.state.drugId = 0;
    } else {
      // Gang takes cash + 1 HP (can't kill)
      const cashLost = Math.ceil((this.state.cash * encounter.demandPct) / 100);
      result.cash_loss = cashLost;
      this.state.cash = Math.max(0, this.state.cash - cashLost);
      if (this.state.health > 1) this.state.health -= 1;
    }

    const repLoss = encounter.level * REP_PAY_MULTIPLIER * (isWarrior ? 2 : 1);
    this.addReputation(-repLoss);
    result.outcome = "Paid";
  }

  // === traveling.cairo::on_run ===
  private onRun(encounter: EncounterState, result: any, isWarrior: boolean) {
    for (let round = 0; round < MAX_ROUNDS; round++) {
      result.rounds = round + 1;

      // Speed race: player vs encounter
      const playerRoll = this.rng.int(0, this.getPlayerSpeed());
      const encounterRoll = this.rng.int(0, encounter.speed);

      if (playerRoll >= encounterRoll) {
        // Escaped!
        const repGain = encounter.level * REP_RUN_MULTIPLIER * (isWarrior ? 2 : 1);
        this.addReputation(repGain);
        result.outcome = "Escaped";
        return;
      }

      // Failed to escape - encounter attacks (damage reduced by /5 per traveling.cairo)
      const rawDmg = this.plusOrLessRandomPct(encounter.attack, 20);
      const reducedDmg = Math.max(1, Math.floor(rawDmg / 5));
      const shield = Math.floor((reducedDmg * this.getPlayerDefense()) / 100);
      const netDmg = Math.max(1, reducedDmg - shield);
      this.state.health = Math.max(0, this.state.health - netDmg);

      result.dmg_taken.push([{ value: reducedDmg }, { value: shield }]);

      // Lose some drugs while running
      const drugsLost = Math.min(2, this.state.drugQuantity);
      if (drugsLost > 0) {
        result.drug_loss.push(drugsLost);
        this.state.drugQuantity -= drugsLost;
        if (this.state.drugQuantity <= 0) this.state.drugQuantity = 0;
      }

      if (this.state.health <= 0) {
        result.outcome = "Died";
        return;
      }
    }

    // Caught after max rounds
    if (encounter.type === "Cops") {
      result.outcome = "Jailed";
      result.turn_loss = 2;
      this.state.turn = Math.min(this.state.turn + 2, this.state.maxTurns);
      this.addReputation(REP_JAILED);
    } else {
      result.outcome = "Hospitalized";
      result.turn_loss = 1;
      this.state.turn = Math.min(this.state.turn + 1, this.state.maxTurns);
      this.addReputation(REP_HOSPITALIZED);
    }

    // Teleport to random location
    this.state.nextLocation = this.rng.int(1, 6);
  }

  // === traveling.cairo::on_fight ===
  private onFight(encounter: EncounterState, result: any, isWarrior: boolean) {
    let encounterHealth = encounter.health;

    // Initiative: speed race determines who attacks first
    const playerGoesFirst = this.rng.int(0, this.getPlayerSpeed()) >= this.rng.int(0, encounter.speed);

    const maxCombatRounds = 10;
    for (let round = 0; round < maxCombatRounds; round++) {
      result.rounds = round + 1;

      if (playerGoesFirst || round > 0) {
        // Player attacks encounter
        const hustlerAttack = this.plusOrLessRandomPct(this.getPlayerAttack(), 20);
        const shield = Math.floor((hustlerAttack * encounter.defense) / 100);
        const netDmg = Math.max(1, hustlerAttack - shield);
        // Encounter takes reduced damage: /3 per traveling.cairo
        const actualDmg = Math.max(1, Math.floor(netDmg / 3));
        encounterHealth -= actualDmg;

        result.dmg_dealt.push([{ value: actualDmg }, { value: shield }]);

        if (encounterHealth <= 0) {
          result.outcome = "Victorious";
          result.cash_earnt = encounter.payout;
          this.state.cash += encounter.payout;
          const repGain = encounter.level * REP_FIGHT_MULTIPLIER * (isWarrior ? 2 : 1);
          this.addReputation(repGain);
          return;
        }
      }

      // Encounter attacks player
      const encounterAttack = this.plusOrLessRandomPct(encounter.attack, 20);
      const playerShield = Math.floor((encounterAttack * this.getPlayerDefense()) / 100);
      const playerDmg = Math.max(1, encounterAttack - playerShield);
      this.state.health -= playerDmg;

      result.dmg_taken.push([{ value: encounterAttack }, { value: playerShield }]);

      if (this.state.health <= 0) {
        this.state.health = 0;
        result.outcome = "Died";
        return;
      }
    }

    // Survived max rounds
    const repGain = encounter.level * REP_RUN_MULTIPLIER * (isWarrior ? 2 : 1);
    this.addReputation(repGain);
    result.outcome = "Escaped";
  }

  // === traveling.cairo::plus_or_less_random_pct ===
  // Returns value ± random variance within pct%
  // result = value * (1 - pct/100) + random(0, value * pct * 2 / 100)
  private plusOrLessRandomPct(value: number, pct: number): number {
    const maxVariance = Math.floor((value * pct * 2) / 100);
    const variance = this.rng.int(0, maxVariance);
    return Math.max(1, value - Math.floor((value * pct) / 100) + variance);
  }

  // Player stats from item tier config
  private getPlayerAttack(): number {
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

  // player.cairo::level_up_drug
  private updateDrugLevel() {
    const newLevel = Math.min(MAX_DRUG_LEVEL, Math.floor(this.state.reputation / REP_DRUG_STEP));
    this.state.drugLevel = newLevel;
  }

  // === markets_packed.cairo::market_variations ===
  // Distribution: 40% ±1, 30% ±2, 24% ±4, 4.6% ±6, 1.3% ±12
  private varyMarkets() {
    for (let loc = 0; loc < 6; loc++) {
      for (let drug = 0; drug < DRUGS_PER_LOCATION; drug++) {
        const roll = this.rng.int(1, 1000);
        let magnitude: number;

        if (roll <= 200 || roll >= 800) {
          magnitude = 1;
        } else if (roll <= 350 || roll >= 650) {
          magnitude = 2;
        } else if (roll <= 470 || roll >= 530) {
          magnitude = 4;
        } else if (roll <= 493 || roll >= 507) {
          magnitude = 6;
        } else {
          magnitude = 12;
          this.addEvent("HighVolatility", {
            game_id: this.state.gameId,
            player_id: this.state.playerId,
            turn: this.state.turn,
            location_id: loc + 1,
            drug_id: drug,
            increase: roll > 500,
          });
        }

        // Direction: > 500 = increase, else decrease
        const delta = roll > 500 ? magnitude : -magnitude;
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
