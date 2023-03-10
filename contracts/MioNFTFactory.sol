// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {MioNFT} from "./MioNFT.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {MIOCore} from "./MioCore.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract MioNFTFactory is Owned(msg.sender) {
    using Strings for uint256;

    //--------------------------------------------ERRORS--------------------------------------------------------

    error NotMIOCORE();
    //------------------------------------------IMMUTABLES & CONST------------------------------------------------------

    //--------------------------------------------Events--------------------------------------------------------
    event ContractDeployed(
        address contractAddress,
        string name,
        string symbol,
        uint256 totalSupply,
        uint256 mintPrice,
        string baseURI
    );

    //------------------------------------------CONSTRUCTOR-----------------------------------------------------

    constructor() {
        owner = msg.sender;
    }

    //-------------------------------------------FUNCTIONS------------------------------------------------------
    function deployUserContract(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _mintPrice,
        string calldata _baseURI
    ) external returns (address newMioNFTContract) {
        newMioNFTContract = address(
            new MioNFT(_name, _symbol, _totalSupply, _mintPrice, _baseURI)
        );
        emit ContractDeployed(
            newMioNFTContract,
            _name,
            _symbol,
            _totalSupply,
            _mintPrice,
            _baseURI
        );
        return newMioNFTContract;
    }
}
