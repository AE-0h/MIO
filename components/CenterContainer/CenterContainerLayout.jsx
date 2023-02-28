import { Flex, Heading, Divider, Box, VStack } from "@chakra-ui/react";
import {OfficialPost} from "./OfficialPost.jsx";
import {CreatePostInput} from "./CreatePostInput.jsx";

export default function PageLayout() {
    return (
<Flex
bg="black"
w="30vw"
h="100vh"
minW="350px"
overflow={"scroll"}
>
<VStack
  w="100vw"
  position={"sticky"}
  justify="flex-start"
  align="flex-start"
>
  <Flex
    w="35vw"
    h="4vh"
    position="sticky"
    minW="350px"
    minH="50px"
    opacity={0.9}
    overflow={'hidden'}
    direction={"row"}
  >
    <Heading mt="4" ml="3" fontSize="xl" color="white">
      Home
    </Heading>
  </Flex>
  <Box>
    <CreatePostInput />
  </Box>
  <Divider
    orientation="horizontal"
    colorScheme="blackAlpha"
    borderWidth="0.2px"
  />
  <OfficialPost/>
  <Divider orientation="horizontal" colorScheme="blackAlpha" />

</VStack>
</Flex>
    );
}
