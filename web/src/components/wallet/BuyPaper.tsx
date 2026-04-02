import { Text, VStack } from "@chakra-ui/react";

export const BuyPaper = ({ paperAmount }: { paperAmount: number }) => {
  // Offline mode - no buying
  return (
    <VStack alignItems="flex-start" w="full">
      <Text fontSize="12px" textTransform="uppercase" color="neon.500">
        Not available in offline mode
      </Text>
    </VStack>
  );
};
