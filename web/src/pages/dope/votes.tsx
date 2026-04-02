import { Layout } from "@/components/layout";
import { Text, VStack } from "@chakra-ui/react";

export default function Votes() {
  return (
    <Layout isSinglePanel>
      <VStack w="full" p={6}>
        <Text>Voting is not available in offline mode.</Text>
      </VStack>
    </Layout>
  );
}
