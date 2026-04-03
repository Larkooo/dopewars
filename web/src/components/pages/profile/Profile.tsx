import { Button } from "@/components/common";
import { useGameStore, useRouterContext } from "@/dojo/hooks";
import { headerButtonStyles } from "@/theme/styles";
import { HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HustlerAvatarIcon } from "./HustlerAvatarIcon";

export const ProfileLink = () => {
  const { router, gameId } = useRouterContext();
  const { gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!gameInfos) return null;

  return (
    <>
      <Button cursor="pointer" h={["40px", "48px"]} {...headerButtonStyles} onClick={onClick}>
        <HustlerAvatarIcon
          gameId={gameInfos.game_id}
          // @ts-ignore
          tokenIdType={gameInfos?.token_id_type}
          tokenId={Number(gameInfos?.token_id)}
        />
      </Button>
    </>
  );
};

export const ProfileLinkMobile = () => {
  const { router, gameId } = useRouterContext();
  const { gameEvents, gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!gameInfos || !gameEvents) return null;

  return (
    <>
      <HStack h="48px" cursor="pointer" onClick={onClick}>
        <HustlerAvatarIcon
          gameId={gameInfos.game_id}
          // @ts-ignore
          tokenIdType={gameInfos?.token_id_type}
          tokenId={Number(gameInfos?.token_id)}
        />
        <Text ml="10px">{gameInfos.player_name?.value || gameInfos.player_name || "Player"}</Text>
      </HStack>
    </>
  );
};

export const ProfileLinkDrawer = () => {
  const { router, gameId } = useRouterContext();
  const { gameEvents, gameInfos } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    if (router.pathname === "/[gameId]/logs") {
      router.back();
    } else {
      router.push(`/${gameId}/logs`);
    }
  };

  if (!gameInfos) return null;
  return (
    <HStack borderRadius={0} onClick={onClick}>
      <HustlerAvatarIcon
        gameId={gameInfos.game_id}
        // @ts-ignore
        tokenIdType={gameInfos?.token_id_type}
        tokenId={Number(gameInfos?.token_id)}
      />
      <Text ml="4px">{gameInfos.player_name?.value || gameInfos.player_name || "Player"}</Text>
    </HStack>
  );
};
