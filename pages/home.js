import { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { LeftContainerLayout } from "../components/LeftContainer/LeftContainerLayout.jsx";
import { useSigner, useContract } from "wagmi";
import MIOCoreJSON from "../artifacts/contracts/MIOCore.sol/MIOCore.json";
import { UserSignUpModal } from "../components/UserSignUpModal.jsx";
import { useDisclosure } from "@chakra-ui/react";

export default function Home() {
  const [userExists, setUserExists] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileBanner, setProfileBanner] = useState(null);
  const { data: signer, isError, isLoading } = useSigner();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function IPFS() {
    const ipfsConnect = await create({
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https",
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
        let m = await contract.checkUserExists(addr);
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
            setShowModal(false);
            console.log("user exists");
          } else {
            setUserExists(false);
            setShowModal(true);
            console.log("user does not exist");
            onOpen();
          }
        } catch (e) {
          console.log(e);
        }
      }
    };
    getUserStatus();
  }, [
    contract,
    onOpen,
    onClose,
    setShowModal,
    setUserExists,
    signer,
    userExists,
  ]);

  const handleSignUp = async () => {
    let _ipfs = await IPFS();
    console.log(_ipfs);

    try {
      // Upload profile picture to IPFS
      const profilePictureCid = await _ipfs.add(profilePicture);
      // Upload profile banner to IPFS
      const profileBannerCid = await _ipfs.add(profileBanner);
      console.log(profilePictureCid);
      console.log(profileBannerCid);
      const tx = await contract?.createUser(
        username,
        bio,
        profilePictureCid,
        profileBannerCid
      );
      await tx.wait();
      setShowModal(false);
    } catch (e) {
      console.log(e);
    }
  };
  console.log(showModal);
  console.log(userExists);
  return (
    <>
      {!userExists && (
        <UserSignUpModal
          isOpen={isOpen}
          onClose={onClose}
          handleSignUp={handleSignUp}
          setUsername={setUsername}
          setBio={setBio}
          setProfilePicture={setProfilePicture}
          setProfileBanner={setProfileBanner}
          profilePicture={profilePicture}
          profileBanner={profileBanner}
        />
      )}
      <LeftContainerLayout />
    </>
  );
}
