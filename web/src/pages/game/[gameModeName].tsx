import { Button, Input } from "@/components/common";
import { Layout } from "@/components/layout";
import { Footer } from "@/components/layout";
import { gameModeFromName, gameModeFromNameKeys } from "@/dojo/helpers";
import { useRouterContext, useSystems } from "@/dojo/hooks";
import { GameMode } from "@/dojo/types";
import { play } from "@/hooks/media";
import { Sounds, playSound } from "@/hooks/sound";
import { Card, HStack, Heading, Text, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";

const gameModeLabel: Record<GameMode, string> = {
  [GameMode.Ranked]: "Ranked",
  [GameMode.Noob]: "Guest",
  [GameMode.Warrior]: "Warrior",
};

export default function New() {
  const { router, isLocalhost, gameModeName } = useRouterContext();
  const { createGame, isPending } = useSystems();
  const gameMode = gameModeFromName[gameModeName as gameModeFromNameKeys] as GameMode;

  const inputRef = useRef<null | HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const create = async () => {
    setError("");
    if (name === "" || name.length > 16 || name.length < 3) {
      setError("Invalid name, at least 3 chars, max 16!");
      inputRef.current && inputRef.current.scrollIntoView();
      return;
    }

    try {
      if (!isLocalhost) {
        play();
      }

      await createGame(gameMode, name);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Layout
      isSinglePanel
      footer={
        <Footer>
          <Button
            w={["full", "auto"]}
            px={["auto", "20px"]}
            onClick={() => {
              playSound(Sounds.Ooo, 0.3);
              router.push("/");
            }}
          >
            Back
          </Button>

          <Button variant="primary" w={["full", "auto"]} px={["auto", "20px"]} isLoading={isPending} onClick={create}>
            Play
          </Button>
        </Footer>
      }
    >
      <VStack w={["full", "700px"]} marginX="auto">
        <VStack w="full" gap={[3, 6]} overflowX="hidden">
          <VStack>
            <Text textStyle="subheading" fontSize={["11px", "11px"]} my={["10px", "0"]} letterSpacing="0.25em">
              {gameModeLabel[gameMode] ?? "New"} Game
            </Text>
            <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
              Enter your name
            </Heading>
          </VStack>

          <Card p={[4, 6]} w={["full", "400px"]}>
            <VStack gap={4}>
              <Text textStyle="subheading" fontSize="12px" color="neon.500">
                PLAYER NAME
              </Text>

              <VStack w="full" ref={inputRef}>
                <Input
                  display="flex"
                  mx="auto"
                  maxW="300px"
                  maxLength={16}
                  placeholder="Enter your name"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setError("");
                    setName(e.target.value);
                  }}
                />

                <VStack w="full" h="30px">
                  <Text w="full" align="center" color="red" display={error !== "" ? "block" : "none"}>
                    {error}
                  </Text>
                </VStack>
              </VStack>
            </VStack>
          </Card>
        </VStack>
      </VStack>
    </Layout>
  );
}
