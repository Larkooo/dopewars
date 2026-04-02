import { ReactNode } from "react";

export default function EthProvider({ children }: { children: ReactNode }) {
  // Offline mode - no Ethereum provider needed
  return <>{children}</>;
}
