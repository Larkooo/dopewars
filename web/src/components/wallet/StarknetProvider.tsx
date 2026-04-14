import { DW_NS } from "@/dojo/constants";
import { katanaLocalChain } from "@/dojo/setup/chains";
import { DojoChainConfig, dojoContextConfig } from "@/dojo/setup/config";
import { ControllerConnector } from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/presets";
import { getContractByName } from "@dojoengine/core";
import { Chain } from "@starknet-react/chains";
import {
  ChainProviderFactory,
  Connector,
  ExplorerFactory,
  InjectedConnector,
  StarknetConfig,
  argent,
  injected,
  jsonRpcProvider,
  starkscan,
} from "@starknet-react/core";
import { useRouter } from "next/router";
import { ReactNode, useMemo, useState } from "react";
import { RpcProvider } from "starknet";

export const walletInstallLinks = {
  argentX: "https://www.argent.xyz/argent-x/",
  braavos: "https://braavos.app/download-braavos-wallet/",
};
export type walletInstallLinksKeys = keyof typeof walletInstallLinks;

export function customJsonRpcProvider(selectedChain: DojoChainConfig): ChainProviderFactory<RpcProvider> {
  return function (chain) {
    const config = {
      nodeUrl: selectedChain.rpcUrl || "",
    };
    const chainId = selectedChain.chainConfig.id || undefined;

    ///@ts-ignore
    const provider = new RpcProvider({ ...config, chainId });

    return provider;
  };
}

function getConnectorsForChain(selectedChain: DojoChainConfig, path: string) {
  const controller = cartridgeConnector({ selectedChain });

  switch (selectedChain.name) {
    case "KATANA":
      return [
        controller /*injected({ id: "dojoburner" }), */,
        // injected({ id: "dojopredeployed" })
      ];

    // case "SN_SEPOLIA":
    //   return [cartridgeConnector({ selectedChain })];

    case "WP_RYO1":
    case "WP_RYO2":
      return [
        controller,
        // injected({ id: "dojoburner" }),
        // injected({ id: "dojopredeployed" }),
        // cartridgeConnector({ selectedChain }),
      ];

    default:
      // const controller = cartridgeConnector({ selectedChain });
      if (path.startsWith("/admin")) {
        return [controller, argent()];
      }
      return [controller];
  }
}

const cartridgeConnector = ({ selectedChain }: { selectedChain: DojoChainConfig }) => {
  const paperAddress = selectedChain.paperAddress;

  const gameAddress = getContractByName(selectedChain.manifest, DW_NS, "game")?.address || "0x0";
  const decideAddress = getContractByName(selectedChain.manifest, DW_NS, "decide")?.address || "0x0";
  const purchaseAddress = getContractByName(selectedChain.manifest, DW_NS, "purchase")?.address || "0x0";
  const marketplaceAddress = getContractByName(selectedChain.manifest, DW_NS, "marketplace")?.address || "0x0";

  const policies: SessionPolicies = {
    contracts: {
      [selectedChain.vrfProviderAddress]: {
        methods: [{ entrypoint: "request_random" }],
      },
      [paperAddress]: {
        methods: [{ entrypoint: "approve" }],
      },
      [gameAddress]: {
        methods: [{ entrypoint: "create_game" }, { entrypoint: "travel" }, { entrypoint: "end_game" }],
      },
      [decideAddress]: {
        methods: [{ entrypoint: "decide" }],
      },
      // v2: purchase contract (bundle.issue for buying starterpacks)
      [purchaseAddress]: {
        methods: [
          { entrypoint: "issue" },
          { entrypoint: "quote" },
          { entrypoint: "set_payment_config" },
          { entrypoint: "initialize" },
        ],
      },
      // v2: marketplace (daily gear shop + equip)
      [marketplaceAddress]: {
        methods: [
          { entrypoint: "buy" },
          { entrypoint: "quote" },
          { entrypoint: "today_offer" },
          { entrypoint: "equip" },
        ],
      },
    },
  };

  if (selectedChain.name !== "MAINNET") {
    policies.contracts![selectedChain.vrfProviderAddress].methods.push({
      entrypoint: "submit_random",
    });
    policies.contracts![selectedChain.vrfProviderAddress].methods.push({
      entrypoint: "assert_consumed",
    });
  }

  return new ControllerConnector({
    chains: [
      {
        rpcUrl: selectedChain.rpcUrl ? selectedChain.rpcUrl : "http://localhost:5050",
      },
    ],
    defaultChainId: `0x${selectedChain.chainConfig.id.toString(16)}`,
    slot: selectedChain.slot ? selectedChain.slot : "ryo",
    namespace: selectedChain.namespace ? selectedChain.namespace : DW_NS,
    tokens: {
      erc20: ["strk", "usdc"],
    },
    preset: "dope-wars",
    policies,
  }) as unknown as InjectedConnector;
};

// const controller = cartridgeConnector({ selectedChain: dojoContextConfig.KATANA });

export function StarknetProvider({ children, selectedChain }: { children: ReactNode; selectedChain: DojoChainConfig }) {
  const router = useRouter();

  // const chains = getStarknetProviderChains();
  const { chains, connectors, provider } = useMemo(() => {
    return {
      chains: [selectedChain.chainConfig],
      provider: customJsonRpcProvider(selectedChain),
      connectors: getConnectorsForChain(selectedChain, router.asPath),
    };
  }, [selectedChain]);

  const [explorer, setExplorer] = useState<ExplorerFactory>(() => starkscan);

  return (
    <StarknetConfig chains={chains} provider={provider} connectors={connectors} explorer={explorer} autoConnect={true}>
      {children}
    </StarknetConfig>
  );
}
