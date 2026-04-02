import { PaperCashIcon, Roll } from "@/components/icons";
import { Layout } from "@/components/layout";
import {
  Divider,
  HStack,
  Image,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { Button } from "@/components/common";
import ShareButton from "@/components/pages/profile/ShareButton";
import {
  useGameStore,
  useRouterContext,
} from "@/dojo/hooks";
import { formatCash } from "@/utils/ui";
import { observer } from "mobx-react-lite";
import { ReactNode, useCallback, useEffect, useState } from "react";

const End = () => {
  const { game, gameInfos } = useGameStore();
  const { router, gameId } = useRouterContext();

  const [isCreditOpen, setIsCreditOpen] = useState<boolean>(false);

  useEffect(() => {
    if (game) {
      if (game.player?.health === 0) {
        // playSound(Sounds.Death, 0.3);
      }
    }
  }, [game]);

  const onCreditClose = useCallback(() => {
    setIsCreditOpen(false);
  }, [setIsCreditOpen]);

  if (!game || !gameInfos) return null;

  return (
    <Layout
      leftPanelProps={{
        title: "Game Over",
        prefixTitle: game?.player?.health === 0 ? "You died" : "You survived",
        imageSrc: "/images/sunset.png",
      }}
      footer={
        <Button onClick={() => router.push("/")}>Lobby</Button>
      }
    >
      <VStack h="full" justifyContent="center" gap={6}>
        <HStack w="full">
          <VStack flex="1">
            <Image src="/images/sunset.png" alt="game over" />
          </VStack>
          <VStack flex="1">
            <StatsItem
              text={game?.gameInfos.player_name || "Player"}
              icon={<PaperCashIcon />}
            />

            <Divider borderColor="neon.600" />
            <StatsItem text={`${formatCash(game?.player?.cash || 0)}`} icon={<PaperCashIcon />} />
          </VStack>
        </HStack>

        <HStack gap="10px" w={["full", "auto"]}>
          <Button variant="pixelated" w="full" onClick={() => setIsCreditOpen(true)}>
            <Roll />
          </Button>

          <ShareButton variant="pixelated" />

          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLScWuaWHjXsMJc2kmFvt1TlAdq4szDXh2pm16kBl0H7y2Mo4Xg/viewform"
            isExternal
            flex="1"
            textDecoration="none"
            _hover={{
              textDecoration: "none",
            }}
            display="flex"
          >
            <Button variant="pixelated" w="100%">
              GIVE FEEDBACK
            </Button>
          </Link>
        </HStack>
      </VStack>

      <Modal isOpen={isCreditOpen} onClose={onCreditClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" mt={1}>
            CREDITS
          </ModalHeader>
          <ModalBody mx->
            <UnorderedList pb={5}>
              <ListItem>
                Built by{" "}
                <Link href="https://cartridge.gg/" target="_blank">
                  cartridge
                </Link>{" "}
                with{" "}
                <Link href="https://dojoengine.org/" target="_blank">
                  DOJO
                </Link>
              </ListItem>

              <ListItem>
                Art by{" "}
                <Link href="https://twitter.com/Mr_faxu" target="_blank">
                  Mr. Fax
                </Link>{" "}
                &{" "}
                <Link href="https://twitter.com/HPMNK_One" target="_blank">
                  HPMNK
                </Link>
              </ListItem>

              <ListItem>
                Music and SFX by{" "}
                <Link href="https://twitter.com/CaseyWescott" target="_blank">
                  Casey Wescott
                </Link>{" "}
                &{" "}
                <Link href="https://twitter.com/SheckyGreen" target="_blank">
                  SheckyGreen
                </Link>
              </ListItem>
            </UnorderedList>
          </ModalBody>
          <ModalFooter justifyContent="stretch">
            <Button w="full" onClick={onCreditClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  );
};

export default observer(End);

const StatsItem = ({ text, icon }: { text: string; icon: ReactNode }) => {
  return (
    <HStack w="full" h="30px">
      {icon} <Text>{text}</Text>
    </HStack>
  );
};
