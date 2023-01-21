// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {MioNFT} from "./MioNFT.sol";

import {CREATE3} from "solmate/src/utils/CREATE3.sol";

import {Owned} from "solmate/src/auth/Owned.sol";


contract MioNFTFactory is Owned(msg.sender) {


    address public mioNFTAddress;

    function createMioNFT(string memory _name, string memory _symbol, bytes32 _salt, bytes memory _creationCode) external onlyOwner returns (address) {
        _creationCode = abi.encodePacked(type(MioNFT).creationCode, abi.encode(_name, _symbol));
        //todo finish CREATE2 LOGIC USING USERID AS SALT 
        // mioNFTAddress = CREATE3.deploy(_salt, _creationCode, 0, _name, _symbol);
        return mioNFTAddress;
    }

}