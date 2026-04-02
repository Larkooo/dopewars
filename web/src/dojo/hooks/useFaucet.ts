import { useState } from "react";

export interface FaucetExecuteResult {
  hash: string;
}

export interface FaucetInterface {
  faucet: () => Promise<FaucetExecuteResult>;
  isPending: boolean;
  error?: string;
}

export const useFaucet = (_tokenAddress?: string): FaucetInterface => {
  const [isPending] = useState(false);

  const faucet = async (): Promise<FaucetExecuteResult> => {
    // Not available in offline mode
    return { hash: "0x0" };
  };

  return {
    faucet,
    isPending,
  };
};
