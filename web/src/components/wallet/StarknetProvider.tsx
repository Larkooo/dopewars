import { ReactNode } from "react";

export const walletInstallLinks = {
  argentX: "https://www.argent.xyz/argent-x/",
  braavos: "https://braavos.app/download-braavos-wallet/",
};
export type walletInstallLinksKeys = keyof typeof walletInstallLinks;

export function StarknetProvider({ children }: { children: ReactNode; selectedChain?: any }) {
  // Offline mode - no Starknet provider needed, just pass children through
  return <>{children}</>;
}
