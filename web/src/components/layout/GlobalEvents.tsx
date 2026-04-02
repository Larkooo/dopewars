import { useGameStore } from "@/dojo/hooks";
import { useToast } from "@/hooks/toast";
import { useEffect } from "react";
import { Siren, Truck } from "../icons";

export const GlobalEvents = () => {
  const { toast } = useToast();
  const gameStore = useGameStore();
  const { game, gameEvents } = gameStore;

  useEffect(() => {
    if (gameEvents?.sortedEvents.length === 0) return;
    if (!game) return;

    const event = gameEvents?.sortedEvents[gameEvents.sortedEvents.length - 1];
    if (event?.eventName === "HighVolatility") {
      const location = game.configStore.getLocationById(event.event.location_id);
      const drug = game.configStore.getDrugById(game.seasonSettings.drugs_mode, event.event.drug_id);
      const msg = event.event.increase
        ? `Pigs seized ${drug!.name} in ${location!.name}`
        : `A shipment of ${drug!.name} has arrived to ${location!.name}`;
      toast({
        message: msg,
        icon: event.event.increase ? Siren : Truck,
        duration: 6000,
      });
    }
  }, [gameEvents?.sortedEvents.length]);

  return null;
};

export interface GameCreated {
  game_id: number;
  player_id: string;
  game_mode: string;
  player_name: string;
  multiplier: number;
  token_id_type: string;
  token_id: bigint;
  hustler_equipment: { slot: string; gear_item_id: any }[];
  hustler_body: { slot: string; value: number }[];
}

export interface Traveled {
  game_id: number;
  player_id: string;
  turn: number;
  from_location_id: number;
  to_location_id: number;
}

export interface NewSeason {
  key: number;
  season_version: number;
}

export interface NewHighScore {
  game_id: number;
  player_id: string;
  season_version: number;
  player_name: string;
  token_id_type: string;
  token_id: bigint;
  cash: number;
  health: number;
  reputation: number;
}

export interface GameOver {
  game_id: number;
  player_id: string;
  season_version: number;
  player_name: string;
  token_id_type: string;
  token_id: bigint;
  turn: number;
  cash: number;
  health: number;
  reputation: number;
}

export interface TravelEncounter {
  game_id: number;
  player_id: string;
  turn: number;
  encounter: string;
  level: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  demand_pct: number;
  payout: number;
}

export interface TravelEncounterResult {
  game_id: number;
  player_id: string;
  turn: number;
  action: any;
  outcome: any;
  rounds: number;
  dmg_dealt: Array<Array<{ value: number }>>;
  dmg_taken: Array<Array<{ value: number }>>;
  cash_earnt: number;
  cash_loss: number;
  drug_id: number;
  drug_loss: number[];
  turn_loss: number;
  rep_pos: number;
  rep_neg: number;
}

export interface TradeDrug {
  game_id: number;
  player_id: string;
  turn: number;
  drug_id: number;
  quantity: number;
  price: number;
  is_buy: boolean;
}
export interface HighVolatility {
  game_id: number;
  player_id: string;
  location_id: number;
  drug_id: number;
  increase: boolean;
}

export interface UpgradeItem {
  game_id: number;
  player_id: string;
  turn: number;
  item_slot: number;
  item_level: number;
}

export interface DopeLootReleasedEvent {
  id: bigint;
  address: string;
}
