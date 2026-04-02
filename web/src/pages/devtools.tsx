import { Layout } from "@/components/layout";
import { Text, VStack } from "@chakra-ui/react";

export default function DevtoolsPage() {
  return (
    <Layout isSinglePanel>
      <VStack w="full" p={6}>
        <Text>Devtools are not available in offline mode.</Text>
      </VStack>
    </Layout>
  );
}
