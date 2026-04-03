import { Button, Input } from "@/components/common";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Tutorial } from "@/components/pages/home";
import { useSystems } from "@/dojo/hooks";
import { Card, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { GameMode } from "@/dojo/types";
import { Glock } from "@/components/icons/items";

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
      <VStack boxSize="full" gap="10px" justifyContent="center">
        <VStack>
          <Text textStyle="subheading" fontSize={["11px", "11px"]} letterSpacing="0.25em">
            New Game
          </Text>
          <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
            Name your hustler
          </Heading>
        </VStack>

        <Card p={[4, 6]} w={["full", "400px"]}>
          <VStack gap={4}>
            <Text textStyle="subheading" fontSize="12px" color="neon.500">
              HUSTLER NAME
            </Text>

            <VStack w="full">
              <Input
                display="flex"
                mx="auto"
                maxW="300px"
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

              <VStack w="full" h="30px">
                <Text w="full" align="center" color="red" display={error !== "" ? "block" : "none"}>
                  {error}
                </Text>
              </VStack>
            </VStack>

            <Button variant="primary" w="full" isLoading={isPending} onClick={onPlay}>
              <Glock /> Play
            </Button>
          </VStack>
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
