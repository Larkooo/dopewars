// Offline Game class - MobX observable wrapper matching GameClass interface
import { Car } from "@/components/icons";
import { Kevlar, Knife, Shoes } from "@/components/icons/items";
import { drugIcons, drugIconsKeys, locationIcons, locationIconsKeys, dopeLootSlotIdToItemSlot } from "@/dojo/helpers";
import { ItemSlot, PlayerStatus, TradeAction, TradeDirection } from "@/dojo/types";
import { ItemInfos } from "@/dojo/class/Items";
import {
  DrugMarket,
  MarketsByLocation,
  PendingCall,
  PendingCallWithCost,
  WantedByLocation,
  isShopAction,
  isTradeAction,
} from "@/dojo/class/Game";
import { DrugConfigFull, GearItemFull, LocationConfigFull } from "@/dojo/stores/config";
import { action, computed, makeObservable, observable } from "mobx";
import { EngineState } from "./engine";
import {
  DEFAULT_GEAR_NAMES,
  DEFAULT_ITEM_TIERS,
  DEFAULT_ITEM_TIER_MAP,
  DRUG_CONFIGS,
  DRUGS_PER_LOCATION,
  GEAR_SLOT_TO_ITEM_SLOT,
  ITEM_SLOT_TO_GEAR_SLOT,
  LOCATIONS,
  MAX_ITEM_LEVEL,
  MAX_WANTED_SHOPPING,
} from "./config";
import { GearItem } from "@/dope/helpers";
import { DojoEvent } from "@/dojo/class/Events";

// ========== OfflineConfigStore ==========
// Minimal config store that provides same interface as ConfigStoreClass

export class OfflineConfigStore {
  config: any;
  isLoading = false;
  isInitialized = true;

  constructor() {
    this.config = {
      ryo: {
        paper_fee: 0,
        season_version: 1,
        season_duration: 0,
        season_time_limit: 0,
        paper_reward_launderer: 0,
        treasury_fee_pct: 0,
        treasury_balance: 0,
        initialized: true,
        paused: false,
      },
      ryoAddress: { paper: "0x0", laundromat: "0x0" },
      drug: this.buildDrugConfigs(),
      location: this.buildLocationConfigs(),
      encounterStats: [],
      config: {
        layouts: { game_store: [], player: [] },
        ryo_config: {},
        season_settings_modes: {},
      },
      componentValues: [],
      dopewarsItemsTiers: this.buildItemTiers(),
      dopewarsItemsTierConfigs: DEFAULT_ITEM_TIERS,
    };

    makeObservable(this, {
      config: observable,
      isLoading: observable,
    });
  }

  private buildDrugConfigs(): DrugConfigFull[] {
    const result: DrugConfigFull[] = [];
    for (const [mode, drugs] of Object.entries(DRUG_CONFIGS)) {
      for (const drug of drugs) {
        result.push({
          drugs_mode: mode,
          drug_id: drug.drug_id,
          drug: drug.drug,
          base: drug.base,
          step: drug.step,
          weight: drug.weight,
          icon: drugIcons[drug.drug as drugIconsKeys],
          name: drug.drug,
          location_id: 0,
          location: "",
        } as any);
      }
    }
    return result;
  }

  private buildLocationConfigs(): LocationConfigFull[] {
    return LOCATIONS.map((loc) => ({
      location_id: loc.location_id,
      location: loc.location,
      name: loc.location,
      icon: locationIcons[loc.location as locationIconsKeys],
    })) as LocationConfigFull[];
  }

  private buildItemTiers() {
    const tiers: any[] = [];
    for (const [slotStr, items] of Object.entries(DEFAULT_ITEM_TIER_MAP)) {
      const slot = Number(slotStr);
      for (const [itemStr, tier] of Object.entries(items)) {
        tiers.push({ slot_id: slot, item_id: Number(itemStr), tier });
      }
    }
    return tiers;
  }

