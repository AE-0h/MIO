
import {
    Flex,
    Heading,
    Divider,
    Text,
    AspectRatio,
    Box,
    BoxProps,
    Container,
    forwardRef,
    Input,
    Stack,
  } from "@chakra-ui/react";
  import { motion, useAnimation } from "framer-motion";
  import { RightBar } from "../RightContainer/RightWidget.jsx";
  import { HomeNavBar } from "../LeftContainer/HomeNavBar.jsx";
import { ConnectButton } from "@rainbow-me/rainbowkit";
  
  export default function SettingsLayout() {
    const controls = useAnimation();
    const startAnimation = () => controls.start("hover");
    const stopAnimation = () => controls.stop();
    return (
      <Flex justify={"space-evenly"}>
       <Flex bg="black" w="35vw" h="100vh" minW="20vh" direction={"column"}>
          <Flex bg="black" w="100%" h="90%">
            <HomeNavBar />
          </Flex>
          <Flex bg="black" w="100%" h="10%" justify={"end"} pr={20}>
            <ConnectButton
              chainStatus="none"
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              showBalance={false}
            />
          </Flex>
        </Flex>
        <Divider
          orientation="vertical"
          h="100vh"
          colorScheme="blackAlpha"
          borderWidth="0.2px"
        />
        <Flex  bg="black" w="30vw" h="100vh" direction={"column"} align={'center'}>
          <Heading fontSize="lg" fontWeight={'thin'} color="white"mt={10} mb={2}>Edit Profile Description</Heading>
          <Input w={'75%'} h={'8vh'} bg={'gray.800'} color={'white'} placeholder={'Enter your description here'} textAlign={'center'} mb={4}></Input>
          <Heading fontSize="lg" fontWeight={'thin'} color="white"mt={4} mb={4}>Edit Profile Picture</Heading>
          <AspectRatio width="75%" ratio={2} bg={'gray.800'} mb={4}>
            <Box
              borderColor="gray.500"
              borderStyle="dashed"
              borderWidth="2px"
              rounded="md"
              shadow="sm"
              role="group"
              transition="all 150ms ease-in-out"
              _hover={{
                shadow: "md",
              }}
              as={motion.div}
              initial="rest"
              animate="rest"
              whileHover="hover"
            >
              <Box position="relative" height="100%" width="100%">
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  height="100%"
                  width="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <Stack
                    height="100%"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justify="center"
                    spacing="4"
                  >
                    <Stack p="8" textAlign="center" spacing="1">
                      <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                        Drop images here
                      </Heading>
                      <Text fontWeight="light">or click to upload</Text>
                    </Stack>
                  </Stack>
                </Box>
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  aria-hidden="true"
                  accept="image/*"
                  onDragEnter={startAnimation}
                  onDragLeave={stopAnimation}
                />
              </Box>
            </Box>
          </AspectRatio>
          <Heading fontSize="lg" fontWeight={'thin'} color="white"mt={4} mb={4}>Edit Profile Banner</Heading>
          <AspectRatio width="75%" ratio={2} bg={'gray.800'} mb={4}>
            <Box
              borderColor="gray.500"
              borderStyle="dashed"
              borderWidth="2px"
              rounded="md"
              shadow="sm"
              role="group"
              transition="all 150ms ease-in-out"
              _hover={{
                shadow: "md",
              }}
              as={motion.div}
              initial="rest"
              animate="rest"
              whileHover="hover"
            >
              <Box position="relative" height="100%" width="100%">
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  height="100%"
                  width="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <Stack
                    height="100%"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    justify="center"
                    spacing="4"
                  >
                    <Stack p="8" textAlign="center" spacing="1">
                      <Heading fontSize="lg" color="gray.700" fontWeight="bold">
                        Drop images here
                      </Heading>
                      <Text fontWeight="light">or click to upload</Text>
                    </Stack>
                  </Stack>
                </Box>
                <Input
                  type="file"
                  height="100%"
                  width="100%"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  aria-hidden="true"
                  accept="image/*"
                  onDragEnter={startAnimation}
                  onDragLeave={stopAnimation}
                />
              </Box>
            </Box>
          </AspectRatio>
        </Flex>
        <Divider
          orientation="vertical"
          h="100vh"
          colorScheme="blackAlpha"
          borderWidth="0.2px"
        />
        <Flex w="37.555555vw" h="100vh" direction={"column"}>
          <Flex
            bg="black"
            w="100%"
            h="95%"
            justify={"flex-start"}
            align={"flex-start"}
          >
            <RightBar />
          </Flex>
          <Flex
            bg="black"
            w="100%"
            h="5%"
            justify={"flex-end"}
            align={"flex-end"}
          >
         
          </Flex>
        </Flex>
      </Flex>
    );
  }
  