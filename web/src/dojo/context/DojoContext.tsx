import { Loader } from "@/components/layout/Loader";
import { StarknetProvider } from "@/components/wallet/StarknetProvider";
import { OfflineConfigStore } from "@/offline/game";
import { OfflineGameEngine } from "@/offline/engine";
import { OfflineGameStoreClass } from "@/offline/store";
import { Flex, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ReactNode, createContext, useContext, useMemo, useState, useEffect } from "react";
import { UiStore } from "../stores/ui";
import { useRouter } from "next/router";

export interface DojoContextType {
  configStore: OfflineConfigStore;
  gameStore: OfflineGameStoreClass;
  uiStore: UiStore;
  engine: OfflineGameEngine;
}

export const DojoContext = createContext<DojoContextType | null>(null);

export const DojoContextProvider = observer(({ children }: { children: ReactNode }) => {
  const currentValue = useContext(DojoContext);
  if (currentValue) throw new Error("DojoProvider can only be used once");

  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const configStore = useMemo(() => new OfflineConfigStore(), []);
  const engine = useMemo(() => new OfflineGameEngine(), []);
  const uiStore = useMemo(() => new UiStore(), []);

  const gameStore = useMemo(
    () => new OfflineGameStoreClass({ configStore, engine, router }),
    [configStore, engine, router],
  );

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <Flex minH="100dvh" alignItems="center" justifyContent="center">
        <VStack>
          <Loader />
        </VStack>
      </Flex>
    );
  }

  return (
    <DojoContext.Provider
      value={{
        configStore,
        gameStore,
        uiStore,
        engine,
      }}
    >
      <StarknetProvider>{children}</StarknetProvider>
    </DojoContext.Provider>
  );
});
