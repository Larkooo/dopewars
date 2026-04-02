import { Layout } from "@/components/layout";
import { Text, VStack } from "@chakra-ui/react";

export default function Dope() {
  return (
    <Layout isSinglePanel>
      <VStack w="full" p={6}>
        <Text>Dope collections are not available in offline mode.</Text>
      </VStack>
    </Layout>
  );
}
