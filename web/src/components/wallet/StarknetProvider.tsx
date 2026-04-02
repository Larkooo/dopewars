import { dojoContextConfig } from "@/dojo/setup/config";
import { ControllerConnector } from "@cartridge/connector";
import {
  ChainProviderFactory,
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  starkscan,
} from "@starknet-react/core";
import { ReactNode, useMemo, useState } from "react";
import { RpcProvider } from "starknet";

export const walletInstallLinks = {
  argentX: "https://www.argent.xyz/argent-x/",
  braavos: "https://braavos.app/download-braavos-wallet/",
};
export type walletInstallLinksKeys = keyof typeof walletInstallLinks;

const selectedChain = Object.values(dojoContextConfig)[0];

function getProvider(): ChainProviderFactory<RpcProvider> {
  return function (_chain) {
    const config = { nodeUrl: selectedChain.rpcUrl || "" };
    const chainId = selectedChain.chainConfig.id || undefined;
    ///@ts-ignore
    return new RpcProvider({ ...config, chainId });
  };
}

function getConnectors() {
  const controller = new ControllerConnector({
    chains: [
      {
        rpcUrl: selectedChain.rpcUrl || "https://api.cartridge.gg/x/starknet/mainnet",
      },
    ],
    defaultChainId: `0x${selectedChain.chainConfig.id.toString(16)}`,
    slot: selectedChain.slot || "ryomainnet3",
    namespace: selectedChain.namespace || "dopewars_v0",
    tokens: {
      erc20: ["strk", "usdc"],
    },
    preset: "dope-wars",
  }) as unknown as InjectedConnector;

  return [controller];
}

export function StarknetProvider({ children }: { children: ReactNode }) {
  const { chains, connectors, provider } = useMemo(() => {
    return {
      chains: [selectedChain.chainConfig],
      provider: getProvider(),
      connectors: getConnectors(),
    };
  }, []);

  const [explorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}
