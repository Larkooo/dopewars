import { Drugs } from "../types";
import { TradeDrug, TravelEncounter, TravelEncounterResult } from "@/components/layout/GlobalEvents";

export type PlayerStats = {
  totalGamesPlayed: number;
  totalGamesPaid: number;
  payRate: string;
  totalPaperClaimed: number;
  bestRanking: string;

  totalCopsEncounter: number;
  totalGangEncounter: number;
  totalFight: number;
  totalRun: number;
  totalPay: number;
  tradedDrugs: {
    [Drugs.Ludes]: number;
    [Drugs.Speed]: number;
    [Drugs.Weed]: number;
    [Drugs.Shrooms]: number;
    [Drugs.Acid]: number;
    [Drugs.Ketamine]: number;
    [Drugs.Heroin]: number;
    [Drugs.Cocaine]: number;
  };
  averageReputation: number;
};

export interface GamesByPlayerInterface {
  isFetched: boolean;
  games: any[];
  onGoingGames: any[];
  endedGames: any[];
  playerStats?: PlayerStats;
}

export interface PlayerGameInfosInterface {
  allTradedDrug: TradeDrug[];
  allTravelEncounters: TravelEncounter[];
  allTravelEncounterResults: TravelEncounterResult[];
}

export const usePlayerGameInfos = (_toriiClient: any, _playerId?: string): PlayerGameInfosInterface => {
  return {
    allTradedDrug: [],
    allTravelEncounters: [],
    allTravelEncounterResults: [],
  };
};

export const useGamesByPlayer = (_toriiClient: any, _playerIdRaw?: string): GamesByPlayerInterface => {
  // Not available in offline mode - no blockchain game history
  return {
    games: [],
    onGoingGames: [],
    endedGames: [],
    playerStats: undefined,
    isFetched: true,
  };
};
