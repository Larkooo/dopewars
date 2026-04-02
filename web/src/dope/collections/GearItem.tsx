import CardAnim from "./CardAnim";
import { Box } from "@chakra-ui/react";

export default function GearItem({ token, balance }: { token: any; balance?: number }) {
  const id = BigInt(token.token_id || "0");

  return (
    <Box position="relative">
      {/* @ts-ignore */}
      <CardAnim>
        <Box position="relative">
          {token.metadata && token.metadata.image !== "" ? (
            <img className="aspect-square w-full mb-1" src={token.metadata.image} loading="lazy" draggable="false" />
          ) : (
            <img className="aspect-square w-full mb-1" src="/public/images/dope-smiley.svg" draggable="false" />
          )}
        </Box>
        <Box position="absolute" bottom={1} right={1} bg="#66666666" p={1}>
          x{balance}
        </Box>
      </CardAnim>

      <Box className="flex flex-row gap-1 items-center justify-between">
        <div className="text-xs">#{id.toString()}</div>
        <div>
          {token.name} {token.symbol}
        </div>
      </Box>
    </Box>
  );
}
