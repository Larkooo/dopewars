import { useState } from "react";

export type HustlerSlot = {
  token_id: bigint;
  slot: string;
  gear_item_id?: bigint;
};

export const useEquipment = (_toriiClient: any, _tokenId: string) => {
  const [equipment] = useState<undefined | HustlerSlot[]>(undefined);

  // Not available in offline mode - no blockchain equipment data
  return {
    equipment,
  };
};
