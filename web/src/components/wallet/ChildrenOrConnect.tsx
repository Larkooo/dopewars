import { ReactNode } from "react";
import { StyleProps } from "@chakra-ui/react";

export const ChildrenOrConnect = ({ children, ...props }: { variant?: string; children: ReactNode } & StyleProps) => {
  // Offline mode - always show children (always "connected")
  return <>{children}</>;
};
