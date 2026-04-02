// Hardcoded game configuration for offline mode
// Ported from Cairo contracts

import { ItemSlot } from "@/dojo/types";

// Drug config per DrugsMode
export interface DrugConfig {
  drug_id: number;
  drug: string;
  base: number;
  step: number;
  weight: number;
}

export const DRUG_CONFIGS: Record<string, DrugConfig[]> = {
  Normal: [
    { drug_id: 0, drug: "Ludes", base: 24, step: 2, weight: 10 },
    { drug_id: 1, drug: "Speed", base: 150, step: 8, weight: 14 },
    { drug_id: 2, drug: "Weed", base: 402, step: 16, weight: 19 },
    { drug_id: 3, drug: "Shrooms", base: 906, step: 32, weight: 27 },
    { drug_id: 4, drug: "Acid", base: 1914, step: 64, weight: 37 },
    { drug_id: 5, drug: "Ketamine", base: 3930, step: 128, weight: 52 },
    { drug_id: 6, drug: "Heroin", base: 7962, step: 256, weight: 72 },
    { drug_id: 7, drug: "Cocaine", base: 16026, step: 512, weight: 100 },
  ],
  Cheap: [
    { drug_id: 0, drug: "Ludes", base: 16, step: 1, weight: 8 },
    { drug_id: 1, drug: "Speed", base: 100, step: 5, weight: 11 },
    { drug_id: 2, drug: "Weed", base: 268, step: 11, weight: 15 },
    { drug_id: 3, drug: "Shrooms", base: 604, step: 21, weight: 22 },
    { drug_id: 4, drug: "Acid", base: 1276, step: 43, weight: 30 },
    { drug_id: 5, drug: "Ketamine", base: 2620, step: 85, weight: 42 },
    { drug_id: 6, drug: "Heroin", base: 5308, step: 171, weight: 58 },
    { drug_id: 7, drug: "Cocaine", base: 10684, step: 341, weight: 80 },
  ],
  Expensive: [
    { drug_id: 0, drug: "Ludes", base: 36, step: 3, weight: 13 },
    { drug_id: 1, drug: "Speed", base: 225, step: 12, weight: 18 },
    { drug_id: 2, drug: "Weed", base: 603, step: 24, weight: 25 },
    { drug_id: 3, drug: "Shrooms", base: 1359, step: 48, weight: 35 },
    { drug_id: 4, drug: "Acid", base: 2871, step: 96, weight: 48 },
    { drug_id: 5, drug: "Ketamine", base: 5895, step: 192, weight: 68 },
    { drug_id: 6, drug: "Heroin", base: 11943, step: 384, weight: 94 },
    { drug_id: 7, drug: "Cocaine", base: 24039, step: 768, weight: 130 },
  ],
};

// Location config
export interface LocationConfig {
  location_id: number;
  location: string;
}

export const LOCATIONS: LocationConfig[] = [
  { location_id: 1, location: "Queens" },
  { location_id: 2, location: "Bronx" },
  { location_id: 3, location: "Brooklyn" },
  { location_id: 4, location: "Jersey" },
  { location_id: 5, location: "Central" },
  { location_id: 6, location: "Coney" },
];

// Encounter stats per mode
export interface EncounterStats {
  encounter: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
}

function generateEncounterStats(mode: string): EncounterStats[] {
  const stats: EncounterStats[] = [];
  const mod = mode === "Chill" ? -2 : mode === "UltraViolence" ? 2 : 0;

  for (let level = 1; level <= 6; level++) {
    // Cops
    stats.push({
      encounter: "Cops",
      level,
      health: Math.max(1, 12 + level * 8 + mod),
      attack: Math.max(1, 14 + level * 8 + mod),
      defense: Math.max(1, 16 + level * 9 + mod),
      speed: Math.max(1, 6 + level * 8 + mod),
    });
    // Gang
    stats.push({
      encounter: "Gang",
      level,
      health: Math.max(1, 1 + level * 11 + mod),
      attack: Math.max(1, 5 + level * 11 + mod),
      defense: Math.max(1, 7 + level * 8 + mod),
      speed: Math.max(1, 2 + level * 8 + mod),
    });
  }
  return stats;
}

