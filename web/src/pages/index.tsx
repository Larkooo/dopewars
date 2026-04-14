import { Button } from "@/components/common";
import { CopsIcon, Flipflop, LaundromatIcon, PaperIcon, Warning } from "@/components/icons";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Leaderboard, Tutorial } from "@/components/pages/home";
import { HallOfFame } from "@/components/pages/home/HallOfFame";
import { useConfigStore, useDojoContext, useRouterContext, useSeasonByVersion, useSystems } from "@/dojo/hooks";
import { sleep } from "@/dojo/utils";
import { Card, HStack, Progress, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import colors from "@/theme/colors";
import { GameMode } from "@/dojo/types";
import { Glock } from "@/components/icons/items";
import { gameModeName } from "@/dojo/helpers";

export default function Home() {
  const { router, isLocalhost } = useRouterContext();
  const { account } = useAccount();
  const { uiStore } = useDojoContext();
  const { launder, isPending } = useSystems();
  const { connectors, connect } = useConnect();

  const configStore = useConfigStore();
  const { config } = configStore;
  const {
    season,
    sortedList,
    isSeasonOpen,
    isSeasonWashed,
    canCreateGame,
    refetch: refetchSeason,
  } = useSeasonByVersion(config?.ryo.season_version);

  const [progressPercent, setProgressPercent] = useState(0);

  const isPaused = config?.ryo.paused;

  useEffect(() => {
    if (!sortedList || sortedList.process_max_size === 0) return;

    const value = (sortedList?.process_size * 100) / sortedList?.process_max_size;
    setProgressPercent(Math.floor(value));
  }, [sortedList]);

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const onHustle = async () => {
    if (!account) {
      if (connectors.length > 1) {
        uiStore.openConnectModal();
      } else {
        connect({ connector: connectors[0] });

        if (connectors[0].id !== "controller") {
          router.push("/game/new");
        }
      }
    }

    if (account) {
      router.push("/game/new");
    }
  };

  const onLaunder = async () => {
    if (!account) {
      uiStore.openConnectModal();
      return;
    }

    await launder(season?.version);
    await sleep(1000);
    await refetchSeason();
    await configStore.init();
  };

  return (
    <Layout
      customLeftPanel={<HomeLeftPanel />}
      rigthPanelScrollable={false}
      // rigthPanelMaxH="calc(100dvh - 230px)"
    >
      <VStack boxSize="full" gap="10px">
        <Card variant="pixelated">
          <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
            {isPaused && (
              <HStack w="full" color="yellow.400" justifyContent="center" alignItems="center" gap={6}>
                <CopsIcon color="yellow.400" />
                <VStack flexDirection={["column", "row"]}>
                  <Text>Game under arrest.</Text>
                  <Text>The streets are silent...</Text>
                </VStack>
              </HStack>
            )}
            {/* v2: always show Play Now — no season gating, no laundromat */}
            {!isPaused && (
              <Button flex="1" onClick={() => onHustle()}>
                <Glock /> Play Now
              </Button>
            )}

          </HStack>
        </Card>
        <Leaderboard config={config} />
        {/*<Tabs variant="unstyled" w="full">
          {/*<TabList pb={6}>
            <Tab>LEADERBOARD</Tab>
            <Tab>HALL OF FAME</Tab>
          </TabList>

          <TabPanels mt={0} maxH={["100%", "calc(100dvh - 380px)"]} overflowY="scroll">
            <TabPanel p={0}>
              <Leaderboard config={config} />
            </TabPanel>
            <TabPanel p={0}>
              <HallOfFame />
            </TabPanel>
          </TabPanels>
        </Tabs>*/}
      </VStack>

      <Tutorial isOpen={isTutorialOpen} close={() => setIsTutorialOpen(false)} />
    </Layout>
  );
}
