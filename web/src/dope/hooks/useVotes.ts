import { useState } from "react";

export const useVotes = (_contractAddress: string, _account?: any) => {
  const [isLoading] = useState(false);
  const [votingPower] = useState(0n);
  const [delegates] = useState("");

  const delegateTo = async (_address: string) => {
    // Not available in offline mode
  };

  return { isLoading, votingPower, delegateTo, delegates };
};