export const ENCOUNTER_STATS: Record<string, EncounterStats[]> = {
  Chill: generateEncounterStats("Chill"),
  NoJokes: generateEncounterStats("NoJokes"),
  UltraViolence: generateEncounterStats("UltraViolence"),
};

// Game config per season settings
export interface GameSettings {
  cashMode: string;
  healthMode: string;
  turnsMode: string;
  encountersMode: string;
  encountersOddsMode: string;
  drugsMode: string;
  wantedMode: string;
}

export const CASH_VALUES: Record<string, number> = {
  Broke: 420,
  Average: 1000,
  Rich: 2600,
};

export const HEALTH_VALUES: Record<string, number> = {
  Junkie: 70,
  Hustler: 90,
  Streetboss: 110,
};

export const TURNS_VALUES: Record<string, number> = {
  OnSpeed: 15,
  OnWeed: 18,
  OnMush: 21,
};

// Wanted mode risk modifiers (subtract from risk percentage)
export const WANTED_MODE_MODIFIER: Record<string, number> = {
  KoolAndTheGang: 20,
  ThugLife: 15,
  MostWanted: 10,
};

// Encounter odds mode: reputation divisor for level calculation
export const ENCOUNTER_ODDS_DIVISOR: Record<string, number> = {
  Easy: 20,
  Normal: 16,
  Hard: 12,
};

// Item tier configs (slot -> tier -> levels[])
// Each level has { cost, stat }
export interface TierLevelConfig {
  cost: number;
  stat: number;
}

export interface ItemTierConfig {
  slot: number;
  tier: number;
  levels: TierLevelConfig[];
}

// Default gear tiers (4 levels per tier, 3 tiers per slot)
export const DEFAULT_ITEM_TIERS: ItemTierConfig[] = [
  // Weapon (slot 0) - ATK
  {
    slot: 0,
    tier: 1,
    levels: [
      { cost: 0, stat: 5 },
      { cost: 400, stat: 15 },
      { cost: 1200, stat: 30 },
      { cost: 3600, stat: 50 },
    ],
  },
  {
    slot: 0,
    tier: 2,
    levels: [
      { cost: 0, stat: 8 },
      { cost: 500, stat: 20 },
      { cost: 1500, stat: 38 },
      { cost: 4500, stat: 60 },
    ],
  },
  {
    slot: 0,
    tier: 3,
    levels: [
      { cost: 0, stat: 12 },
      { cost: 600, stat: 25 },
      { cost: 1800, stat: 45 },
      { cost: 5400, stat: 70 },
    ],
  },
  // Clothes (slot 1) - DEF
  {
    slot: 1,
    tier: 1,
    levels: [
      { cost: 0, stat: 5 },
      { cost: 400, stat: 15 },
      { cost: 1200, stat: 30 },
      { cost: 3600, stat: 50 },
    ],
  },
  {
    slot: 1,
    tier: 2,
    levels: [
      { cost: 0, stat: 8 },
      { cost: 500, stat: 20 },
      { cost: 1500, stat: 38 },
      { cost: 4500, stat: 60 },
    ],
  },
  {
    slot: 1,
    tier: 3,
    levels: [
      { cost: 0, stat: 12 },
      { cost: 600, stat: 25 },
      { cost: 1800, stat: 45 },
      { cost: 5400, stat: 70 },
    ],
  },
  // Feet (slot 5) - SPD
  {
    slot: 5,
    tier: 1,
    levels: [
      { cost: 0, stat: 5 },
      { cost: 400, stat: 15 },
      { cost: 1200, stat: 30 },
      { cost: 3600, stat: 50 },
    ],
  },
  {
    slot: 5,
    tier: 2,
    levels: [
      { cost: 0, stat: 8 },
      { cost: 500, stat: 20 },
      { cost: 1500, stat: 38 },
      { cost: 4500, stat: 60 },
    ],
  },
  {
    slot: 5,
    tier: 3,
    levels: [
      { cost: 0, stat: 12 },
      { cost: 600, stat: 25 },
      { cost: 1800, stat: 45 },
      { cost: 5400, stat: 70 },
    ],
  },
  // Transport (slot 2) - INV
  {
    slot: 2,
    tier: 1,
    levels: [
      { cost: 0, stat: 100 },
      { cost: 400, stat: 200 },
      { cost: 1200, stat: 350 },
      { cost: 3600, stat: 500 },
    ],
  },
  {
    slot: 2,
    tier: 2,
    levels: [
      { cost: 0, stat: 120 },
      { cost: 500, stat: 250 },
      { cost: 1500, stat: 420 },
      { cost: 4500, stat: 600 },
    ],
  },
  {
    slot: 2,
    tier: 3,
    levels: [
      { cost: 0, stat: 150 },
      { cost: 600, stat: 300 },
      { cost: 1800, stat: 500 },
      { cost: 5400, stat: 700 },
    ],
  },
];

