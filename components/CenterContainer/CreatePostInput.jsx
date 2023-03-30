import { useState, useRef } from "react";
import { Stack, Avatar, Flex, Input, Button, Icon } from "@chakra-ui/react";
import { ImPlus } from "react-icons/im";
import { ethers } from "ethers";

export function CreatePostInput({ IPFS, contract, avatar }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const postInputRef = useRef();
  const [posts, setPosts] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    let uploadFileToIPFS = async (file) => {
      const ipfsConnect = await IPFS();
      const added = await ipfsConnect.add(file);
      const url = `https://ipfs.io/ipfs/${added.path}`;
      return url;
    };

    const ipfsCID = selectedFile ? await uploadFileToIPFS(selectedFile) : "";

    try {
      const text = postInputRef.current.value ? postInputRef.current.value : "";
      const timestamp = Date.now().toString();
      console.log(text);
      await contract.makePostOfficial(text, ipfsCID, timestamp, {
        value: ethers.utils.parseEther("0.01"),
        gasLimit: 1000000,
      });
      const allPosts = await contract.getAllMioPosts({ gasLimit: 1000000 });
      // Update the state with the new post data
      setPosts(allPosts);
      // Reset the form and selected fil
      setSelectedFile(null);
      postInputRef.current.value = "";
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Stack direction={"row"}>
        <Flex>
          <Avatar
            size="md"
            src={avatar}
            alt="Author"
            // ml={-160}
            ml={3}
            mt={1}
          />
        </Flex>
        <Flex>
          <Input
            colorScheme={"white"}
            fontSize={"2xl"}
            fontWeight="medium"
            placeholder="What's happening?"
            size="lg"
            variant="unstyled"
            w="26vw"
            ref={postInputRef}
          ></Input>
        </Flex>
      </Stack>
      <Flex justify={"flex-end"} align={"flex-end"} direction={"row"}>
        <label htmlFor="fileInput">
          <Icon
            as={ImPlus}
            size="0.8em"
            color="whiteAlpha.800"
            _hover={{ cursor: "pointer" }}
            mr={4}
            mb={2}
          />
          <input
            id="fileInput"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
        <Button
          colorScheme={"green"}
          p={5}
          size="sm"
          color="white"
          variant="solid"
          borderRadius="3xl"
          borderWidth={1}
          borderColor={"gray.500"}
          mr={4}
          mt={8}
          w={87}
          fontWeight={"Bold"}
          fontSize={"md"}
          onClick={handlePostSubmit}
        >
          MIO
        </Button>
      </Flex>
    </div>
  );
}
