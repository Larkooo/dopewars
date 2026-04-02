import { VStack, Text } from "@chakra-ui/react";

export default function ClaimComponentFree() {
  return (
    <VStack w="full" mt={6} p={4}>
      <Text>Claiming is not available in offline mode.</Text>
    </VStack>
  );
}
