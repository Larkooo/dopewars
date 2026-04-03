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
import Dot from "@/components/icons/Dot";

const steps = [
  { step: 1, title: "Buy Low" },
  { step: 2, title: "Sell High" },
  { step: 3, title: "???" },
  { step: 4, title: "Profit" },
];

const tutorialSteps = [
  { title: "GAME STATE", desc: "Displays important details about the game", img: "/images/tutorial/tuto1.png" },
  { title: "BUYING PRODUCT", desc: "Buy the ones you can flip for profit", img: "/images/tutorial/tuto2.png" },
  {
    title: "KEEP IT MOVING",
    desc: "Different locations will offer different prices",
    img: "/images/tutorial/tuto3.png",
  },
  { title: "A WORD OF ADVICE", desc: "The streets can be mean, Watch your back.", img: "/images/tutorial/tuto4.png" },
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
  const [currentStep, setCurrentStep] = useState(0);
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

  // Auto-advance carousel every 4 seconds, reset timer on manual interaction
  const [autoPlay, setAutoPlay] = useState(true);
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentStep((s) => (s + 1) % tutorialSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, currentStep]);

  if (screen === "home") {
    return (
      <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
        <Flex direction="column" boxSize="full" px={["16px", "0"]} justifyContent={["flex-start", "center"]}>
          <VStack w="full" maxW="400px" mx="auto" pt={["80px", "0"]} gap={[3, 6]}>
            <Card variant="pixelated" w="full">
              <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
                <Button flex="1" isLoading={isPending} onClick={onPlayNow}>
                  <Glock /> Play Now
                </Button>
              </HStack>
            </Card>

            {/* Desktop: auto-scrolling tutorial carousel */}
            <VStack w="full" gap={3} display={["none", "flex"]}>
              <Box w="full" overflow="hidden" borderRadius="4px">
                <HStack
                  w={`${tutorialSteps.length * 100}%`}
                  transition="transform 0.5s ease"
                  transform={`translateX(-${(currentStep * 100) / tutorialSteps.length}%)`}
                >
                  {tutorialSteps.map((t, i) => (
                    <VStack key={i} w={`${100 / tutorialSteps.length}%`} gap={2} textAlign="center" flexShrink={0}>
                      <Image src={t.img} alt={t.title} w="full" maxH="280px" objectFit="contain" />
                      <Text fontSize="14px" fontWeight="bold" color="neon.200">
                        {t.title}
                      </Text>
                      <Text fontSize="12px" color="neon.500">
                        {t.desc}
                      </Text>
                    </VStack>
                  ))}
                </HStack>
              </Box>
              <HStack gap="10px">
                {tutorialSteps.map((_, i) => (
                  <Dot key={i} active={i === currentStep} onClick={() => setCurrentStep(i)} />
                ))}
              </HStack>
            </VStack>
          </VStack>

          {/* Mobile: landing steps */}
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
            display={["flex", "none"]}
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
        <Flex direction="column" boxSize="full" px={["16px", "0"]} pt={["80px", "16px"]}>
          <Heading
            fontSize={["24px", "36px"]}
            fontWeight="400"
            textAlign="center"
            w="full"
            maxW="400px"
            mx="auto"
            pb={4}
            flexShrink={0}
          >
            Your Games
          </Heading>

          {/* Scrollable game list */}
          <VStack
            w="full"
            maxW="400px"
            mx="auto"
            flex={1}
            minH={0}
            overflowY="auto"
            gap={2}
            pb="120px"
            __css={{ "scrollbar-width": "none", "&::-webkit-scrollbar": { display: "none" } }}
          >
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
                flexShrink={0}
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
          </VStack>

          {/* Fixed bottom buttons */}
          <VStack
            position="absolute"
            bottom={["60px", "40px"]}
            left={0}
            right={0}
            px={["16px", "0"]}
            pb="8px"
            pt="16px"
            background="linear-gradient(transparent, #172217 30%)"
            align="center"
          >
            <VStack w="full" maxW="400px" gap={2}>
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
        </Flex>
      </Layout>
    );
  }

  // screen === "new"
  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <Flex direction="column" boxSize="full" px={["16px", "0"]}>
        <VStack w="full" maxW="400px" mx="auto" pt={["80px", "16px"]} gap={6} flexShrink={0}>
          <Heading fontSize={["28px", "40px"]} fontWeight="400" textAlign="center" w="full">
            Name your hustler
          </Heading>

          <VStack w="full" maxW="300px" mx="auto" gap={3}>
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

        {/* Mobile: how to play carousel */}
        <VStack w="full" maxW="400px" mx="auto" gap={3} pt={4} display={["flex", "none"]}>
          <Box w="full" overflow="hidden" borderRadius="4px">
            <HStack
              w={`${tutorialSteps.length * 100}%`}
              transition="transform 0.5s ease"
              transform={`translateX(-${(currentStep * 100) / tutorialSteps.length}%)`}
            >
              {tutorialSteps.map((t, i) => (
                <VStack key={i} w={`${100 / tutorialSteps.length}%`} gap={2} textAlign="center" flexShrink={0}>
                  <Image src={t.img} alt={t.title} w="full" maxH="180px" objectFit="contain" />
                  <Text fontSize="14px" fontWeight="bold" color="neon.200">
                    {t.title}
                  </Text>
                  <Text fontSize="12px" color="neon.500">
                    {t.desc}
                  </Text>
                </VStack>
              ))}
            </HStack>
          </Box>
          <HStack gap="10px">
            {tutorialSteps.map((_, i) => (
              <Dot key={i} active={i === currentStep} onClick={() => setCurrentStep(i)} />
            ))}
          </HStack>
        </VStack>
      </Flex>
    </Layout>
  );
}
