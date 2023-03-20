import { ImLeaf } from "react-icons/im";
import { ImLoop } from "react-icons/im";
import {
  Box,
  Text,
  Avatar,
  Divider,
  Flex,
  HStack,
  Heading,
  Image,
} from "@chakra-ui/react";

export function OfficialPost({ post }) {
  return (
    <Flex justify={"space-evenly"} direction={"column"}>
      <Flex bg="black" w="30vh" direction={"row"}>
        <Avatar size="md" src={post.profilePic} alt="Author" ml={3} mt={1} />
        <Box ml={4} mt={1} position="sticky">
          <HStack spacing={2} position="sticky" justifyContent={"flex-start"}>
            <Heading fontWeight={"bold"} size="sm">
              {post.username}
            </Heading>
            <Text fontWeight={"medium"} color="gray.500">
              ·
            </Text>
            <Text fontWeight={"medium"} size="sm" color="gray.500">
              {post.timestamp}
            </Text>
          </HStack>
        </Box>
      </Flex>

      <Flex
        direction={"column"}
        bg={"black"}
        justifyContent="center"
        textAlign={"flex-start"}
      >
        <Text
          fontWeight={"normal"}
          fontSize="sm"
          color="white"
          maxW={"20.5vw"}
          ml={24}
          mb={1}
        >
          {post.content}
        </Text>
        {post.media && post.media != "https://ipfs.io/ipfs/" ? (
          <Flex
            w={"80%"}
            h={"80%"}
            objectFit="contain"
            mt={5}
            bg={"black"}
            p={1}
            justify={"center"}
            ml={14}
          >
            <Image src={post.media} alt="Post image" borderRadius={10} />
          </Flex>
        ) : null}
      </Flex>
      <Flex ml={18} textColor="gray.500"></Flex>
      <Flex mt={2} mb={5} ml={18} textColor="gray.500">
        <HStack spacing={200} ml="160" mr="160">
          <ImLoop size={16} color={"gray.500"} />
          <ImLeaf size={16} color={"gray.500"} />
        </HStack>
      </Flex>

      <Divider
        orientation="horizontal"
        w="30vw"
        colorScheme="blackAlpha"
        borderWidth="0.2px"
      />
    </Flex>
  );
}
