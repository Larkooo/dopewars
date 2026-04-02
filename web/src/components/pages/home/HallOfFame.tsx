import { Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

export const HallOfFame = observer(() => {
  return (
    <VStack
      boxSize="full"
      maxH={["calc(100dvh - 320px)", "calc(100dvh - 380px)"]}
      sx={{
        overflowY: "scroll",
      }}
      __css={{
        "scrollbar-width": "none",
      }}
    >
      <Text textAlign="center" color="neon.500" mt={8}>
        Hall of Fame not available in offline mode
      </Text>
    </VStack>
  );
});
