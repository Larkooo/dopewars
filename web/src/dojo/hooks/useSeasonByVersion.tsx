import {
  Dopewars_Season as Season,
  Dopewars_SeasonEdge as SeasonEdge,
  Dopewars_SeasonSettings as SeasonSettings,
  Dopewars_SeasonSettingsEdge as SeasonSettingsEdge,
  useSeasonByVersionQuery,
} from "@/generated/graphql";
import { useEffect, useMemo, useState } from "react";
import { DW_GRAPHQL_MODEL_NS } from "../constants";

export interface SeasonByVersionInterface {
  season?: Season;
  seasonSettings?: SeasonSettings;
  isSeasonOpen: boolean;
  isSeasonWashed: boolean;
  canCreateGame: boolean;
  isFetched: boolean;
  refetch: any;
}

export const useSeasonByVersion = (seasonId: number): SeasonByVersionInterface => {
  const [timestamp, setTimestamp] = useState(Date.now());

  const { data, isFetched, refetch } = useSeasonByVersionQuery({
    version: seasonId || 0,
  });

  const season = useMemo(() => {
    const edges = data?.[`${DW_GRAPHQL_MODEL_NS}SeasonModels`]?.edges as SeasonEdge[];
    return edges?.length > 0 ? (edges[0].node as Season) : undefined;
  }, [data]);

  const seasonSettings = useMemo(() => {
    const edges = data?.[`${DW_GRAPHQL_MODEL_NS}SeasonSettingsModels`]?.edges as SeasonSettingsEdge[];
    return edges?.length > 0 ? (edges[0].node as SeasonSettings) : undefined;
  }, [data]);

  const isSeasonOpen = useMemo(() => {
    return timestamp < season?.next_version_timestamp * 1000;
  }, [season, timestamp]);

  const canCreateGame = useMemo(() => {
    return timestamp < (season?.next_version_timestamp - season?.season_time_limit) * 1000;
  }, [season, timestamp]);

  // v2: no laundromat, seasons are always "washed"
  const isSeasonWashed = true;

  useEffect(() => {
    const handle = setInterval(() => {
      setTimestamp(Date.now());
    }, 5_000);

    return () => clearInterval(handle);
  }, []);

  return {
    season,
    seasonSettings,
    isSeasonOpen,
    isSeasonWashed,
    canCreateGame,
    isFetched,
    refetch,
  };
};
