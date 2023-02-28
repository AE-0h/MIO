import { Stack,Avatar,Flex, Input, Button} from '@chakra-ui/react';


  export function CreatePostInput() {
    return (
    <div>
      <Stack direction={'row'} >
        <Flex >
        <Avatar
          size='md'
          src={'./MIOICO.png'}
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
        >
        </Input>
        </Flex>
      </Stack>
      <Flex justify={'flex-end'} align={'flex-end'}>
      <Button colorScheme={'green'} p={5} size='sm' color='white' variant='solid' borderRadius='3xl' borderWidth={1} borderColor={'gray.500'} mr={4} mt={8} w={87} fontWeight={'Bold'} fontSize={'md'}>
          Twit
        </Button>
      </Flex>
  </div>

      
    );
    
  } 