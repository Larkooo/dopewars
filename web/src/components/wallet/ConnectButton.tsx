import { useDojoContext } from "@/dojo/hooks";
import { Box, Button, HStack, Text } from "@chakra-ui/react";

export const ConnectButton = ({ variant = "pixelated", ...props }) => {
  const { uiStore } = useDojoContext();

  return (
    <Box display="flex" alignItems="center" justifyContent="center" {...props}>
      <Button
        variant={variant}
        h={["40px", "48px"]}
        fontSize="14px"
        w="full"
        alignItems="center"
        justifyContent="center"
        cursor="default"
      >
        <HStack>
          <Text>Offline</Text>
        </HStack>
      </Button>
    </Box>
  );
};

export const ConnectButtonMobile = ({ ...props }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" {...props}>
      <HStack w="full">
        <Text>Offline</Text>
      </HStack>
    </Box>
  );
};