  async init() {
    // No-op for offline
  }

  getDrug(drugs_mode: string, drug: string): DrugConfigFull {
    return this.config.drug.find(
      (i: any) => i.drugs_mode === drugs_mode && i.drug.toLowerCase() === drug.toLowerCase(),
    )!;
  }

  getDrugById(drugs_mode: string, drug_id: number): DrugConfigFull {
    return this.config.drug.find((i: any) => i.drugs_mode === drugs_mode && Number(i.drug_id) === Number(drug_id))!;
  }

  getLocation(location: string): LocationConfigFull {
    return this.config.location.find((i: any) => i.location.toLowerCase() === location.toLowerCase())!;
  }

  getLocationById(location_id: number): LocationConfigFull {
    if (location_id === 0) {
      return { location_id: 0, location: "Home", name: "Home", icon: locationIcons.Queens } as LocationConfigFull;
    }
    return this.config.location.find((i: any) => Number(i.location_id) === Number(location_id))!;
  }

  getGameStoreLayoutItem(_name: string) {
    return { name: _name, bits: 0n, idx: 0n };
  }

  getPlayerLayoutItem(_name: string) {
    return { name: _name, bits: 0n, idx: 0n };
  }

  getGearItemFull(gearItem: GearItem): GearItemFull {
    const tier = this.getGearItemTier(gearItem)?.tier || 1;
    const tierConfig = DEFAULT_ITEM_TIERS.find((i) => i.slot === gearItem.slot && i.tier === tier);
    const name = DEFAULT_GEAR_NAMES[gearItem.slot]?.[gearItem.item] || "Unknown";

    return {
      gearItem,
      name,
      tier,
      levels: tierConfig?.levels || [
        { cost: 0, stat: 5 },
        { cost: 400, stat: 15 },
        { cost: 1200, stat: 30 },
        { cost: 3600, stat: 50 },
      ],
    };
  }

  getGearItemTier(gearItem: GearItem) {
    const tier = DEFAULT_ITEM_TIER_MAP[gearItem.slot]?.[gearItem.item] || 1;
    return { slot_id: gearItem.slot, item_id: gearItem.item, tier };
  }
}

// ========== OfflineGameClass ==========
// Drop-in replacement for GameClass with same MobX observable interface

export class OfflineGameClass {
  configStore: OfflineConfigStore;
  gameInfos: any;
  gameConfig: any;
  seasonSettings: any;

  player: OfflinePlayerClass;
  markets: OfflineMarketsClass;
  drugs: OfflineDrugsClass;
  items: OfflineItemsClass;
  wanted: OfflineWantedClass;

  pending: PendingCallWithCost[];

  constructor(configStore: OfflineConfigStore, state: EngineState) {
    this.configStore = configStore;

    this.gameInfos = {
      game_id: state.gameId,
      player_id: state.playerId,
      game_mode: state.gameMode === 0 ? "Ranked" : state.gameMode === 1 ? "Noob" : "Warrior",
      player_name: state.playerName,
      final_score: state.finalScore,
      registered: false,
      token_id: 0,
      token_id_type: "GuestLoot",
      season_version: 1,
      equipment_by_slot: state.equipmentBySlot,
    };

    this.gameConfig = {
      max_turns: state.maxTurns,
      max_wanted_shopping: MAX_WANTED_SHOPPING,
      rep_drug_step: 20,
      rep_buy_item: 3,
      rep_carry_drugs: 2,
    };

    this.seasonSettings = {
      cash_mode: state.settings.cashMode,
      health_mode: state.settings.healthMode,
      turns_mode: state.settings.turnsMode,
      encounters_mode: state.settings.encountersMode,
      encounters_odds_mode: state.settings.encountersOddsMode,
      drugs_mode: state.settings.drugsMode,
      wanted_mode: state.settings.wantedMode,
    };

    this.player = new OfflinePlayerClass(this, state);
    this.markets = new OfflineMarketsClass(this, state);
    this.drugs = new OfflineDrugsClass(this, state);
    this.items = new OfflineItemsClass(this, state);
    this.wanted = new OfflineWantedClass(this, state);
    this.pending = [];

    makeObservable(this, {
      pending: observable,
      player: observable,
      isShopOpen: computed,
      shopCount: computed,
    });
  }

