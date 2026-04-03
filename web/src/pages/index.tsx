import { Button } from "@/components/common";
import { Layout } from "@/components/layout";
import { HomeLeftPanel, Tutorial } from "@/components/pages/home";
import { useSystems } from "@/dojo/hooks";
import { Card, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { GameMode } from "@/dojo/types";
import { Glock } from "@/components/icons/items";

export default function Home() {
  const { createGame, isPending } = useSystems();

  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [name, setName] = useState("");

  const onPlay = async () => {
    const playerName = name.trim() || `Hustler${Math.floor(Math.random() * 9999)}`;
    await createGame(GameMode.Noob, playerName);
  };

  return (
    <Layout customLeftPanel={<HomeLeftPanel />} rigthPanelScrollable={false}>
      <VStack boxSize="full" gap="10px" justifyContent="center">
        <Card variant="pixelated">
          <VStack w="full" p={["10px", "20px"]} gap="10px">
            <input
              style={{
                background: "transparent",
                border: "1px solid #157342",
                padding: "8px 12px",
                width: "100%",
                color: "#11ED83",
                fontFamily: "dos-vga, monospace",
                fontSize: "14px",
                textAlign: "center",
                outline: "none",
              }}
              placeholder="Enter your name"
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onPlay();
              }}
            />
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
