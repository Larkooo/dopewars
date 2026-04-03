import { Button, Input } from "@/components/common";
import { Layout } from "@/components/layout";
import { HomeLeftPanel } from "@/components/pages/home";
import { useSystems } from "@/dojo/hooks";
import { Box, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { GameMode } from "@/dojo/types";
import Dot from "@/components/icons/Dot";

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

export default function Home() {
  const { createGame, isPending } = useSystems();

  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const onPlay = async () => {
    setError("");
    const playerName = name.trim();
    if (playerName.length < 3 || playerName.length > 16) {
      setError("Name must be 3-16 characters");
      return;
    }
    await createGame(GameMode.Noob, playerName);
  };

  const step = tutorialSteps[currentStep];

  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <VStack boxSize="full" justifyContent="center" alignItems="center">
        <VStack w="280px" gap={6}>
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
