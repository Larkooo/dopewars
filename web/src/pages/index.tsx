import { Button, Input } from "@/components/common";
import { Arrow } from "@/components/icons";
import { Layout } from "@/components/layout";
import { HomeLeftPanel } from "@/components/pages/home";
import { useControllerUsername, useDojoContext, useSystems } from "@/dojo/hooks";
import { Box, Card, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
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

export default function Home() {
  const { createGame, isPending } = useSystems();
  const { gameStore } = useDojoContext();
  const { account, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { username } = useControllerUsername(address as string);

  const [currentStep, setCurrentStep] = useState(0);
  const [showNameInput, setShowNameInput] = useState(false);
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
    setShowNameInput(true);
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
    if (!account) {
      connect({ connector: connectors[0] });
    }
    const loaded = gameStore.loadGame(gameId);
    if (loaded) {
      gameStore.navigate();
    }
  };

  const onNextStep = useCallback(() => {
    setCurrentStep((s) => (s + 1) % steps.length);
  }, []);

  const onPrevStep = useCallback(() => {
    setCurrentStep((s) => (s - 1 + steps.length) % steps.length);
  }, []);

  const step = steps[currentStep];
  const showGame = account && showNameInput;

  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <VStack
        boxSize="full"
        gap={["16px", "10px"]}
        justifyContent={["flex-start", "center"]}
        pt={["100px", "0"]}
        px={["16px", "0"]}
        overflowY="auto"
        pb={["80px", "0"]}
      >
        {!showGame ? (
          <VStack w="full" maxW="400px" mx="auto" gap={[4, 6]}>
            <Card variant="pixelated" w="full">
              <HStack w="full" p={["10px", "20px"]} gap="10px" justify="center">
                <Button flex="1" isLoading={isPending} onClick={onPlayNow}>
                  <Glock /> Play Now
                </Button>
              </HStack>
            </Card>

            {savedGames.length > 0 && (
              <VStack w="full" gap={2}>
                <Text textStyle="subheading" fontSize="11px" letterSpacing="0.25em" color="neon.500">
                  Continue
                </Text>
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
              </VStack>
            )}

            <VStack w="full" gap={3} pt={[2, 4]}>
              <Text textStyle="subheading" fontSize="11px" letterSpacing="0.25em" color="neon.500">
                How to play
              </Text>

              <HStack w="full" align="center" gap={2}>
                <Arrow
                  style="outline"
                  direction="left"
                  boxSize="36px"
                  cursor="pointer"
                  onClick={onPrevStep}
                  flexShrink={0}
                />

                <VStack flex="1" gap={3} align="center">
                  <Image
                    src={`/images/landing/step${step.step}.png`}
                    alt={step.title}
                    w="full"
                    maxH="180px"
                    objectFit="contain"
                  />
                  <HStack gap={3}>
                    <Image src={`/images/landing/step${step.step}-icon.png`} alt={step.title} w="48px" h="48px" />
                    <VStack align="flex-start" gap={0}>
                      <Text fontSize="11px" fontFamily="broken-console" backgroundColor="#174127" px={2} py={1}>
                        Step {step.step}
                      </Text>
                      <Heading fontFamily="ppneuebit" fontSize="32px" lineHeight="1">
                        {step.title}
                      </Heading>
                    </VStack>
                  </HStack>
                </VStack>

                <Arrow
                  style="outline"
                  direction="right"
                  boxSize="36px"
                  cursor="pointer"
                  onClick={onNextStep}
                  flexShrink={0}
                />
              </HStack>
            </VStack>
          </VStack>
        ) : (
          <VStack w="full" maxW="300px" mx="auto" gap={6} pt={["20px", "0"]}>
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
                onClick={() => setShowNameInput(false)}
                textAlign="center"
              >
                Back
              </Text>
            </VStack>
          </VStack>
        )}
      </VStack>
    </Layout>
  );
}
