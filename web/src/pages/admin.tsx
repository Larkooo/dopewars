import { Layout } from "@/components/layout";
import { Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

const Admin = () => {
  return (
    <Layout isSinglePanel={true}>
      <VStack w="full" p={6}>
        <Text>Admin panel is not available in offline mode.</Text>
      </VStack>
    </Layout>
  );
};

export default observer(Admin);
