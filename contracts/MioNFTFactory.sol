// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {MioNFT} from "./MioNFT.sol";

import {Owned} from "solmate/src/auth/Owned.sol";



contract MioNFTFactory is Owned(msg.sender) {

    event ContractDeployed(address contractAddress);

    function createMioNFT(string memory _name, string memory _symbol, bytes32 _salt) external onlyOwner returns (address mioNFTContractAddress) {

        bytes memory bytecode = type(MioNFT).creationCode;

        assembly {
            mioNFTContractAddress := create2(0, add(bytecode, 32), mload(bytecode), _salt)
        }
        require(address(mioNFTContractAddress) != address(0), "contract creation failed");
        emit ContractDeployed(mioNFTContractAddress);

        MioNFT mioNFT = MioNFT(mioNFTContractAddress);
        mioNFT.initialize(_name, _symbol);
        return mioNFTContractAddress;
    }
}
