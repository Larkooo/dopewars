// Hardcoded game configuration for offline mode
// Ported 1:1 from Cairo contracts

import { ItemSlot } from "@/dojo/types";

// Drug config per DrugsMode - exact values from src/config/drugs.cairo
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
    { drug_id: 0, drug: "Ludes", base: 18, step: 1, weight: 5 },
    { drug_id: 1, drug: "Speed", base: 85, step: 6, weight: 10 },
    { drug_id: 2, drug: "Weed", base: 290, step: 18, weight: 15 },
    { drug_id: 3, drug: "Shrooms", base: 980, step: 54, weight: 25 },
    { drug_id: 4, drug: "Acid", base: 2900, step: 111, weight: 30 },
    { drug_id: 5, drug: "Ketamine", base: 6800, step: 186, weight: 45 },
    { drug_id: 6, drug: "Heroin", base: 13500, step: 231, weight: 65 },
    { drug_id: 7, drug: "Cocaine", base: 19800, step: 284, weight: 100 },
  ],
  Expensive: [
    { drug_id: 0, drug: "Ludes", base: 25, step: 1, weight: 12 },
    { drug_id: 1, drug: "Speed", base: 76, step: 3, weight: 17 },
    { drug_id: 2, drug: "Weed", base: 218, step: 10, weight: 23 },
    { drug_id: 3, drug: "Shrooms", base: 796, step: 28, weight: 31 },
    { drug_id: 4, drug: "Acid", base: 1989, step: 56, weight: 41 },
    { drug_id: 5, drug: "Ketamine", base: 4467, step: 109, weight: 58 },
    { drug_id: 6, drug: "Heroin", base: 7934, step: 186, weight: 76 },
    { drug_id: 7, drug: "Cocaine", base: 17220, step: 333, weight: 100 },
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

// Encounter stats - exact base/step per mode from src/config/encounters.cairo
// Formula: stat = base + level * step
export interface EncounterStatsTemplate {
  encounter: string;
  health_base: number;
  health_step: number;
  attack_base: number;
  attack_step: number;
  defense_base: number;
  defense_step: number;
  speed_base: number;
  speed_step: number;
}

export const ENCOUNTER_TEMPLATES: Record<string, EncounterStatsTemplate[]> = {
  Chill: [
    {
      encounter: "Cops",
      health_base: 10,
      health_step: 6,
      attack_base: 12,
      attack_step: 6,
      defense_base: 14,
      defense_step: 7,
      speed_base: 4,
      speed_step: 6,
    },
    {
      encounter: "Gang",
      health_base: 1,
      health_step: 9,
      attack_base: 5,
      attack_step: 9,
      defense_base: 7,
      defense_step: 6,
      speed_base: 2,
      speed_step: 6,
    },
  ],
  NoJokes: [
    {
      encounter: "Cops",
      health_base: 12,
      health_step: 8,
      attack_base: 14,
      attack_step: 8,
      defense_base: 16,
      defense_step: 9,
      speed_base: 6,
      speed_step: 8,
    },
    {
      encounter: "Gang",
      health_base: 1,
      health_step: 11,
      attack_base: 5,
      attack_step: 11,
      defense_base: 7,
      defense_step: 8,
      speed_base: 2,
      speed_step: 8,
    },
  ],
  UltraViolence: [
    {
      encounter: "Cops",
      health_base: 14,
      health_step: 10,
      attack_base: 16,
      attack_step: 10,
      defense_base: 18,
      defense_step: 11,
      speed_base: 8,
      speed_step: 10,
    },
    {
      encounter: "Gang",
      health_base: 4,
      health_step: 14,
      attack_base: 8,
      attack_step: 14,
      defense_base: 10,
      defense_step: 11,
      speed_base: 5,
      speed_step: 11,
    },
  ],
};

// Generate encounter stats for a given mode, type, and level
export function getEncounterStats(mode: string, encounterType: string, level: number) {
  const templates = ENCOUNTER_TEMPLATES[mode] || ENCOUNTER_TEMPLATES.NoJokes;
  const tmpl = templates.find((t) => t.encounter === encounterType);
  if (!tmpl) return { health: 20, attack: 20, defense: 20, speed: 10 };
  return {
    health: tmpl.health_base + level * tmpl.health_step,
    attack: tmpl.attack_base + level * tmpl.attack_step,
    defense: tmpl.defense_base + level * tmpl.defense_step,
    speed: tmpl.speed_base + level * tmpl.speed_step,
  };
}

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

// From src/config/settings.cairo
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

// Wanted mode: risk modifier subtracted from wanted_risk percentage
export const WANTED_RISK_MODIFIER: Record<string, number> = {
  KoolAndTheGang: 20,
  ThugLife: 15,
  MostWanted: 10,
};

// Wanted mode: how much wanted increases when traveling back to same location
export const WANTED_TRAVEL_BACK: Record<string, number> = {
  KoolAndTheGang: 2,
  ThugLife: 3,
  MostWanted: 4,
};

// Wanted mode: how much wanted increases when leaving with drugs
export const WANTED_LEAVE_WITH_DRUGS: Record<string, number> = {
  KoolAndTheGang: 5,
  ThugLife: 5,
  MostWanted: 6,
};

// Encounter odds mode: reputation divisor for level calculation
export const ENCOUNTER_ODDS_DIVISOR: Record<string, number> = {
  Easy: 20,
  Normal: 16,
  Hard: 12,
};

// Reputation modifiers per encounter level
export const REP_PAY_MULTIPLIER = 5; // negative: level * 5
export const REP_RUN_MULTIPLIER = 2; // positive on escape, rep_jailed/rep_hospitalized on capture
export const REP_FIGHT_MULTIPLIER = 3; // positive on victory

// Item tier configs
export interface TierLevelConfig {
  cost: number;
  stat: number;
}

export interface ItemTierConfig {
  slot: number;
  tier: number;
  levels: TierLevelConfig[];
}

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

export const DEFAULT_GEAR_NAMES: Record<number, Record<number, string>> = {
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
  1: { 0: "T-Shirt", 1: "Leather Jacket", 2: "Bullet Proof Vest", 3: "Hoodie", 4: "Trench Coat", 5: "Kevlar" },
  2: { 0: "Plastic Bag", 1: "Backpack", 2: "Duffel Bag", 3: "Shopping Cart", 4: "Bicycle", 5: "Motorcycle" },
  5: {
    0: "Sandals",
    1: "All-Black Sneakers",
    2: "Athletic Trainers",
    3: "Work Boots",
    4: "Running Shoes",
    5: "Combat Boots",
  },
};

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

// Constants from src/config/game.cairo
export const MAX_DRUG_LEVEL = 4;
export const REP_DRUG_STEP = 20;
export const DRUGS_PER_LOCATION = 4;
export const MAX_TICK = 63;
export const MAX_WANTED = 7;
export const MAX_WANTED_SHOPPING = 5;
export const MAX_ROUNDS = 3; // max rounds per run encounter
export const REP_BUY_ITEM = 3;
export const REP_CARRY_DRUGS = 2;
export const REP_HOSPITALIZED = 4;
export const REP_JAILED = 6;
export const MAX_REP = 100;
export const MAX_ITEM_LEVEL = 3;

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
