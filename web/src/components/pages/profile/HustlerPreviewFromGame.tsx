import { observer } from "mobx-react-lite";

export const HustlerPreviewFromGame = observer(
  ({ gameId, tokenId, renderMode = 0, ...props }: { gameId: number; tokenId: number; renderMode?: number }) => {
    // Not available in offline mode - no blockchain game history
    return null;
  },
);
