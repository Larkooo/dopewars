import { Button } from "@/components/common";
import { Layout } from "@/components/layout";
import { useRouterContext } from "@/dojo/hooks";
import { Text, VStack } from "@chakra-ui/react";

export default function SeasonIndex() {
  const { router } = useRouterContext();

  return (
    <Layout
      leftPanelProps={{
        prefixTitle: "Dope Wars",
        title: "Seasons",
        imageSrc: "/images/landing/main.png",
      }}
      footer={<Button onClick={() => router.push("/")}>HOME</Button>}
    >
      <VStack w="full" p={6}>
        <Text>Seasons are not available in offline mode.</Text>
      </VStack>
    </Layout>
  );
}
