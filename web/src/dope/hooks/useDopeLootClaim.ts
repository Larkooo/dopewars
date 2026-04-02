import { useState } from "react";

export const useDopeLootClaim = (_opts?: any) => {
  const [isLoading] = useState(false);
  const [isSuccess] = useState(false);

  const onOpen = async (_id: number) => {
    // Not available in offline mode
  };

  const onRelease = async (_id: number, _dwGameId: number) => {
    // Not available in offline mode
  };

  return { onOpen, onRelease, isLoading, isSuccess };
};
