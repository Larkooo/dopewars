import { Layout } from "@/components/layout";
import { Heading, Text, VStack } from "@chakra-ui/react";

const SeasonPage = () => {
  return (
    <Layout isSinglePanel>
      <VStack h="full" justifyContent="center" alignItems="center">
        <Heading fontSize="24px" fontWeight="400">
          Seasons
        </Heading>
        <Text color="neon.500">Not available in offline mode</Text>
      </VStack>
    </Layout>
  );
};

export default SeasonPage;