  clearPendingCalls() {
    this.pending = [];
  }

  pushCall(call: PendingCallWithCost) {
    this.pending.push(call);
  }

  getPendingCalls(): Array<PendingCall> {
    return this.pending.map((i: PendingCallWithCost) => {
      const { cost: _, ...withoutCost } = i;
      return withoutCost;
    });
  }

  get isShopOpen() {
    const wanted = this.player.wanted;
    const maxWantedShopping = this.gameConfig.max_wanted_shopping;
    return wanted < maxWantedShopping && this.shopCount < 1;
  }

  get shopCount() {
    return this.pending.filter(isShopAction).length;
  }
}

// ========== OfflinePlayerClass ==========

export class OfflinePlayerClass {
  game: OfflineGameClass;
  private _cash: number;
  private _reputation: number;
  health: number;
  turn: number;
  status: number;
  prevLocation: LocationConfigFull;
  location: LocationConfigFull;
  nextLocation: LocationConfigFull;
  drugLevel: number;

  constructor(game: OfflineGameClass, state: EngineState) {
    this.game = game;
    this._cash = state.cash;
    this.health = state.health;
    this.turn = state.turn;
    this.status = state.status;
    this.drugLevel = state.drugLevel;
    this._reputation = state.reputation;

    this.prevLocation = game.configStore.getLocationById(state.prevLocation);
    this.location = game.configStore.getLocationById(state.location);
    this.nextLocation = game.configStore.getLocationById(state.nextLocation);

    makeObservable(this, {
      cash: computed,
      game: observable,
      location: observable,
      wanted: computed,
      reputation: computed,
    });
  }

  get cash() {
    if (!this.game?.pending || this.game.pending.length === 0) return this._cash;
    return this.game.pending.reduce((acc, i) => {
      if (isTradeAction(i)) {
        return acc + (i.direction === TradeDirection.Buy ? -i.cost : i.cost);
      } else if (isShopAction(i)) {
        return acc - i.cost;
      }
      return acc;
    }, this._cash);
  }

  get wanted() {
    if (!this.location || this.location.location_id === 0) return 0;
    if (this.status === 0) {
      return this.game.wanted.getWantedTick(this.location.location_id);
    } else {
      return this.game.wanted.getWantedTick(this.nextLocation.location_id);
    }
  }

  get reputation() {
    if (!this.game?.pending || this.game.pending.length === 0) return this._reputation;
    const hasShop = this.game.pending.find((i) => isShopAction(i));
    if (!hasShop) return this._reputation;
    return Math.min(this._reputation + 3, 100);
  }

  canBuy() {
    return true;
  }

  canSell() {
    return true;
  }
}

// ========== OfflineMarketsClass ==========

export class OfflineMarketsClass {
  game: OfflineGameClass;
  marketsByLocation: MarketsByLocation = new Map();

  constructor(game: OfflineGameClass, state: EngineState) {
    this.game = game;
    const drugLevel = state.drugLevel;
    const drugsMode = state.settings.drugsMode;

    for (let locationId = 1; locationId <= 6; locationId++) {
      const location = game.configStore.getLocationById(locationId);
      if (!location) continue;

      const locIdx = locationId - 1;
      const drugs: DrugMarket[] = [];

      for (let drugIdx = 0; drugIdx < DRUGS_PER_LOCATION; drugIdx++) {
        const drugId = drugIdx + drugLevel;
        const drugConfig = game.configStore.getDrugById(drugsMode, drugId);
        if (!drugConfig) continue;

        const tick = state.marketTicks[locIdx]?.[drugIdx] || 0;
        const price = tick * Number(drugConfig.step) + Number(drugConfig.base);

        drugs.push({
          drug: drugConfig.drug,
          drugId: drugConfig.drug_id,
          price,
          weight: Number(drugConfig.weight),
        });
      }

      this.marketsByLocation.set(location.location, drugs);
    }
  }

