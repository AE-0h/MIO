import Image from "next/image";
import { useState } from "react";
import {
  Flex,
  HStack,
  Link,
  Heading,
  Box,
  VStack,
  useDisclosure,
  Stack,
} from "@chakra-ui/react";
import { ImHome3 } from "react-icons/im";
import { ImUser } from "react-icons/im";
import { ImCog } from "react-icons/im";
import { ImQuill } from "react-icons/im";
import { ImBinoculars } from "react-icons/im";
import { ImOffice } from "react-icons/im";

export function HomeNavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [value, setValue] = useState("");
  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };
  return (
    <Stack justify={"end"} align={"end"} w="100%" overflow={"hidden"}>
      <Flex
        justify="space-between"
        height="100%"
        width="100%"
        direction="column"
      >
        <VStack width={"100%"} ml={190} mr={-200}>
          <Link href="/home" mb={10} mt={1} ml={-98} mr={1}>
            <HStack spacing={5}>
              <Image width={70} height={70} src="/MIOICO.png" alt="MIO Logo" />
            </HStack>
          </Link>
          <Link style={{ textDecoration: "none" }} href="/home">
            <HStack marginTop={2} marginBottom={2} mr={14}>
              <Box boxSize={"medium"} mr={3}>
                <ImHome3 size={30} />
              </Box>
              <Heading fontWeight="light" variant="none" size="md">
                Home
              </Heading>
            </HStack>
          </Link>
          <Link style={{ textDecoration: "none" }} href="/profile">
            <HStack spacing={5} marginTop={1} marginBottom={5} mr={14}>
              <ImUser size={30} />
              <Heading fontWeight="light" variant="none" size="md">
                Profile
              </Heading>
            </HStack>
          </Link>
          <Link style={{ textDecoration: "none" }} href="/explorer">
            <HStack spacing={5} ml={3} marginTop={1} marginBottom={2} mr={14}>
              <ImBinoculars size={30} />
              <Heading fontWeight="light" variant="none" size="md">
                Explore
              </Heading>
            </HStack>
          </Link>
          <Link style={{ textDecoration: "none" }} href="/artFactory">
            <HStack spacing={5} ml={5} marginTop={5} marginBottom={3} mr={6}>
              <ImOffice size={30} />
              <Heading fontWeight="light" variant="none" size="md">
                The Factory
              </Heading>
            </HStack>
          </Link>
          <Link style={{ textDecoration: "none" }} href="/settings">
            <HStack spacing={5} ml={5} marginTop={3} marginBottom={49} mr={14}>
              <ImCog size={30} />
              <Heading fontWeight="light" variant="none" size="md">
                Settings
              </Heading>
            </HStack>
          </Link>
        </VStack>
      </Flex>
    </Stack>
  );
}
