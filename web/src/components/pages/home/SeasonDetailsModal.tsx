import { Clock, DollarBag, Pistol, Trophy } from "@/components/icons";
import { useDojoContext, useGameStore, useSeasonByVersion } from "@/dojo/hooks";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

export const SeasonDetailsModal = observer(() => {
  const { uiStore, configStore } = useDojoContext();
  const { config } = configStore;
  const { gameConfig } = useGameStore();

  const seasonVersion = useMemo(() => {
    return gameConfig?.season_version || config?.ryo.season_version;
  }, [gameConfig, config]);

  const { season, seasonSettings } = useSeasonByVersion(seasonVersion);

  const onClose = () => {
    uiStore.closeSeasonDetails();
  };

  if (!season) return null;

  return (
    <>
      <Modal
        motionPreset="slideInBottom"
        isCentered
        isOpen={uiStore.modals.seasonDetails !== undefined}
        onClose={onClose}
        returnFocusOnClose={false}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent bg="bg.dark">
          <ModalHeader textAlign="center" pb={0}>
            Season {seasonVersion} Information
          </ModalHeader>
          <ModalBody py={6} minH={"420px"}>
            <Tabs variant="unstyled" w="full">
              <TabList pb={6}>
                <Tab>SETTINGS</Tab>
                <Tab>DETAILS</Tab>
              </TabList>

              <TabPanels mt={0} maxH={"80vh"} overflowY="scroll">
                <TabPanel p={0}>
                  <Text color="neon.500">Season settings are randomized each game in offline mode.</Text>
                </TabPanel>
                <TabPanel p={0}>
                  <VStack w="full" gap={6} color="neon.500">
                    <VStack w="full" gap={2}>
                      <HStack w="full" alignItems="flex-start">
                        <Clock />
                        <Text>Game runs in offline mode - no blockchain connection needed</Text>
                      </HStack>
                      <HStack w="full" alignItems="flex-start">
                        <Pistol />
                        <Text>All game logic runs locally</Text>
                      </HStack>
                      <HStack w="full" alignItems="flex-start">
                        <DollarBag />
                        <Text>Scores are tracked locally during your session</Text>
                      </HStack>
                      <HStack w="full" alignItems="flex-start">
                        <Trophy />
                        <Text>Play as many games as you want</Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button w="full" onClick={onClose}>
              CLOSE
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});