  getDrugPrice(locationId: number, drugId: number): number {
    const drugsMode = this.game.seasonSettings.drugs_mode;
    const drugConfig = this.game.configStore.getDrugById(drugsMode, drugId);
    if (!drugConfig) return 0;

    const locIdx = locationId - 1;
    const drugIdx = drugId - (this.game.player?.drugLevel || 0);
    const tick = (this.game as any)._state?.marketTicks?.[locIdx]?.[drugIdx] || 0;
    return tick * Number(drugConfig.step) + Number(drugConfig.base);
  }

  getTick(_locationId: number, _drugId: number): number {
    return 0;
  }
}

// ========== OfflineDrugsClass ==========

export class OfflineDrugsClass {
  game: OfflineGameClass;
  private _drug: DrugConfigFull | undefined;
  private _quantity: number;

  constructor(game: OfflineGameClass, state: EngineState) {
    this.game = game;
    this._quantity = state.drugQuantity;
    this._drug =
      state.drugQuantity > 0 ? game.configStore.getDrugById(state.settings.drugsMode, state.drugId) : undefined;
  }

  get drug() {
    if (!this.game?.pending || this.game.pending.length === 0) return this._drug;
    const { drug } = this.simulateTrades();
    return drug;
  }

  get quantity() {
    if (!this.game?.pending || this.game.pending.length === 0) return this._quantity;
    const { quantity } = this.simulateTrades();
    return quantity;
  }

  private simulateTrades() {
    let drug = this._drug;
    let quantity = this._quantity;

    if (!this.game?.pending || this.game.pending.length === 0) return { drug, quantity };
    const trades = this.game.pending.filter(isTradeAction) as (TradeAction & { cost: number })[];

    for (const trade of trades) {
      if (trade.direction === TradeDirection.Buy) {
        if (!drug || drug.drug_id === trade.drug) {
          drug = this.game.configStore.getDrugById(this.game.seasonSettings.drugs_mode, trade.drug);
          quantity += trade.quantity;
        }
      }
      if (trade.direction === TradeDirection.Sell) {
        if (drug && drug.drug_id === trade.drug) {
          quantity -= trade.quantity;
          if (quantity === 0) drug = undefined;
        }
      }
    }
    return { drug, quantity };
  }
}

// ========== OfflineItemsClass ==========

export class OfflineItemsClass {
  game: OfflineGameClass;
  bitsSize = 2n;
  maxLevel = 3;
  attackLevelInit: number;
  defenseLevelInit: number;
  speedLevelInit: number;
  transportLevelInit: number;
  levelByItemSlot: number[];
  gearItems: GearItem[];

  constructor(game: OfflineGameClass, state: EngineState) {
    this.game = game;

    this.attackLevelInit = state.weaponLevel;
    this.defenseLevelInit = state.clothesLevel;
    this.speedLevelInit = state.feetLevel;
    this.transportLevelInit = state.transportLevel;
    this.levelByItemSlot = [state.weaponLevel, state.clothesLevel, state.feetLevel, state.transportLevel];

    // Build gear items from equipment slots
    const slotMapping = [0, 1, 5, 2]; // Weapon, Clothes, Feet, Transport slot IDs
    this.gearItems = state.equipmentBySlot.map((itemId, idx) => ({
      item: itemId,
      slot: slotMapping[idx],
      name_prefix: 0,
      name_suffix: 0,
      suffix: 0,
      augmentation: 0,
    }));

    makeObservable(this, {
      attackLevel: computed,
      defenseLevel: computed,
      speedLevel: computed,
      transportLevel: computed,
      attack: computed,
      defense: computed,
      speed: computed,
      transport: computed,
      game: observable,
    });
  }

