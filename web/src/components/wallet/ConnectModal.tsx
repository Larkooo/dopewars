import { useDojoContext } from "@/dojo/hooks";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useConnect } from "@starknet-react/core";
import { observer } from "mobx-react-lite";
import { walletInstallLinks, walletInstallLinksKeys } from "./StarknetProvider";
import { Cartridge } from "../icons/branding/Cartridge";
import { ExternalLink } from "../icons";

export const ConnectModal = observer(() => {
  const { connect, connectors } = useConnect();
  const { uiStore } = useDojoContext();

  const onClose = () => {
    uiStore.closeConnectModal();
  };

  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={uiStore.modals.connect !== undefined} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="bg.dark">
        <ModalHeader fontSize="16px" textAlign="center" pb={0}>
          Connect a Wallet
        </ModalHeader>
        <ModalBody p={3}>
          <VStack w="full">
            {connectors.map((connector) => {
              return (
                <HStack w="full" key={connector.id}>
                  <Button
                    variant="pixelated"
                    w="full"
                    fontSize="14px"
                    onClick={() => {
                      if (connector.available()) {
                        connect({ connector });
                      } else {
                        window.open(walletInstallLinks[connector.id as walletInstallLinksKeys], "_blank");
                      }
                      onClose();
                    }}
                  >
                    <HStack w="full" alignItems="center" justifyContent="center" gap={3}>
                      <HStack>
                        <Cartridge />
                        <Text>{connector.available() ? `${connector.name}` : `Install ${connector.name}`}</Text>
                        {!connector.available() && <ExternalLink ml="auto" />}
                      </HStack>
                    </HStack>
                  </Button>
                </HStack>
              );
            })}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
