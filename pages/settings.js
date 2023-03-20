import { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { useSigner, useContract } from "wagmi";
import MIOCoreJSON from "../artifacts/contracts/MIOCore.sol/MIOCore.json";
import {
  useDisclosure,
  Flex,
  Divider,
  Heading,
  VStack,
  Box,
  Image,
  HStack,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { HomeNavBar } from "../components/LeftContainer/HomeNavBar.jsx";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { UserUpdate } from "../components/CenterContainer/UserUpdate.jsx";
import { RightBar } from "../components/RightContainer/RightWidget";

export default function Home() {
  const [userExists, setUserExists] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileBanner, setProfileBanner] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const { data: signer, isError, isLoading } = useSigner();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    address: process.env.NEXT_PUBLIC_MIOCORE_ADDRESS,
    abi: MIOCoreJSON.abi,
    signerOrProvider: signer,
  });

  //set bio and username

  let handleBioUpdate = async (_bio) => {
    try {
      setBio(_bio.target.value);
      console.log("Bio:", bio);
    } catch (e) {
      console.log("Error setting bio:", e);
    }
  };

  let handleProfileBannerAndPicUpdate = async (e) => {
    try {
      const ipfs = await IPFS();
      const file = e.target.files[0];
      console.log("File:", file);
      const added = await ipfs.add(file);
      const cid = added.path;
      console.log("URL:", cid);

      if (e.target.id === "profile-picture") {
        setProfilePicture(cid);
      } else if (e.target.id === "profile-banner") {
        setProfileBanner(cid);
      }
    } catch (e) {
      console.log("Error setting profile banner:", e);
    }
  };

  let onClickUpdate = async () => {
    try {
      const updateUser = await contract.updateUser(
        username,
        bio,
        profilePicture,
        profileBanner,
        {
          gasLimit: 1000000,
        }
      );
      console.log("Update user:", updateUser);
    } catch (e) {
      console.log("Error updating user:", e);
    }
  };

  useEffect(() => {
    const getSignerAddress = async () => {
      try {
        const address = await signer.getAddress();
        return address;
      } catch (e) {
        console.log("Error getting signer address:", e);
      }
    };

    //get user data from contract
    const getUserData = async () => {
      try {
        const address = await getSignerAddress();
        const user = await contract.getUser(address);
        if (user[0] !== "") {
          setUsername(user[0]);
        }
      } catch (e) {
        console.log("Error getting user data:", e);
      }
    };
    getUserData();
  }, [contract, onOpen, onClose, setUserExists, signer, userExists]);

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
            <HStack>
              <Link style={{ textDecoration: "none" }} href="/profile">
                <IconButton variant={"unstyled"}>
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <Flex>
                <VStack spacing={0.05}>
                  <Heading fontSize="xl" color="white" mt={2}>
                    {username}
                  </Heading>
                  <Flex w="100%" h="10%"></Flex>
                </VStack>
              </Flex>
            </HStack>

            <Divider orientation="horizontal" colorScheme="blackAlpha" />

            <Flex w="30vw" h="10vh" minW="100%" minH="20%" direction={"column"}>
              <UserUpdate
                username={username}
                bio={bio}
                profileBanner={profileBanner}
                profilePicture={profilePicture}
                setBio={setBio}
                setUsername={setUsername}
                setProfileBanner={setProfileBanner}
                setProfilePicture={setProfilePicture}
                handleBioUpdate={handleBioUpdate}
                handleProfileBannerAndPicUpdate={
                  handleProfileBannerAndPicUpdate
                }
                onClickUpdate={onClickUpdate}
              />
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
