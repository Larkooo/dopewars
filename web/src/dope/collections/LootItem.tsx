import CardAnim from "./CardAnim";
import { Box, GridItem } from "@chakra-ui/react";

export default function LootItem({ token }: { token: any }) {
  return (
    // @ts-ignore
    <CardAnim>
      <GridItem className="cursor-pointer" border="solid 1px" borderColor="neon.700">
        <img
          className="aspect-square w-full pointer-events-none select-none"
          src={token.metadata?.image}
          loading="lazy"
          draggable="false"
        />
      </GridItem>
    </CardAnim>
  );
}
