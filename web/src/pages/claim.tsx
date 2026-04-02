import { Layout } from "@/components/layout";
import { Text, VStack } from "@chakra-ui/react";

export default function Claim() {
  return (
    <Layout isSinglePanel>
      <VStack w="full" p={6}>
        <Text>Claiming is not available in offline mode.</Text>
      </VStack>
    </Layout>
  );
}
