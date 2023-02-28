import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  Image,
  Flex,
  Button,
} from "@chakra-ui/react";

export const UserSignUpModal = ({
  isOpen={isOpen},
  onClose={onClose},
  handleSignUp={handleSignUp},
  setProfilePicture={setProfilePicture},
  setProfileBanner={setProfileBanner},
  profilePicture={profilePicture},
  profileBanner={profileBanner},

}) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (event.target.id === "profile-picture") {
      setProfilePicture(file);
    } else if (event.target.id === "profile-banner") {
      setProfileBanner(file);
    }
    setIsFormValid(
      username.trim() !== "" &&
        bio.trim() !== "" &&
        profilePicture !== null &&
        profileBanner !== null
    );
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setIsFormValid(
      event.target.value.trim() !== "" &&
        bio.trim() !== "" &&
        profilePicture !== null &&
        profileBanner !== null
    );
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
    setIsFormValid(
      username.trim() !== "" &&
        event.target.value.trim() !== "" &&
        profilePicture !== null &&
        profileBanner !== null
    );
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      console.log(isFormValid + " " + username + " " + bio + "")
      await handleSignUp();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign up</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Enter your username"
              onChange={handleUsernameChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Bio</FormLabel>
            <Textarea
              placeholder="Tell us about yourself"
              onChange={handleBioChange}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Profile picture</FormLabel>
            <Input
              type="file"
              id="profile-picture"
              onChange={handleFileUpload}
            />
            {profilePicture && (
              <Box mt={2}>
                <Image src={URL.createObjectURL(profilePicture)} />
              </Box>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Profile banner</FormLabel>
            <Input
              type="file"
              id="profile-banner"
              onChange={handleFileUpload}
            />
            {profileBanner && (
              <Box mt={2}>
                <Image src={URL.createObjectURL(profileBanner)} />
              </Box>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Flex justify="flex-end" w="100%">
            <Button colorScheme="green" onClick={handleSubmit} isDisabled={!isFormValid}>
              Submit
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};