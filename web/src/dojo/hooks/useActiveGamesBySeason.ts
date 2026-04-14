import { Dopewars_Game as Game } from "@/generated/graphql";
import { useMemo } from "react";
import { useSql } from "./useSql";
import { shortString } from "starknet";
import { DW_NS } from "../constants";
import { useDojoContext } from "./useDojoContext";
import Bits from "../class/utils/Bits";

interface ActiveGamesBySeasonInterface {
  activeGames: Game[];
  isFetched: boolean;
  isFetching: boolean;
  refetch: () => Promise<void>;
}

const sqlQuery = (season_version: string) => `SELECT g.season_version,
g.game_id,
g.player_id,
g."player_name.value",
g.final_score,
g.registered,
g.game_over,
g.multiplier,
g.hustler_token_id,
g.reward,
gsp.packed
FROM "${DW_NS}-Game" g
LEFT JOIN "${DW_NS}-GameStorePacked" gsp ON g.game_id = gsp.game_id
WHERE g.season_version = ${season_version} AND g.game_over = false
ORDER BY g.final_score DESC
LIMIT 100;`;

export const useActiveGamesBySeason = (version: number): ActiveGamesBySeasonInterface => {
  const { data, isFetched, isFetching, refetch } = useSql(sqlQuery((version || 0).toString()));
  const { configStore } = useDojoContext();

  const activeGames = useMemo(() => {
    const cashLayout = configStore?.getPlayerLayoutItem?.("Cash");
    const playerLayout = configStore?.getGameStoreLayoutItem?.("Player");

    const games = (data || []).map((i: any) => {
      let currentCash = 0;

      if (i.packed && cashLayout && playerLayout) {
        try {
          const packed = BigInt(i.packed);
          const playerPacked = Bits.extract(packed, playerLayout.idx, playerLayout.bits);
          currentCash = Number(Bits.extract(playerPacked, cashLayout.idx, cashLayout.bits));
        } catch (e) {
          console.error("Failed to extract cash from packed data:", e);
        }
      }

      return {
        ...i,
        player_name: i["player_name.value"]
          ? shortString.decodeShortString(BigInt(i["player_name.value"]).toString())
          : "Anonymous",
        hustler_token_id: Number(i.hustler_token_id || 0),
        final_score: currentCash || i.final_score,
      };
    });

    return games.sort((a: Game, b: Game) => b.final_score - a.final_score);
  }, [data, configStore]);

  return {
    activeGames,
    isFetched,
    isFetching,
    refetch,
  };
};
