import { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { useSigner, useContract } from "wagmi";
import MIOCoreJSON from "../artifacts/contracts/MIOCore.sol/MIOCore.json";
import { UserSignUpModal } from "../components/UserSignUpModal.jsx";
import {
  useDisclosure,
  Flex,
  Divider,
  Heading,
  VStack,
  Avatar,
  Text,
  Button,
  HStack,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import { HomeNavBar } from "../components/LeftContainer/HomeNavBar.jsx";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OfficialPost } from "../components/CenterContainer/OfficialPost.jsx";
import { RightBar } from "../components/RightContainer/RightWidget";

export default function Home() {
  const [userExists, setUserExists] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileBanner, setProfileBanner] = useState(null);
  const { data: signer, isError, isLoading } = useSigner();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState(null);

  async function IPFS() {
    const projectId = process.env.NEXT_PUBLIC_IPFS_ID;
    const projectSecret = process.env.NEXT_PUBLIC_IPFS_SECRET;

    const auth =
      "Basic " +
      Buffer.from(projectId + ":" + projectSecret).toString("base64");

    const ipfsConnect = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
      headers: {
        authorization: auth,
      },
    });
    return ipfsConnect;
  }

  let contract = useContract({
    address: "0xEE6271a9d92fC69F1E910013CdD6da168711c429",
    abi: MIOCoreJSON.abi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    const getSignerAddress = async () => {
      try {
        const address = await signer.getAddress();
        return address;
      } catch (e) {
        console.log("Error getting signer address:", e);
      }
    };
    let userCheck = async () => {
      let addr = await getSignerAddress();
      try {
        let m = await contract?.checkUserExists(addr);
        return m;
      } catch (e) {
        console.log(e + "userCheck");
        return false;
      }
    };

    const getUserStatus = async () => {
      const userStatus = await userCheck();
      if (userStatus !== undefined) {
        try {
          if (userStatus !== false) {
            setUserExists(true);
          } else {
            setUserExists(false);
            onOpen();
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    const getUsersInfo = async () => {
      let addr = await getSignerAddress();
      const ipfsCli = await IPFS();
      try {
        const user = await contract.getUser(addr, {
          gasLimit: 1000000,
        });
        console.log(user);
        let username = await user[0];
        let bio = await user[1];
        let cidPP = await user[2];
        let cidPB = await user[3];
        let cidURLPB = `https://ipfs.io/ipfs/${cidPB}`;
        let cidURLPP = `https://ipfs.io/ipfs/${cidPP}`;
        setUsername(username);
        setAvatar(cidURLPP);
        setProfileBanner(cidURLPB);
        setBio(bio);
      } catch (e) {
        console.error("Failed to get profile picture from IPFS.", e);
      }
    };

    const getPosts = async () => {
      //get signer address
      let addr = await getSignerAddress();
      try {
        const allMioPosts = await contract.getAllUserMioPosts(addr, {
          gasLimit: 1000000,
        });
        let _posts = [];
        for (let i = 0; i < allMioPosts.length; i++) {
          let post = allMioPosts[i];
          let mediaCID = await post.media;
          let cidURL = `https://ipfs.io/ipfs/${mediaCID}`;
          let author = await post.author;
          let postAuthorUsername = await contract.getUser(author, {
            gasLimit: 1000000,
          });
          let postAuthorProfilePicture = await postAuthorUsername[2];
          let postAuthorProfilePictureURL = `https://ipfs.io/ipfs/${postAuthorProfilePicture}`;

          let postObj = {
            profilePic: postAuthorProfilePictureURL,
            username: postAuthorUsername[0],
            media: cidURL,
            content: post.content,
          };
          _posts.push(postObj);
        }
        let mostRecentArr = await _posts.reverse();
        setPosts(mostRecentArr);
      } catch (e) {
        console.error("Failed to get profile picture from IPFS.", e);
      }
    };
    getPosts();
    getUserStatus();
    getUsersInfo();
  }, [contract, onOpen, onClose, setUserExists, signer, userExists, posts]);

  return (
    <>
      <Flex justify={"space-evenly"} bg={"black"}>
        <Flex bg="black" w="34vw" h="100vh" minW="20vh" direction={"column"}>
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
        <Flex bg="black" w="30vw" h="100vh" maxW="29vw" overflow={"scroll"}>
          <VStack
            position={"sticky"}
            justify="flex-start"
            align="flex-start"
            spacing={1}
          >
            <Flex
              w="28vw"
              h="5vh"
              position="sticky"
              minW="28vw"
              minH="5vh"
              maxW="28vw"
              maxH="5vh"
              opacity={0.9}
              overflow={"hidden"}
              direction={"row"}
              justify={"flex-start"}
              align={"flex-start"}
            >
              <HStack spacing={5}>
                <Link style={{ textDecoration: "none" }} href="/home">
                  <IconButton variant={"unstyled"}>
                    <ArrowBackIcon />
                  </IconButton>
                </Link>
                <Flex>
                  <VStack spacing={0.05}>
                    <Heading fontSize="xl" color="white" mt={2}>
                      {username}
                    </Heading>
                    <Flex w="100%" h="10%">
                      <Text fontSize="xs" color="gray.500">
                        {posts.length} Posts
                      </Text>
                    </Flex>
                  </VStack>
                </Flex>
              </HStack>
            </Flex>
            <Flex
              w="30vw"
              h="5vh"
              minW="100%"
              minH="15%"
              direction={"column"}
              justify={"flex-start"}
              align={"flex-start"}
              backgroundImage={profileBanner}
              backgroundSize={"cover"}
              backgroundPosition={"center"}
              objectFit={"cover"}
            >
              <Avatar
                size="2xl"
                src={avatar}
                alt="Author"
                ml={3}
                mt={100}
                borderWidth="3px"
              />
              <Link style={{ textDecoration: "none" }} href="/settings">
                <Button
                  colorScheme={"ghost"}
                  size="md"
                  p={3}
                  color={"white"}
                  variant={"outline"}
                  borderWidth={1}
                  borderRadius={"3xl"}
                  borderColor={"gray.500"}
                  ml={428}
                  mt={-19}
                >
                  Edit Profile
                </Button>
              </Link>
              <Flex p={2} direction={"column"}>
                <Heading fontSize="xl" color="white" ml={2}>
                  {username}
                </Heading>
              </Flex>
              <Flex p={2}>
                <Text
                  fontSize="md"
                  color="white.300"
                  ml={2}
                  mt={-3}
                  mr={1}
                  maxW={"30vw"}
                >
                  {bio}
                </Text>
              </Flex>
              <Divider orientation="horizontal" colorScheme="blackAlpha" />
              {/* <Flex p={2} direction={"row"} mt={1}>
                <Text
                  fontSize="sm"
                  color="white.300"
                  ml={2}
                  mt={-3}
                  mr={1}
                  maxW={"30vw"}
                  fontWeight={"bold"}
                >
                  30
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  mt={-3}
                  mr={1}
                  maxW={"30vw"}
                  fontWeight={"normal"}
                >
                  Following
                </Text>
                <Text
                  fontSize="sm"
                  color="white.300"
                  ml={2}
                  mt={-3}
                  mr={1}
                  maxW={"30vw"}
                  fontWeight={"bold"}
                >
                  202
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  mt={-3}
                  mr={1}
                  maxW={"30vw"}
                  fontWeight={"normal"}
                >
                  Subscribers
                </Text>
              </Flex> */}
            </Flex>
            <Flex
              w="30vw"
              h="10vh"
              minW="100%"
              minH="20%"
              direction={"column"}
              pt={200}
            >
              {posts.map((post, index) => (
                <OfficialPost key={index} post={post} />
              ))}
            </Flex>
          </VStack>
          <Divider orientation="horizontal" colorScheme="blackAlpha" />
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
            h="100%"
            justify={"flex-start"}
            align={"flex-start"}
          >
            <RightBar />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
