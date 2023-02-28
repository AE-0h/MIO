import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";
import {
  Stack,
  Container,
  VStack,
  Heading,
  Image,
  Spacer,
  Text,
  Box,
  Link,
} from "@chakra-ui/react";

export default function Splash() {
  const [isLoading, setIsLoading] = useState(false);
  const onClick = () => {
    if (window.ethereum.selectedAddress) {
      window.location.href = "/home";
    } else {
      setIsLoading(true);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = () => {
      if (window.ethereum.selectedAddress) {
        window.location.href = "/home";
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }, []);
  return (
    <div className={styles.mainSplash}>
      <Container textAlign={"center"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{
            base: 2,
            md: 10,
          }}
          py={{
            base: 5,
            md: 56,
          }}
          w="100%"
        >
          <VStack spacing={2}>
            <Heading
              fontWeight={600}
              fontSize={{
                base: "2xl",
                sm: "4xl",
                md: "6xl",
              }}
              lineHeight={"100%"}
              marginRight={20}
            >
              <Image src="/MIOICO.png" width={200} height={200} />
              MIO
            </Heading>{" "}
            <Spacer />
            <Heading
              fontWeight={600}
              fontSize={{
                base: "2xl",
                sm: "4xl",
                md: "6xl",
              }}
              lineHeight={"100%"}
              marginRight={100}
            >
              <Text as={"span"} color={"purple.400"} marginLeft={10}>
                gm earthlings...
              </Text>{" "}
            </Heading>{" "}
          </VStack>{" "}
          <Text color={"gray.500"}>
            Connect your wallet to get started earthling{" "}
          </Text>{" "}
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Link onClick={onClick} disabled={isLoading}>
              <ConnectButton />
            </Link>
          </Stack>{" "}
        </Stack>{" "}
      </Container>{" "}
    </div>
  );
}
