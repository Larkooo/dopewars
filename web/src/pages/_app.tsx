import { LoadingModal, MakeItRain, QuitGameModal, RefreshGameModal } from "@/components/layout";
import { AccountDetailsModal, ConnectModal } from "@/components/wallet";
import { DojoContextProvider } from "@/dojo/context/DojoContext";
import useKonamiCode, { starkpimpSequence } from "@/hooks/useKonamiCode";
import Fonts from "@/theme/fonts";
import GlobalStyles from "@/theme/global";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import { useEffect } from "react";
import theme from "../theme";

// should avoid mobx memory leaks / GC issue..
import { enableStaticRendering } from "mobx-react-lite";
enableStaticRendering(typeof window === "undefined");

import { Toaster } from "react-hot-toast";
import { Psycadelic } from "@/components/common/Psycadelic";

export default function App({ Component, pageProps }: AppProps) {
  const { setSequence, isRightSequence, setIsRightSequence } = useKonamiCode(starkpimpSequence);

  useEffect(() => {
    if (isRightSequence) {
      setTimeout(() => {
        isRightSequence && setIsRightSequence(false);
        setSequence([]);
      }, 20_000);
    }
  }, [isRightSequence, setIsRightSequence, setSequence]);

  return (
    <>
      <ChakraProvider theme={theme}>
        <DojoContextProvider>
          <Fonts />
          <GlobalStyles />
          <NextHead>
            <title>Dope Wars</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
          </NextHead>
          {isRightSequence && <MakeItRain />}
          <Psycadelic />
          <Component {...pageProps} />

          <ConnectModal />
          <AccountDetailsModal />
          <QuitGameModal />
          <RefreshGameModal />

          <Toaster
            gutter={0}
            containerStyle={{
              inset: 0,
            }}
          />
        </DojoContextProvider>
      </ChakraProvider>
    </>
  );
}
