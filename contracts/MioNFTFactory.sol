// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {MioNFT} from "./MioNFT.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {MIOCore} from "./MioCore.sol";
import {LibConst} from "./contract_libs/LibConst.sol";

contract MioNFTFactory {
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

    //-------------------------------------------FUNCTIONS------------------------------------------------------
    function deployUserContract(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _mintPrice,
        string calldata _baseURI
    ) external returns (address newMioNFTContract) {
        // if(msg.sender != LibConst.MIO_CORE_MUMBAI){
        //     revert NotMIOCORE();
        // }
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
