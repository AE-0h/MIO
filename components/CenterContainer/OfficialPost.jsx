
import {
  Box,
  Text,
  Avatar,
  Divider,
  Flex,
  HStack,
  Heading,
} from "@chakra-ui/react";

export function OfficialPost() {
  return (
    <Flex justify={"space-evenly"} direction={"column"}>
      <Flex bg="black" w="30vh" h="3vh" direction={"row"}>
        <Avatar size="md" src={"./MIOICO.png"} alt="Author" ml={3} mt={1} />
        <Box ml={4} mt={1} mb={-1} position="sticky">
          <HStack spacing={2} position="sticky" justifyContent={"flex-start"}>
            <Heading fontWeight={"bold"} size="sm">
              Ae0h 🧮 ⛓
            </Heading>
            <Text fontWeight={"medium"} size="sm" color="gray.500">
              @BYZ.SOL
            </Text>
            <Text fontWeight={"medium"} color="gray.500">
              ·
            </Text>
            <Text fontWeight={"medium"} size="sm" color="gray.500">
              1h
            </Text>
          </HStack>
        </Box>
      </Flex>

      <Flex
        w="80%"
        h="7vh"
        direction={"row"}
        bg={"black"}
        justifyContent="flex-start"
        textAlign={"flex-start"}
        ml={76}
        mb={-2}
      >
        <Text
          fontWeight={"normal"}
          fontSize="sm"
          color="white"
          maxW={"20.5vw"}
          mb={-2}
        >
          My first Twit Dummy, when you realize your the only twit in the
          room... ha ha.... ha
        </Text>
      </Flex>
      <Flex mb={2} ml={18} textColor="gray.500">
      </Flex>

      <Divider
        orientation="horizontal"
        w="100vh"
        colorScheme="blackAlpha"
        borderWidth="0.2px"
      />
    </Flex>
  );
}