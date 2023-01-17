//an interface for the MioTokenizedPost contract

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface MioNFTFactoryInterface {
    function deployMioNFT(string calldata name, string calldata symbol) external returns (address);
}
