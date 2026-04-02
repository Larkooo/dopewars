import CardAnim from "./CardAnim";
import Link from "next/link";
import { Box } from "@chakra-ui/react";

export default function HustlerItem({ token }: { token: any }) {
  const id = BigInt(token.token_id || "0");

  return (
    <Box display="flex" flexDirection="column">
      <Box position="relative">
        <Link href={`/dope/editor/${id}`}>
          {/* @ts-ignore  */}
          <CardAnim>
            <>
              {token.metadata && token.metadata.image !== "" ? (
                <img
                  className="aspect-square w-full mb-1"
                  src={token.metadata.image}
                  loading="lazy"
                  draggable="false"
                />
              ) : (
                <img className="aspect-square w-full mb-1" src="/public/images/dope-smiley.svg" draggable="false" />
              )}
            </>
          </CardAnim>
        </Link>
      </Box>
    </Box>
  );
}
