// Stub for offline mode - no seasons
export interface SeasonByVersionInterface {
  season?: any;
  seasonSettings?: any;
  sortedList?: any;
  isSeasonOpen: boolean;
  isSeasonWashed: boolean;
  canCreateGame: boolean;
  isFetched: boolean;
  refetch: () => Promise<void>;
}

export const useSeasonByVersion = (_seasonId?: number): SeasonByVersionInterface => {
  return {
    season: undefined,
    seasonSettings: undefined,
    sortedList: undefined,
    isSeasonOpen: true,
    isSeasonWashed: false,
    canCreateGame: true,
    isFetched: true,
    refetch: async () => {},
  };
};
