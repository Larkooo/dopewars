import { ExternalLink } from "@/components/icons";
import { useControllerUsername, useDojoContext } from "@/dojo/hooks";
import { frenlyAddress } from "@/utils/ui";
import { Button, HStack, Link, Modal, ModalBody, ModalContent, ModalOverlay, Text, VStack } from "@chakra-ui/react";
import { useAccount, useDisconnect, useExplorer } from "@starknet-react/core";
import { observer } from "mobx-react-lite";

export const AccountDetailsModal = observer(() => {
  const explorer = useExplorer();
  const { disconnect } = useDisconnect();
  const { account, address } = useAccount();
  const { uiStore } = useDojoContext();
  const { username, isController } = useControllerUsername(address as string);

  const onClose = () => {
    uiStore.closeAccountDetails();
  };

  return (
    <Modal
      motionPreset="slideInBottom"
      isCentered
      isOpen={uiStore.modals.accountDetails !== undefined}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent bg="bg.dark" maxW="360px">
        <ModalBody p={6}>
          <VStack w="full" gap={6}>
            <VStack w="full" gap={1}>
              {isController && <Text>{username}</Text>}

              <Link
                fontSize="18px"
                textDecoration="none"
                textTransform="uppercase"
                isExternal
                href={explorer.contract(account?.address || "")}
              >
                <>
                  {frenlyAddress(account?.address || "")}
                  <ExternalLink />
                </>
              </Link>
            </VStack>

            <HStack w="full" justifyContent="center">
              <Button w="full" display="flex" flexDirection="column" justifyContent="center" onClick={onClose}>
                CLOSE
              </Button>
              <Button
                w="full"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                onClick={() => {
                  disconnect();
                  onClose();
                }}
              >
                DISCONNECT
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});
