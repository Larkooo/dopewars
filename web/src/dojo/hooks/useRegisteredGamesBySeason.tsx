import {
  Dopewars_Game as Game,
} from "@/generated/graphql";
import { useMemo } from "react";
import { useSql } from "./useSql";
import { shortString } from "starknet";
import { DW_NS } from "../constants";

interface RegisteredGamesBySeasonInterface {
  registeredGames: Game[];
  isFetched: boolean;
  isFetching: boolean;
  refetch: any;
}

const sqlQuery = (season_version: string) => `SELECT season_version,
game_id,
player_id,
"player_name.value",
final_score,
registered,
multiplier,
hustler_token_id,
reward
FROM "${DW_NS}-Game"
where season_version = ${season_version} and registered = true
ORDER BY final_score DESC
LIMIT 1000;`;

export const useRegisteredGamesBySeason = (version: number): RegisteredGamesBySeasonInterface => {
  const { data, isFetched, isFetching, refetch } = useSql(sqlQuery((version || 0).toString()));

  const registeredGames = useMemo(() => {
    const games = (data || []).map((i: any) => {
      return {
        ...i,
        player_name: i["player_name.value"]
          ? shortString.decodeShortString(BigInt(i["player_name.value"]).toString())
          : "Anonymous",
        hustler_token_id: Number(i.hustler_token_id || 0),
      };
    });

    return games.sort((a: Game, b: Game) => b.final_score - a.final_score);
  }, [data]);

  return {
    registeredGames,
    isFetched,
    isFetching,
    refetch,
  };
};
