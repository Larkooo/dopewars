import { useState } from "react";

export const EKUBO_ROUTER_3_0_13 = "0x0";
export const EKUBO_ROUTER_3_0_3 = "0x0";

export const STRK: TokenInfos = { address: "0x0", decimals: 18 };
export const USDC: TokenInfos = { address: "0x0", decimals: 6 };
export const ETH: TokenInfos = { address: "0x0", decimals: 18 };
export const PAPER: TokenInfos = { address: "0x0", decimals: 18 };

export interface TokenInfos {
  address: string;
  decimals: number;
}

export interface SwapQuote {
  isExactOutput: boolean;
  tokenIn: TokenInfos;
  tokenOut: TokenInfos;
  amountIn: number;
  amountOut: number;
  scaledAmountOut: bigint;
  scaledAmountIn: bigint;
  impact: number;
  splits: any[];
}

export const useEkubo = (_opts: any) => {
  const [quote] = useState<SwapQuote | undefined>();
  const [value] = useState<string>("");
  const [swapCalls] = useState<any[] | undefined>();

  const ape = async () => {
    // Not available in offline mode
  };

  const refetch = () => {
    // Not available in offline mode
  };

  return { quote, value, swapCalls, ape, refetch };
};

export const getSwapQuote = async (
  _amount: number,
  _tokenIn: TokenInfos,
  _tokenOut: TokenInfos,
  _isExactOutput: boolean,
): Promise<SwapQuote> => {
  return {
    isExactOutput: false,
    tokenIn: { address: "0x0", decimals: 18 },
    tokenOut: { address: "0x0", decimals: 18 },
    amountIn: 0,
    amountOut: 0,
    scaledAmountIn: 0n,
    scaledAmountOut: 0n,
    impact: 0,
    splits: [],
  };
};

export const generateSwapCalls = (_routerAddress: string, _swapQuote: SwapQuote, _slippage: bigint): any[] => {
  return [];
};

export const getPriceChart = async (_token: string, _otherToken: string) => {
  return { data: [] };
};
