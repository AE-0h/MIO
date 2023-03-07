import { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { useSigner, useContract } from "wagmi";
import MIOCoreJSON from "../artifacts/contracts/MIOCore.sol/MIOCore.json";
import { UserSignUpModal } from "../components/UserSignUpModal.jsx";
import {
  useDisclosure,
  Flex,
  Divider,
  Box,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { HomeNavBar } from "../components/LeftContainer/HomeNavBar.jsx";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CreatePostInput } from "../components/CenterContainer/CreatePostInput.jsx";
import { OfficialPost } from "../components/CenterContainer/OfficialPost.jsx";
import { RightBar } from "../components/RightContainer/RightWidget";
import axios, { Axios } from "axios";

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
        console.log("Signer Address:", address);
        return address;
      } catch (e) {
        console.log("Error getting signer address:", e);
      }
    };
    let userCheck = async () => {
      let addr = await getSignerAddress();
      console.log(addr + "userCheck");
      try {
        let m = await contract?.checkUserExists(addr);
        console.log(m + "userCheck");
        return m;
      } catch (e) {
        console.log(e + "userCheck");
        return false;
      }
    };

    const getUserStatus = async () => {
      const userStatus = await userCheck();
      console.log(userStatus + "userStatus");
      if (userStatus !== undefined) {
        try {
          if (userStatus !== false) {
            setUserExists(true);
            console.log("user exists");
          } else {
            setUserExists(false);
            console.log("user does not exist");
            onOpen();
          }
        } catch (e) {
          console.log(e);
        }
      }
    };

    const getUsersProfilePicture = async () => {
      let addr = await getSignerAddress();
      const ipfsCli = await IPFS();
      try {
        const user = await contract.getUser(addr, {
          gasLimit: 1000000,
        });
        console.log(user);

        let cid = await user[2];
        let cidURL = `https://ipfs.io/ipfs/${cid}`;
        setAvatar(cidURL);
      } catch (e) {
        console.error("Failed to get profile picture from IPFS.", e);
      }
    };

    const getPosts = async () => {
      const ipfsCli = await IPFS();
      let addr = await getSignerAddress();
      try {
        const allMioPosts = await contract.getAllMioPosts({
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
    getUsersProfilePicture();
  }, [contract, onOpen, onClose, setUserExists, signer, userExists, posts]);

  const handleSignUp = async () => {
    let _ipfs = await IPFS();

    try {
      // Upload profile picture to IPFS
      const profilePictureCid = await _ipfs.add(profilePicture);
      // Upload profile banner to IPFS
      const profileBannerCid = await _ipfs.add(profileBanner);
      let ppCID = profilePictureCid.cid.toString();
      let pbCID = profileBannerCid.cid.toString();
      const tx = await contract?.createUser(
        await username,
        await bio,
        ppCID,
        pbCID,
        {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 1000000,
        }
      );
      await tx.wait();
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      {!userExists && (
        <UserSignUpModal
          isOpen={isOpen}
          onClose={onClose}
          handleSignUp={handleSignUp}
          setUsername={setUsername}
          username={username}
          setBio={setBio}
          bio={bio}
          setProfilePicture={setProfilePicture}
          setProfileBanner={setProfileBanner}
          profilePicture={profilePicture}
          profileBanner={profileBanner}
        />
      )}
      <Flex justify={"space-evenly"} bg={"black"}>
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
        <Flex bg="black" w="30vw" h="100vh" minW="350px" overflow={"scroll"}>
          <VStack
            w="30vw"
            position={"sticky"}
            justify="flex-start"
            align="flex-start"
          >
            <Flex
              w="30vw"
              h="4vh"
              position="sticky"
              minW="200px"
              minH="50px"
              opacity={0.9}
              overflow={"hidden"}
              direction={"row"}
            >
              <Heading mt="4" ml="3" fontSize="xl" color="white">
                Home
              </Heading>
            </Flex>
            <Box>
              <CreatePostInput
                IPFS={IPFS}
                contract={contract}
                avatar={avatar}
              />
            </Box>
            <Divider
              orientation="horizontal"
              colorScheme="blackAlpha"
              borderWidth="0.2px"
            />
            <Flex />
            <Flex>
              <VStack
                w="30vw"
                h="100%"
                justify="flex-start"
                align="flex-start"
                maxW={"200px"}
              >
                {posts.map((post, index) => (
                  <OfficialPost key={index} post={post} />
                ))}
              </VStack>
            </Flex>
          </VStack>
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
