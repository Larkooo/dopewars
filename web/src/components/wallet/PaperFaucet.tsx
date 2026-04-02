import { DollarBag } from "@/components/icons";
import { Box, Button } from "@chakra-ui/react";

export const PaperFaucet = () => {
  // Offline mode - no faucet
  return (
    <Box cursor="not-allowed" opacity={0.5}>
      <DollarBag />
    </Box>
  );
};

export const PaperFaucetButton = () => {
  // Offline mode - no faucet
  return (
    <Button w={["full", "auto"]} px={["auto", "20px"]} isDisabled>
      <DollarBag /> MINT PAPER
    </Button>
  );
};
