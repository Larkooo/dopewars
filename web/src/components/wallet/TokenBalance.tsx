import { HStack, Text } from "@chakra-ui/react";
import React from "react";

export const TokenBalance = ({ address, token, icon }: { address?: string; token?: string; icon?: React.FC }) => {
  // Offline mode - no token balance to display
  return (
    <HStack>
      {icon && icon({ width: "16px", height: "16px" })}
      <Text>0</Text>
    </HStack>
  );
};
