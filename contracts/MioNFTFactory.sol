// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {MioNFT} from "./MioNFT.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {MIOCore} from "./MioCore.sol";
import {LibConst} from "./contract_libs/LibConst.sol";

contract MioNFTFactory is Owned(msg.sender){
//--------------------------------------------ERRORS--------------------------------------------------------

    error NotMIOCORE();    
//------------------------------------------IMMUTABLES & CONST------------------------------------------------------
     MioNFT public immutable mioNFT;      
//--------------------------------------------Events--------------------------------------------------------
    event ContractDeployed(address contractAddress);
//------------------------------------------CONSTRUCTOR-----------------------------------------------------
    constructor(
        MioNFT _mioNFT

    ) {
        mioNFT = _mioNFT;
    }
//-------------------------------------------FUNCTIONS------------------------------------------------------
       function deployUserContract(string memory _name, string memory _symbol ) external returns (address)  {
        if(msg.sender != LibConst.MIO_CORE_MUMBAI){
            revert NotMIOCORE();
        }
        address newMioNFTContract = address( new MioNFT(_name, _symbol));
        emit ContractDeployed(newMioNFTContract);
        return newMioNFTContract;
    }
}
