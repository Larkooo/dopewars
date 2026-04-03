import { Button, Input } from "@/components/common";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Tutorial } from "@/components/pages/home";
import { useSystems } from "@/dojo/hooks";
import { HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { GameMode } from "@/dojo/types";

export default function Home() {
  const { createGame, isPending } = useSystems();

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
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

  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <VStack boxSize="full" gap={6} justifyContent="center" maxW="360px" mx="auto">
        <Heading fontSize={["36px", "48px"]} fontWeight="400" textAlign="center">
          Name your hustler
        </Heading>

        <VStack w="full" gap={3}>
          <Input
            maxW="300px"
            mx="auto"
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
          {error && (
            <Text align="center" color="red" fontSize="12px">
              {error}
            </Text>
          )}
        </VStack>

        <Button variant="primary" w="full" maxW="300px" isLoading={isPending} onClick={onPlay}>
          Play
        </Button>

        <Text
          textStyle="subheading"
          fontSize="12px"
          letterSpacing="0.25em"
          color="neon.500"
          cursor="pointer"
          _hover={{ color: "neon.400" }}
          onClick={() => setIsTutorialOpen(true)}
        >
          How to play
        </Text>
      </VStack>

      <Tutorial isOpen={isTutorialOpen} close={() => setIsTutorialOpen(false)} />
    </Layout>
  );
}
