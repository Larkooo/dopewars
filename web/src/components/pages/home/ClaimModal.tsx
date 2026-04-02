import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text, VStack } from "@chakra-ui/react";

export const ClaimModal = ({
  isOpen,
  onClose,
}: {
  claimable?: any;
  claimableData?: any[];
  isOpen: boolean;
  onClose: Function;
}) => {
  return (
    <Modal motionPreset="slideInBottom" isCentered isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent bg="bg.dark">
        <ModalHeader textAlign="center" pb={0}>
          CLAIM REWARDS
        </ModalHeader>
        <ModalBody py={6}>
          <VStack w="full" gap={6}>
            <Text textAlign="center" color="neon.500">
              Claiming rewards is not available in offline mode.
            </Text>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
