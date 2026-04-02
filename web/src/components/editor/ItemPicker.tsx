import { useState } from "react";
import { Close, PaperIcon } from "../icons";
import {
  Badge,
  Box,
  Flex,
  Image,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

export interface ParsedToken {
  token_id: string;
  metadata: {
    name?: string;
    image?: string;
    attributes?: { value: string }[];
  };
}

export function ItemPicker({
  title,
  selected,
  setSelected,
  variant = "Image",
}: {
  title?: string;
  collection?: string;
  account?: any;
  selected?: ParsedToken;
  equipped?: ParsedToken;
  setSelected?: (e?: ParsedToken) => void;
  itemFilter?: (e?: ParsedToken) => boolean;
  variant?: string;
}) {
  const [open, setOpen] = useState(false);

  const onSelect = (item?: ParsedToken) => {
    setSelected && setSelected(item);
    setOpen(false);
  };

  return (
    <>
      {variant === "Image" && (
        <Flex flexDirection="column" gap={1} alignItems="center" cursor="pointer" onClick={() => setOpen(true)}>
          {selected && (
            <Image w="120px" h="120px" src={selected.metadata?.image} />
          )}
          {!selected && (
            <Flex
              alignItems="center"
              justifyContent="center"
              bg="#888"
              w="120px"
              h="120px"
            >
              <PaperIcon width="40px" height="40px" />
            </Flex>
          )}
          <Badge>{title}</Badge>
        </Flex>
      )}

      {variant === "List" && (
        <Flex flexDirection="row" gap={1} alignItems="center" cursor="pointer" onClick={() => setOpen(true)}>
          <Badge minW="80px" justifyContent="center">
            {title}
          </Badge>
          {selected && <Text>{selected.metadata.name}</Text>}
          {!selected && <Text className="opacity-25">None</Text>}
        </Flex>
      )}

      <Modal motionPreset="slideInBottom" isCentered isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay />
        <ModalContent bg="bg.dark">
          <ModalHeader textAlign="center" textTransform="uppercase" pb={0}>
            {title}
          </ModalHeader>
          <ModalBody>
            <List minH="420px" maxH="420px" overflowY="scroll" w="full">
              <ListItem display="flex" flexDirection="row" justifyContent="center">
                Items not available in offline mode
              </ListItem>
            </List>
            <Box
              cursor="pointer"
              display="flex"
              flexDirection="row"
              gap={2}
              alignItems="center"
              justifyContent="center"
              py={1}
              mt={3}
              onClick={() => onSelect(undefined)}
              opacity={selected ? 1 : 0.25}
            >
              <Close /> UNEQUIP
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
