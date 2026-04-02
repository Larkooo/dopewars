import { useState } from "react";

export const useERC721 = (_opts?: any) => {
  const [isLoading] = useState(false);
  const [isSuccess] = useState(false);

  const transfer = async (_id: number, _recipient: string) => {
    // Not available in offline mode
  };

  return { transfer, isLoading, isSuccess };
};
