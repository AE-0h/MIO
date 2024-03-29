import { Flex } from "@chakra-ui/react";
import { HomeNavBar } from "./HomeNavBar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CustomConnectButton } from "./CustomConnectButton";

export function LeftContainerLayout() {
  return (
    <>
      <Flex
        backgroundColor="black"
        direction={"row"}
        width={"100vw"}
        height={"70vh"}
        justify={"end"}
        pr={15}
      >
        <HomeNavBar />
      </Flex>
      <Flex
        backgroundColor="black"
        position={"fixed"}
        direction={"row"}
        width={"33vw"}
        height={"30vh"}
        justify={"end"}
        pr={12}
        pt={60}
      >
        <CustomConnectButton
          chainStatus="none"
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          showBalance={false}
        />
      </Flex>
    </>
  );
}
