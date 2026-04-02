import { Button } from "@/components/common";
import { useGameStore } from "@/dojo/hooks";
import { formatCash } from "@/utils/ui";
import { Link as ChakraLink, StyleProps } from "@chakra-ui/react";
import { Twitter } from "../../icons";

const ShareButton = ({ ...props }: { variant?: string } & StyleProps) => {
  const { game, gameInfos } = useGameStore();

  if (!game || !gameInfos) return null;

  return (
    <ChakraLink
      w="full"
      href={`https://twitter.com/intent/tweet?text=${getShareText(game, gameInfos)}`}
      target="_blank"
      textDecoration="none !important"
      {...props}
    >
      <Button variant={props.variant ? props.variant : ""} w="full">
        <Twitter /> Share
      </Button>
    </ChakraLink>
  );
};

const getShareText = (game: any, gameInfos: any): string => {
  const playerName = gameInfos?.player_name?.value || gameInfos?.player_name || "Player";
  if (game.player.health > 0) {
    return encodeURIComponent(
      `I reached Day ${game.player.turn} with ${formatCash(
        game.player.cash,
      )} $PAPER. Think you can out hustle me? #dopewars.\n\n${window.location.origin}`,
    );
  } else {
    return encodeURIComponent(
      `I got dropped on Day ${game.player.turn} but pocketed ${formatCash(
        game.player.cash,
      )} $PAPER before checking out. Think you can out hustle me? #dopewars.\n\n${window.location.origin}`,
    );
  }
};

export default ShareButton;
