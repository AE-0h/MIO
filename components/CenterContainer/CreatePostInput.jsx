import { useState, useRef } from "react";
import { Stack,Avatar,Flex, Input, Button, Box, Icon} from '@chakra-ui/react';
import { ImPlus } from 'react-icons/im';
import { ethers } from "ethers";



  export function CreatePostInput({IPFS, contract, avatar}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const postInputRef = useRef();
    const [posts, setPosts] = useState([]);



  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    // Upload the selected file to IPFS and get its CID
    const ipfsCli = await IPFS();
    const uploadImage = await ipfsCli.add(selectedFile);
    const ipfsRawCID = await uploadImage.path;
    const ipfsCID = await ipfsRawCID.toString();
   

    try{
    const text = postInputRef.current.value;
    console.log(text)
    await contract.addPost(text, ipfsCID,
      { value: ethers.utils.parseEther("0.01")});
    const allPosts = await contract.getAllMioPosts(
      { gasLimit: 1000000 }
    );
    console.log(allPosts)

    // Update the state with the new post data
    setPosts(allPosts);

    // Reset the form and selected fil
    setSelectedFile(null);
    postInputRef.current.value = "";
    } catch (err) {
      console.log(err)
    }

    
  };
 

    return (
    <div>
      <Stack direction={'row'} >
        <Flex >
        <Avatar
          size='md'
          src={avatar}
          alt='Author'
          // ml={-160} 
          ml={3}
          mt={1}
     
        />
        </Flex>
        <Flex>
        <Input
        colorScheme={'white'}
          fontSize={'2xl'} 
          fontWeight='medium'
          placeholder="What's happening?"
          size='lg'
          variant='unstyled'
          w='26vw'
          ref={postInputRef}
        >
        </Input>

        </Flex>
      </Stack>
      <Flex justify={'flex-end'} align={'flex-end'} direction={'row'}>
      <label htmlFor="fileInput">
          <Icon
            as={ImPlus}
            size="0.8em"
            color='whiteAlpha.800'
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
        colorScheme={'green'} 
        p={5} 
        size='sm' 
        color='white' 
        variant='solid' 
        borderRadius='3xl' 
        borderWidth={1} 
        borderColor={'gray.500'} 
        mr={4} 
        mt={8} 
        w={87} 
        fontWeight={'Bold'} 
        fontSize={'md'} 
        onClick={handlePostSubmit}>
          MIO
        </Button>
      </Flex>
  </div>

      
    );
    
  } 