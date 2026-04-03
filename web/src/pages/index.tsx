import { Button, Input } from "@/components/common";
import { Layout } from "@/components/layout";
import { HomeLeftPanel } from "@/components/pages/home";
import { useControllerUsername, useDojoContext, useSystems } from "@/dojo/hooks";
import { Box, Card, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GameMode } from "@/dojo/types";
import Dot from "@/components/icons/Dot";
import { Glock } from "@/components/icons/items";
import { SavedGameSummary } from "@/offline/store";
import { formatCash } from "@/utils/ui";
import { Heart } from "@/components/icons";
import { useAccount, useConnect } from "@starknet-react/core";

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

  const step = tutorialSteps[currentStep];
  const showGame = account && showNameInput;

  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <VStack
        boxSize="full"
        gap={["16px", "10px"]}
        justifyContent={["flex-start", "center"]}
        pt={["90px", "0"]}
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

            <VStack w="full" gap={3} pt={[0, 2]}>
              <Text textStyle="subheading" fontSize="11px" letterSpacing="0.25em" color="neon.500">
                How to play
              </Text>
              <VStack gap={2} textAlign="center" w="full">
                <Text fontSize="10px" letterSpacing="0.2em" color="neon.500" textTransform="uppercase">
                  Step {currentStep + 1} of {tutorialSteps.length}
                </Text>
                <Text fontSize="14px" fontWeight="bold" color="neon.200">
                  {step.title}
                </Text>
                <Text fontSize="12px" color="neon.500">
                  {step.desc}
                </Text>
                <Image src={step.img} alt={step.title} w="full" borderRadius="4px" />
              </VStack>
              <HStack gap="10px">
                {tutorialSteps.map((_, i) => (
                  <Dot key={i} active={i === currentStep} onClick={() => setCurrentStep(i)} />
                ))}
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
