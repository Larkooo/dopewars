import { useState } from "react";
import { defaultHustlerMetadata, HustlerBody, HustlerMetadata } from "../components";

export const useHustler = (_toriiClient: any, _tokenId: number) => {
  const [hustlerBody, setHustlerBody] = useState<HustlerBody>({});
  const [hustlerMeta, setHustlerMeta] = useState<HustlerMetadata>(defaultHustlerMetadata);
  const [isLoaded] = useState(false);

  // Not available in offline mode - no blockchain hustler data
  return { hustlerBody, hustlerMeta, setHustlerBody, setHustlerMeta, isLoaded };
};
