import { useCallback } from "react";

export const useFetchData = <TData, TVariables>(_query: string): ((variables?: TVariables) => Promise<TData>) => {
  return useCallback(
    async (_variables?: TVariables) => {
      // No GraphQL endpoint in offline mode
      return {} as TData;
    },
    [_query],
  );
};
