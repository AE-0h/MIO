// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {MioNFT} from "./MioNFT.sol";


contract MioNFTFactory {
   address[] tokenAddress;
 
    function deploy721Contract(
        string calldata name,
        string calldata symbol
    ) external returns (MioNFT cardAddress) {

        MioNFT newCards = new MioNFT(name, symbol);

        tokenAddress.push(address(newCards));
        return newCards;
    }
}