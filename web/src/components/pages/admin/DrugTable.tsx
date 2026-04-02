import { observer } from "mobx-react-lite";
import { Box, Text } from "@chakra-ui/react";

export const DrugTable = observer(() => {
  return (
    <Box p={4}>
      <Text>Drug configuration is not available in offline mode.</Text>
    </Box>
  );
});
