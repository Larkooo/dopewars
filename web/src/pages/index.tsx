import { Button, Input } from "@/components/common";
import { Layout } from "@/components/layout";
import { HomeLeftPanel } from "@/components/pages/home";
import { useControllerUsername, useDojoContext, useSystems } from "@/dojo/hooks";
import { Box, Card, Flex, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GameMode } from "@/dojo/types";
import { Glock } from "@/components/icons/items";
import { SavedGameSummary } from "@/offline/store";
import { formatCash } from "@/utils/ui";
import { Heart } from "@/components/icons";
import { useAccount, useConnect } from "@starknet-react/core";

const steps = [
  { step: 1, title: "Buy Low" },
  { step: 2, title: "Sell High" },
  { step: 3, title: "???" },
  { step: 4, title: "Profit" },
];

const LOCATION_NAMES: Record<number, string> = {
  1: "Queens",
  2: "Bronx",
  3: "Brooklyn",
  4: "Jersey",
  5: "Central",
  6: "Coney",
};

type Screen = "home" | "games" | "new";

export default function Home() {
  const { createGame, isPending } = useSystems();
  const { gameStore } = useDojoContext();
  const { account, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { username } = useControllerUsername(address as string);

  const [screen, setScreen] = useState<Screen>("home");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [savedGames, setSavedGames] = useState<SavedGameSummary[]>([]);

  useEffect(() => {
    const games = gameStore
      .getSavedGames()
      .filter((g) => !g.isFinished)
      .sort((a, b) => b.lastPlayed - a.lastPlayed);
    setSavedGames(games);
  }, [gameStore]);

  useEffect(() => {
    if (username && !name) {
      setName(username);
    }
  }, [username]);

  const onPlayNow = () => {
    if (!account) {
      connect({ connector: connectors[0] });
    }
    if (savedGames.length > 0) {
      setScreen("games");
    } else {
      setScreen("new");
    }
  };

  const onStartGame = async () => {
    setError("");
    const playerName = name.trim();
    if (playerName.length < 3 || playerName.length > 16) {
      setError("Name must be 3-16 characters");
      return;
    }
    await createGame(GameMode.Noob, playerName);
  };

  const onContinue = (gameId: number) => {
    const loaded = gameStore.loadGame(gameId);
    if (loaded) {
      gameStore.navigate();
    }
  };

  if (screen === "home" || !account) {
    return (
      <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
        <Flex direction="column" boxSize="full" px={["16px", "0"]}>
          <VStack w="full" maxW="400px" mx="auto" pt={["80px", "16px"]} flexShrink={0}>
            <Card variant="pixelated" w="full">
              <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
                <Button flex="1" isLoading={isPending} onClick={onPlayNow}>
                  <Glock /> Play Now
                </Button>
              </HStack>
            </Card>
          </VStack>

          <VStack
            w="full"
            maxW="400px"
            mx="auto"
            flex={1}
            minH={0}
            overflowY="auto"
            gap={0}
            pt={4}
            pb="80px"
            __css={{ "scrollbar-width": "none", "&::-webkit-scrollbar": { display: "none" } }}
          >
            {steps.map((s) => (
              <HStack key={s.step} w="full" flexDirection={s.step % 2 === 1 ? "row" : "row-reverse"} gap={3} py={4}>
                <Image src={`/images/landing/step${s.step}.png`} alt={s.title} w="42%" objectFit="contain" />
                <VStack w="58%" align="flex-start" gap={1}>
                  <HStack gap={2}>
                    <Image src={`/images/landing/step${s.step}-icon.png`} alt={s.title} w="48px" h="48px" />
                    <VStack align="flex-start" gap={0}>
                      <Text fontSize="11px" fontFamily="broken-console" backgroundColor="#174127" px={2} py={1}>
                        Step {s.step}
                      </Text>
                      <Heading fontFamily="ppneuebit" fontSize="32px" lineHeight="1">
                        {s.title}
                      </Heading>
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </Flex>
      </Layout>
    );
  }

  if (screen === "games") {
    return (
      <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
        <VStack boxSize="full" px={["16px", "0"]} justifyContent="center">
          <VStack w="full" maxW="400px" mx="auto" gap={4}>
            <Heading fontSize={["24px", "36px"]} fontWeight="400" textAlign="center" w="full">
              Your Games
            </Heading>

            {savedGames.map((g) => (
              <HStack
                key={g.gameId}
                w="full"
                p={3}
                bg="neon.900"
                borderRadius="2px"
                cursor="pointer"
                _hover={{ bg: "neon.800" }}
                onClick={() => onContinue(g.gameId)}
                justify="space-between"
              >
                <VStack align="flex-start" gap={0}>
                  <Text fontSize="14px" color="neon.200">
                    {g.playerName}
                  </Text>
                  <Text fontSize="10px" color="neon.500">
                    Day {g.turn}/{g.maxTurns} - {LOCATION_NAMES[g.location] || "Unknown"}
                  </Text>
                </VStack>
                <VStack align="flex-end" gap={0}>
                  <Text fontSize="12px" color="yellow.400">
                    {formatCash(g.cash)}
                  </Text>
                  <HStack gap={1}>
                    <Heart width="10px" height="10px" />
                    <Text fontSize="10px" color="red">
                      {g.health}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
            ))}

            <Button variant="primary" w="full" onClick={() => setScreen("new")}>
              New Game
            </Button>

            <Text
              fontSize="12px"
              color="neon.500"
              cursor="pointer"
              _hover={{ color: "neon.400" }}
              onClick={() => setScreen("home")}
              textAlign="center"
            >
              Back
            </Text>
          </VStack>
        </VStack>
      </Layout>
    );
  }

  // screen === "new"
  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <VStack boxSize="full" h="100dvh" px={["16px", "0"]} justifyContent="center" alignItems="center">
        <VStack w="full" maxW="300px" gap={6}>
          <Heading fontSize={["28px", "40px"]} fontWeight="400" textAlign="center" w="full">
            Name your hustler
          </Heading>

          <VStack w="full" gap={3}>
            <Box w="full">
              <Input
                w="full"
                maxLength={16}
                placeholder="Enter name"
                autoFocus
                value={name}
                onChange={(e) => {
                  setError("");
                  setName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onStartGame();
                }}
              />
            </Box>
            {error && (
              <Text align="center" color="red" fontSize="12px">
                {error}
              </Text>
            )}
            <Button variant="primary" w="full" isLoading={isPending} onClick={onStartGame}>
              Play
            </Button>
            <Text
              fontSize="12px"
              color="neon.500"
              cursor="pointer"
              _hover={{ color: "neon.400" }}
              onClick={() => setScreen(savedGames.length > 0 ? "games" : "home")}
              textAlign="center"
            >
              Back
            </Text>
          </VStack>
        </VStack>
      </VStack>
    </Layout>
  );
}