  private getLevelWithPending(initLevel: number, slot: ItemSlot): number {
    let level = initLevel;
    if (this.game?.pending?.length > 0) {
      level += this.game.pending.filter(isShopAction).filter((i) => (i as any).slot === slot).length;
    }
    return level;
  }

  get attackLevel() {
    return this.getLevelWithPending(this.attackLevelInit, ItemSlot.Weapon);
  }
  get defenseLevel() {
    return this.getLevelWithPending(this.defenseLevelInit, ItemSlot.Clothes);
  }
  get speedLevel() {
    return this.getLevelWithPending(this.speedLevelInit, ItemSlot.Feet);
  }
  get transportLevel() {
    return this.getLevelWithPending(this.transportLevelInit, ItemSlot.Transport);
  }

  private getItemInfos(level: number, slotIdx: number, icon: React.FC): ItemInfos {
    const gearItem = this.gearItems[slotIdx];
    const itemFull = this.game.configStore.getGearItemFull(gearItem);
    return {
      icon,
      level,
      slot: GEAR_SLOT_TO_ITEM_SLOT[gearItem.slot] as ItemSlot,
      stat: itemFull.levels[level]?.stat || 0,
      cost: itemFull.levels[level]?.cost || 0,
      name: itemFull.name,
      tier: itemFull.tier,
      id: gearItem.item,
    };
  }

  get attack() {
    return this.getItemInfos(this.attackLevel, 0, Knife);
  }
  get defense() {
    return this.getItemInfos(this.defenseLevel, 1, Kevlar);
  }
  get speed() {
    return this.getItemInfos(this.speedLevel, 2, Shoes);
  }
  get transport() {
    return this.getItemInfos(this.transportLevel, 3, Car);
  }
}

// ========== OfflineWantedClass ==========

export class OfflineWantedClass {
  game: OfflineGameClass;
  wantedByLocation: WantedByLocation = new Map();
  private _wantedLevels: number[];

  constructor(game: OfflineGameClass, state: EngineState) {
    this.game = game;
    this._wantedLevels = [...state.wantedLevels];

    for (let locationId = 1; locationId <= 6; locationId++) {
      const location = game.configStore.getLocationById(locationId);
      if (!location) continue;

      const tick = state.wantedLevels[locationId - 1] || 0;
      const value = this.getValueByTick(tick);
      this.wantedByLocation.set(location.location, value);
    }
  }

  getWantedTick(locationId: number): number {
    if (locationId < 1 || locationId > 6) return 0;
    return this._wantedLevels[locationId - 1] || 0;
  }

  getValueByTick(tick: number): number {
    const totalValues = 8; // 2^3
    const step = 100 / (totalValues - 1);
    return Math.floor(tick * step);
  }
}

// ========== OfflineEventClass ==========

export class OfflineEventClass {
  events: DojoEvent[];

  constructor(events: DojoEvent[]) {
    this.events = [...events];

    makeObservable(this, {
      events: observable,
      addEvent: action,
      sortedEvents: computed,
      isGameOver: computed,
      lastEncounter: computed,
      lastEncounterResult: computed,
    });
  }

  addEvent(event: DojoEvent) {
    this.events.push(event);
  }

  get sortedEvents() {
    return this.events.slice().sort((a, b) => b.idx - a.idx);
  }

  get isGameOver() {
    return this.events.some((i) => i.eventName === "GameOver");
  }

  get lastEncounter() {
    return this.sortedEvents.findLast((i) => i.eventName === "TravelEncounter");
  }

  get lastEncounterResult() {
    return this.sortedEvents.findLast((i) => i.eventName === "TravelEncounterResult");
  }
}
