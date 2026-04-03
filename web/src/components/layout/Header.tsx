import { HeaderButton, MediaPlayer } from "@/components/layout";
import { useDojoContext, useGameStore, useRouterContext } from "@/dojo/hooks";
import { initSoundStore } from "@/hooks/sound";
import { headerStyles } from "@/theme/styles";
import { IsMobile, formatCashHeader } from "@/utils/ui";
import { Box, Divider, Flex, HStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { ProfileLink } from "../pages/profile/Profile";
import { CashIndicator, DayIndicator, HealthIndicator } from "../player";
import { ConnectButton } from "../wallet/ConnectButton";

import DrawerMenu from "./DrawerMenu";

export const Header = observer(() => {
  const isMobile = IsMobile();

  const { router, gameId } = useRouterContext();
  const { uiStore } = useDojoContext();
  const { game, gameConfig } = useGameStore();

  useEffect(() => {
    const init = async () => {
      await initSoundStore();
    };
    init();
  }, []);

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      zIndex="overlay"
      pt={["50px", "16px"]}
      pb={["20px", "16px"]}
      px="10px"
      background={["linear-gradient(to bottom, #172217 0%, #172217 70%, transparent 100%)", "none"]}
    >
      <HStack w="full" spacing="10px" align="flex-start" fontSize={["14px", "16px"]}>
        <HStack gap={3} flex="1">
          {/* Offline mode - no claim or migration buttons */}
        </HStack>

        {game && (
          <HStack
            flex={["auto", 1]}
            justify="center"
            width={["100%", "auto"]}
            cursor="help"
            onClick={() => {
              uiStore.openSeasonDetails();
            }}
          >
            <HStack
              h={["40px", "48px"]}
              width={["100%", "auto"]}
              px="20px"
              spacing={["10px", "30px"]}
              bg="neon.700"
              sx={{ ...headerStyles }}
            >
              <Flex w="full" align="center" justify="center" gap="10px">
                <HStack>
                  <CashIndicator cash={formatCashHeader(game.player.cash)} />
                  <Divider orientation="vertical" borderColor="neon.600" h="12px" />
                  <HealthIndicator health={game.player.health} maxHealth={gameConfig?.health} />
                  <Divider orientation="vertical" borderColor="neon.600" h="12px" />
                  <DayIndicator day={game.player.turn} max={gameConfig?.max_turns} />
                </HStack>
              </Flex>
            </HStack>
          </HStack>
        )}

        <HStack flex="1" justify="right">
          {!isMobile && <ConnectButton />}
          {!isMobile && game && <ProfileLink />}

          <Box display="none">
            <MediaPlayer />
          </Box>

          <DrawerMenu />
        </HStack>
      </HStack>
    </Box>
  );
});
