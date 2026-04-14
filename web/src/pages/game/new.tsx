import { Button } from "@/components/common";
import { Footer, Layout } from "@/components/layout";
import { ChildrenOrConnect } from "@/components/wallet";
import { useConfigStore, useDojoContext, useRouterContext, useSystems } from "@/dojo/hooks";
import { Sounds, playSound } from "@/hooks/sound";
import { useToast } from "@/hooks/toast";
import { Box, Card, HStack, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useAccount, useConnect } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { useCallback, useMemo, useState } from "react";
import { getContractByName } from "@dojoengine/core";
import { DW_NS } from "@/dojo/constants";
import { ControllerConnector } from "@cartridge/connector";

const PACK_TIERS = [
  {
    id: 1,
    name: "JUNKIE",
    multiplier: 1,
    description: "Bare minimum. Start with junk gear. 1x rewards.",
    color: "neon.500",
  },
  {
    id: 2,
    name: "STREET",
    multiplier: 2,
    description: "Street-level hustle. Same gear, 2x rewards.",
    color: "yellow.400",
  },
  {
    id: 3,
    name: "DEALER",
    multiplier: 3,
    description: "Serious player. Same gear, 3x rewards.",
    color: "neon.400",
  },
  {
    id: 4,
    name: "KINGPIN",
    multiplier: 4,
    description: "Top tier. Same gear, 4x reward multiplier.",
    color: "red",
  },
];

const NewGame = observer(() => {
  const { router } = useRouterContext();
  const {
    chains: { selectedChain },
    clients: { dojoProvider },
  } = useDojoContext();
  const { account } = useAccount();
  const { connector } = useConnect();
  const { isPending, executeAndReceipt } = useSystems();
  const { toast } = useToast();

  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);

  const purchaseAddress = useMemo(
    () => getContractByName(dojoProvider.manifest, DW_NS, "purchase")?.address || "0x0",
    [dojoProvider],
  );

  const selectedPack = useMemo(() => {
    return PACK_TIERS.find((p) => p.id === selectedPackId);
  }, [selectedPackId]);

  const onBuyPack = useCallback(async () => {
    if (!selectedPackId || !account) return;

    try {
      playSound(Sounds.Trade);

      // Use Cartridge Controller's built-in bundle purchase UI
      const controller = connector as unknown as ControllerConnector;
      await controller.controller.openBundle(selectedPackId, purchaseAddress, {
        onPurchaseComplete: () => {
          toast({
            message: `Starterpack purchased! Your Hustler has been minted.`,
            duration: 5000,
          });
        },
      });
    } catch (e: any) {
      console.error("Purchase error:", e);
    }
  }, [selectedPackId, account, executeAndReceipt, purchaseAddress, toast]);

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

          <ChildrenOrConnect variant="primary" h="35px">
            {selectedPackId && (
              <Button w={["full", "auto"]} px={["auto", "20px"]} isLoading={isPending} onClick={onBuyPack}>
                Buy {selectedPack?.name} Pack
              </Button>
            )}
          </ChildrenOrConnect>
        </Footer>
      }
    >
      <VStack w={["full", "700px"]} marginX="auto">
        <VStack w="full" gap={[3, 6]} overflowX="hidden">
          <VStack>
            <Text textStyle="subheading" fontSize={["11px", "11px"]} my={["10px", "0"]} letterSpacing="0.25em">
              Choose your
            </Text>
            <Heading fontSize={["30px", "48px"]} fontWeight="400" textAlign="center">
              Starterpack...
            </Heading>
            <Text fontSize="12px" color="neon.500" textAlign="center" maxW="400px">
              Buy a pack to mint a Hustler NFT. All packs have the same stats and junk gear — only the reward multiplier
              differs.
            </Text>
          </VStack>

          <SimpleGrid columns={[1, 2]} gap={4} w="full" maxW="600px" px={4}>
            {PACK_TIERS.map((pack) => (
              <Button
                key={pack.id}
                w="full"
                h="auto"
                p={4}
                variant="selectable"
                isActive={selectedPackId === pack.id}
                onClick={() => {
                  playSound(Sounds.HoverClick, 0.3);
                  setSelectedPackId(pack.id);
                }}
                justifyContent="stretch"
              >
                <VStack w="full" gap={2} alignItems="flex-start">
                  <HStack w="full" justifyContent="space-between">
                    <Text fontWeight="bold" color={pack.color} fontSize={["16px", "18px"]}>
                      {pack.name}
                    </Text>
                    <Text color="yellow.400" fontSize="14px" fontWeight="bold">
                      {pack.multiplier}x
                    </Text>
                  </HStack>
                  <Text fontSize="11px" color="neon.500" textAlign="left">
                    {pack.description}
                  </Text>
                </VStack>
              </Button>
            ))}
          </SimpleGrid>

          {selectedPack && (
            <Card p={4} w="full" maxW="400px">
              <VStack gap={3}>
                <HStack w="full" justifyContent="space-between">
                  <Text fontWeight="bold" fontSize="18px" color={selectedPack.color}>
                    {selectedPack.name}
                  </Text>
                  <Text color="yellow.400" fontWeight="bold">
                    {selectedPack.multiplier}x REWARDS
                  </Text>
                </HStack>

                <VStack w="full" gap={1}>
                  <Text textStyle="subheading" fontSize="9px" color="neon.500" w="full">
                    STARTER GEAR (SAME FOR ALL)
                  </Text>
                  {[
                    ["WEAPON", "Razor Blade"],
                    ["CLOTHES", "Shirtless"],
                    ["FEET", "Barefoot"],
                    ["TRANSPORT", "Rollerblades"],
                  ].map(([slot, gear]) => (
                    <HStack key={slot} w="full" justifyContent="space-between">
                      <Text fontSize="12px" color="neon.500">
                        {slot}
                      </Text>
                      <Text fontSize="12px">{gear}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </Card>
          )}

          <Box minH="80px" />
        </VStack>
      </VStack>
    </Layout>
  );
});

export default NewGame;
