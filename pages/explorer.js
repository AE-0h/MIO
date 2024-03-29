import { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { useSigner, useContract, useAccount, useConnect } from "wagmi";

import MIOCoreJSON from "../artifacts/contracts/MIOCore.sol/MIOCore.json";
import {
  useDisclosure,
  Flex,
  Divider,
  Box,
  Heading,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { HomeNavBar } from "../components/LeftContainer/HomeNavBar.jsx";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OfficialPost } from "../components/CenterContainer/OfficialPost.jsx";
import { RightBar } from "../components/RightContainer/RightWidget";
import { Search } from "../components/CenterContainer/Search";
import { ExplorerWidget } from "../components/CenterContainer/ExplorerWidget";

export default function Explorer() {
  const [userExists, setUserExists] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileBanner, setProfileBanner] = useState(null);
  const { data: signer, isError, isLoading } = useSigner();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState([]);
  const [avatar, setAvatar] = useState(null);
  const [searchPostId, setSearchPostId] = useState("");
  const [searchUsername, setSearchUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  let calculateTime = (timestamp) => {
    if (isNaN(timestamp)) {
      timestamp = +timestamp;
    }
    let time = new Date(timestamp);
    let now = new Date();
    let diff = now - time;
    let seconds = Math.floor(diff / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let months = Math.floor(days / 30);
    let years = Math.floor(months / 12);
    if (seconds < 60) {
      return seconds + "s";
    } else if (minutes < 60) {
      return minutes + "m";
    } else if (hours < 24) {
      return hours + "h";
    } else if (days < 30) {
      return days + "d";
    } else if (months < 12) {
      return months + "mo";
    } else {
      return years + "y";
    }
  };

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

  useEffect(() => {
    const getSignerAddress = async () => {
      try {
        const address = await signer.getAddress();
        return address;
      } catch (e) {
        console.log("Error getting signer address:", e);
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
        console.log(cid);
        let cidURL = `https://ipfs.io/ipfs/${cid}`;
        console.log(cidURL);
        setAvatar(cidURL);
      } catch (e) {
        console.error("Failed to get profile picture from IPFS.", e);
      }
    };

    const getPosts = async () => {
      try {
        const allMioPosts = await contract.getAllMioPosts({
          gasLimit: 10000000,
        });
        let _posts = [];
        for (let i = 0; i < allMioPosts.length; i++) {
          let post = await allMioPosts[i];
          let mediaCID = await post.media;
          let _content = await post.content;
          let _timestamp = await post.timeStamp;
          let parsedStamp = parseInt(_timestamp);
          let postAge = await calculateTime(parsedStamp);
          let author = await post.author;
          let postAuthorUsername = await contract.getUser(author, {
            gasLimit: 1000000,
          });
          let postAuthorProfilePicture = await postAuthorUsername[2];
          let postAuthorProfilePictureURL = `https://ipfs.io/ipfs/${postAuthorProfilePicture}`;

          let postObj = {
            profilePic: postAuthorProfilePictureURL,
            username: postAuthorUsername[0],
            media: mediaCID,
            content: _content,
            timestamp: postAge,
          };
          _posts.push(postObj);
        }
        let mostRecentArr = await _posts.reverse();
        setPosts(mostRecentArr);
      } catch (e) {
        console.error("Failed to get posts.", e);
      }
    };
    getPosts();
    getUsersProfilePicture();
  }, [contract, onOpen, onClose, setUserExists, signer, userExists, posts]);

  const handleSearch = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    console.log("Searching for:", newSearchTerm);
    // Perform your search logic here
  };
  return (
    <>
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
              position="sticky"
              minW="200px"
              minH="50px"
              direction={"row"}
              bg={""}
            >
              <Search onSearch={handleSearch} />
            </Flex>

            <ExplorerWidget />

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
