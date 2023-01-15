// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {MioNFT} from "./MioNFT.sol";


contract MioNFTFactory {
    //--------------------------Events-------------------------------------
   event MioNFTDeployed(address deployedAddress, string name, string symbol);
 
    //--------------------------FUNCTIONS-----------------------------------
    function deployMioNFT(
        string calldata name,
        string calldata symbol
    ) external returns (MioNFT deployedAddress) {

        deployedAddress = new MioNFT(name, symbol);
        emit MioNFTDeployed(address(deployedAddress), name, symbol);
        return deployedAddress;
    }
}