// Default component values (gear item names)
export const DEFAULT_GEAR_NAMES: Record<number, Record<number, string>> = {
  // Weapon (slot 0)
  0: {
    0: "Pocket Knife",
    1: "Chain",
    2: "Knife",
    3: "Crowbar",
    4: "Handgun",
    5: "AK47",
    6: "Shovel",
    7: "Baseball Bat",
    8: "Tire Iron",
    9: "Police Baton",
    10: "Pepper Spray",
    11: "Razor Blade",
    12: "Drone",
    13: "Taser",
    14: "Brass Knuckles",
    15: "Shotgun",
    16: "Glock",
    17: "Uzi",
  },
  // Clothes (slot 1)
  1: {
    0: "T-Shirt",
    1: "Leather Jacket",
    2: "Bullet Proof Vest",
    3: "Hoodie",
    4: "Trench Coat",
    5: "Kevlar",
  },
  // Transport (slot 2)
  2: {
    0: "Plastic Bag",
    1: "Backpack",
    2: "Duffel Bag",
    3: "Shopping Cart",
    4: "Bicycle",
    5: "Motorcycle",
  },
  // Feet (slot 5)
  5: {
    0: "Sandals",
    1: "All-Black Sneakers",
    2: "Athletic Trainers",
    3: "Work Boots",
    4: "Running Shoes",
    5: "Combat Boots",
  },
};

// Default item tier assignments (item -> tier)
export const DEFAULT_ITEM_TIER_MAP: Record<number, Record<number, number>> = {
  0: {
    0: 1,
    1: 1,
    2: 1,
    3: 1,
    4: 2,
    5: 3,
    6: 1,
    7: 1,
    8: 1,
    9: 2,
    10: 1,
    11: 1,
    12: 3,
    13: 2,
    14: 2,
    15: 3,
    16: 2,
    17: 3,
  },
  1: { 0: 1, 1: 2, 2: 3, 3: 1, 4: 2, 5: 3 },
  2: { 0: 1, 1: 1, 2: 2, 3: 2, 4: 3, 5: 3 },
  5: { 0: 1, 1: 1, 2: 2, 3: 2, 4: 3, 5: 3 },
};

// Map ItemSlot enum to DopeLoot slot ids
export const ITEM_SLOT_TO_GEAR_SLOT: Record<number, number> = {
  [ItemSlot.Weapon]: 0,
  [ItemSlot.Clothes]: 1,
  [ItemSlot.Feet]: 5,
  [ItemSlot.Transport]: 2,
};

export const GEAR_SLOT_TO_ITEM_SLOT: Record<number, number> = {
  0: ItemSlot.Weapon,
  1: ItemSlot.Clothes,
  5: ItemSlot.Feet,
  2: ItemSlot.Transport,
};

// Constants
export const MAX_DRUG_LEVEL = 4;
export const REP_DRUG_STEP = 20;
export const DRUGS_PER_LOCATION = 4;
export const MAX_TICK = 63;
export const MAX_WANTED = 7;
export const MAX_WANTED_SHOPPING = 5;
export const REP_BUY_ITEM = 3;
export const MAX_REP = 100;
export const MAX_ITEM_LEVEL = 3;

// Random season settings
export function randomizeSettings(): GameSettings {
  const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  return {
    cashMode: pick(["Broke", "Average", "Rich"]),
    healthMode: pick(["Junkie", "Hustler", "Streetboss"]),
    turnsMode: pick(["OnSpeed", "OnWeed", "OnMush"]),
    encountersMode: pick(["Chill", "NoJokes", "UltraViolence"]),
    encountersOddsMode: pick(["Easy", "Normal", "Hard"]),
    drugsMode: pick(["Cheap", "Normal", "Expensive"]),
    wantedMode: pick(["KoolAndTheGang", "ThugLife", "MostWanted"]),
  };
}
