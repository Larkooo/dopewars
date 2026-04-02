import { useConfigStore, useDojoContext, useRouterContext } from "@/dojo/hooks";
import { formatCash } from "@/utils/ui";
import { Box, HStack, Text, UnorderedList, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { Arrow, InfosIcon, PaperIcon, Trophy } from "../../icons";
import { Config } from "@/dojo/stores/config";
import { useSwipeable } from "react-swipeable";

export const Leaderboard = observer(({ config }: { config?: Config }) => {
  const { router } = useRouterContext();
  const { uiStore } = useDojoContext();

  const [currentVersion] = useState(config?.ryo.season_version || 1);
  const [selectedVersion, setSelectedVersion] = useState(config?.ryo.season_version || 1);

  const onPrev = async () => {
    if (selectedVersion > 1) {
      setSelectedVersion(selectedVersion - 1);
    }
  };

  const onNext = async () => {
    if (selectedVersion < currentVersion) {
      setSelectedVersion(selectedVersion + 1);
    }
  };

  const onDetails = (version: any) => {
    router.push(`/season/${version}`);
  };

  const { ref: swipeableRef } = useSwipeable({ delta: 50, onSwipedLeft: onNext, onSwipedRight: onPrev });

  if (!config) {
    return <></>;
  }

  return (
    <VStack w="full" h="100%" ref={swipeableRef}>
      <VStack my="15px" w="full">
        <HStack w="full" justifyContent="space-between">
          <Arrow
            direction="left"
            cursor="pointer"
            opacity={selectedVersion > 1 ? "1" : "0.25"}
            onClick={onPrev}
          ></Arrow>
          <VStack textStyle="subheading" fontSize="12px" w="full" justifyContent="center" position="relative" gap={1}>
            <HStack gap={1} alignItems="center">
              <Text cursor="pointer" onClick={() => onDetails(selectedVersion)}>
                SEASON {selectedVersion}
              </Text>
              {selectedVersion === currentVersion && (
                <Box cursor="pointer" onClick={() => uiStore.openSeasonDetails()}>
                  <InfosIcon />
                </Box>
              )}
            </HStack>
            <HStack gap={1} alignItems="center" textStyle="subheading" fontSize="12px">
              <Text color="neon.500">OFFLINE MODE</Text>
            </HStack>
          </VStack>
          <Arrow
            direction="right"
            cursor="pointer"
            opacity={selectedVersion < currentVersion ? "1" : "0.25"}
            onClick={onNext}
          ></Arrow>
        </HStack>
      </VStack>
      <VStack
        boxSize="full"
        gap="20px"
        maxH={["calc(100dvh - 350px)", "calc(100dvh - 380px)"]}
        sx={{
          overflowY: "scroll",
        }}
        __css={{
          "scrollbar-width": "none",
        }}
      >
        <Text textAlign="center" color="neon.500">
          Leaderboard not available in offline mode
        </Text>
      </VStack>
    </VStack>
  );
});

export const RewardDetails = observer(
  ({ seasonVersion, position, claimable }: { seasonVersion: number; position: number; claimable?: number }) => {
    return (
      <VStack alignItems="flex-start" p={1} gap={1}>
        <Text textStyle="subheading" fontSize="12px" w="full" textAlign="center" my={2}>
          RANK {position} REWARDS
        </Text>
        <Text textAlign="center" color="neon.500" w="full">
          Not available in offline mode
        </Text>
      </VStack>
    );
  },
);
