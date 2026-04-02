import { Layout } from "@/components/layout";
import { useRouterContext } from "@/dojo/hooks";
import { Text, VStack, Button, Heading } from "@chakra-ui/react";

export default function History() {
  const { router } = useRouterContext();

  return (
    <Layout isSinglePanel={true} footer={<Button onClick={() => router.push("/")}>HOME</Button>}>
      <VStack w="full" p={6}>
        <Heading fontSize={["30px", "48px"]} fontWeight="400">
          History
        </Heading>
        <Text>Game history is not available in offline mode.</Text>
      </VStack>
    </Layout>
  );
}
