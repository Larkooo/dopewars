import { Button } from "@/components/common";
import { Flipflop } from "@/components/icons";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Tutorial } from "@/components/pages/home";
import { useRouterContext, useSystems } from "@/dojo/hooks";
import { Card, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { GameMode } from "@/dojo/types";
import { Glock } from "@/components/icons/items";
import { gameModeName } from "@/dojo/helpers";

export default function Home() {
  const { router } = useRouterContext();
  const { isPending } = useSystems();

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const onHustle = (gameMode: GameMode) => {
    const mode = gameModeName[gameMode];
    router.push(`/game/${mode}`);
  };

  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <VStack boxSize="full" gap="10px">
        <Card variant="pixelated">
          <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
            <Button flex="1" isLoading={isPending} onClick={() => onHustle(GameMode.Ranked)}>
              <Glock /> Play Ranked
            </Button>
          </HStack>
        </Card>

        <Card variant="pixelated">
          <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
            <Button flex="1" isLoading={isPending} onClick={() => onHustle(GameMode.Noob)}>
              <Flipflop /> Play Guest
            </Button>
            <Button flex="1" isLoading={isPending} onClick={() => onHustle(GameMode.Warrior)}>
              <Glock /> Play Warrior
            </Button>
          </HStack>
        </Card>

        <Card variant="pixelated" cursor="pointer" onClick={() => setIsTutorialOpen(true)}>
          <HStack w="full" p={["10px", "20px"]} justify="center">
            <Text textStyle="subheading" fontSize="14px" letterSpacing="0.25em">
              How to play
            </Text>
          </HStack>
        </Card>
      </VStack>

      <Tutorial isOpen={isTutorialOpen} close={() => setIsTutorialOpen(false)} />
    </Layout>
  );
}
