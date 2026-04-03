import { Button, Input } from "@/components/common";
import { Layout } from "@/components/layout";
import { HomeLeftPanel } from "@/components/pages/home";
import { useControllerUsername, useDojoContext, useSystems } from "@/dojo/hooks";
import { Box, Divider, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GameMode } from "@/dojo/types";
import Dot from "@/components/icons/Dot";
import { SavedGameSummary } from "@/offline/store";
import { formatCash } from "@/utils/ui";
import { Heart } from "@/components/icons";
import { useAccount, useConnect } from "@starknet-react/core";
import { Cartridge } from "@/components/icons/branding/Cartridge";
import { ConnectButton } from "@/components/wallet";

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
  const { username } = useControllerUsername(address as string);

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

  // Pre-fill name from Controller username
  useEffect(() => {
    if (username && !name) {
      setName(username);
    }
  }, [username]);

  const onPlay = async () => {
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

  const step = tutorialSteps[currentStep];

  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <VStack boxSize="full" justifyContent="center" alignItems="center">
        <VStack w="280px" gap={6}>
          {!account ? (
            <>
              <Heading fontSize={["30px", "40px"]} fontWeight="400" textAlign="center" w="full">
                Connect to play
              </Heading>
              <ConnectButton w="full" />
            </>
          ) : (
            <>
              <Heading fontSize={["30px", "40px"]} fontWeight="400" textAlign="center" w="full">
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
                      if (e.key === "Enter") onPlay();
                    }}
                  />
                </Box>
                {error && (
                  <Text align="center" color="red" fontSize="12px">
                    {error}
                  </Text>
                )}
                <Button variant="primary" w="full" isLoading={isPending} onClick={onPlay}>
                  Play
                </Button>
              </VStack>

              {savedGames.length > 0 && (
                <VStack w="full" gap={3}>
                  <Divider borderColor="neon.700" />
                  <Text textStyle="subheading" fontSize="12px" letterSpacing="0.25em" color="neon.500">
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
            </>
          )}

          <VStack w="full" gap={3} pt={2}>
            <Text textStyle="subheading" fontSize="12px" letterSpacing="0.25em" color="neon.500">
              How to play
            </Text>

            <VStack gap={2} textAlign="center">
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
      </VStack>
    </Layout>
  );
}
