import {
    Button,
    HStack,
    Link,
    Spacer,
    Heading,
    Divider,
    Box,
    Input,
    VStack,
    Text,
    Avatar,
    Flex,
  } from "@chakra-ui/react";
  import { SearchIcon } from "@chakra-ui/icons";
  
  export function RightBar() {
    return (
      <VStack spacing={4} ml={6}>
        <Box
          w="30vh"
          bg="gray.800"
          color="white"
          p={4}
          mt={4}
          ml={0}
          borderRadius="2xl"
          boxShadow="lg"
        >
          <Heading fontSize="xl">BIG MINT DROPS</Heading>
          <Divider orientation="horizontal" mb={2} mt={2} />
          <VStack justify={"flex-start"} align={"flex-start"}>
            <HStack>
              <Text fontSize="xs" color="gray.500">
                1 hour ago
              </Text>
            </HStack>
            <Heading fontSize="md">Karl vs ShakeMAn</Heading>
          </VStack>
          <Spacer />
          <Divider orientation="horizontal" mb={2} mt={2} />
          <VStack justify={"flex-start"} align={"flex-start"}>
            <HStack>
              <Text fontSize="xs" color="gray.500">
                22 hours ago
              </Text>
            </HStack>
            <Heading fontSize="md">ElonCRYINGALONE</Heading>
          </VStack>
          <Spacer />
          <Divider orientation="horizontal" mb={2} mt={2} />
        </Box>
        <Box
          w="30vh"
          bg="gray.800"
          color="white"
          p={4}
          mt={4}
          ml={8}
        
          borderRadius="2xl"
          boxShadow="lg"
        >
          <Heading fontSize="xl">MOST RECENT MEMBERS</Heading>
          <Divider orientation="horizontal" mb={2} mt={2} />
          <HStack>
            <Avatar src={"./sky.jpeg"} />
            <VStack>
              <Heading fontSize="md">Karl</Heading>
            </VStack>
            <Spacer />
          </HStack>
          <Divider orientation="horizontal" mb={2} mt={2} />
          <HStack>
            <Avatar src={"./moonites.png"} />
            <VStack>
              <Heading fontSize="md">Moonites</Heading>
            </VStack>
            <Spacer />
          </HStack>
        </Box>
        <HStack style={{ textDecoration: "" }} mb={30}>
          <Link style={{ textDecoration: "" }}>
            <Text fontSize="sm" color="gray.500">
              Terms of Service
            </Text>
          </Link>
          <Link style={{ textDecoration: "none" }}>
            <Text fontSize="sm" color="gray.500">
              Privacy Policy
            </Text>
          </Link>
          <Link style={{ textDecoration: "none" }}>
            <Text fontSize="sm" color="gray.500">
              {" "}
              ©BYZ.SOL llc
            </Text>
          </Link>
        </HStack>
      </VStack>
    );
  }
  