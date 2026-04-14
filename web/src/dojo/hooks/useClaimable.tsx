import { Dopewars_Game as Game } from "@/generated/graphql";
import { useEffect, useMemo } from "react";
import { useDojoContext } from "./useDojoContext";
import { useSql } from "./useSql";
import { addAddressPadding, shortString } from "starknet";
import { DW_NS } from "../constants";

type ClaimableResult = ReturnType<typeof useClaimable>;

// v2: no claimable/claimed/position — reward is minted on register_score
const sqlQuery = (playerId: string) => `SELECT season_version,
game_id,
player_id,
"player_name.value",
final_score,
registered,
multiplier,
hustler_token_id,
reward
FROM "${DW_NS}-Game"
WHERE player_id = "${addAddressPadding(playerId)}" AND registered = true AND reward > 0
ORDER BY final_score DESC
LIMIT 1000;`;

export const useClaimable = (playerId: string) => {
  const {
    chains: { selectedChain },
  } = useDojoContext();

  const query = useMemo(() => {
    return sqlQuery(playerId);
  }, [playerId]);
  const { data, isFetched, isFetching, refetch } = useSql(query);

  useEffect(() => {
    if (Number(playerId) > 0) {
      refetch();
    }
  }, [selectedChain.toriiUrl]);

  const claimable = useMemo(() => {
    if (isFetching || !data) return [];

    return (data || []).map((i: any) => {
      return {
        ...i,
        player_name: i["player_name.value"]
          ? shortString.decodeShortString(BigInt(i["player_name.value"]).toString())
          : "Anonymous",
        hustler_token_id: Number(i.hustler_token_id || 0),
      };
    });
  }, [data, isFetching]);

  return {
    claimable,
    isFetching,
    refetch,
  };
};
