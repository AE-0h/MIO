// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {MioNFT} from "./MioNFT.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {MIOCore} from "./MioCore.sol";

contract MioNFTFactory{
//--------------------------------------------ERRORS--------------------------------------------------------
     error NotMioCore();
//------------------------------------------IMMUTABLES------------------------------------------------------
     MioNFT immutable public mioNFT;
     MIOCore immutable public mioCore;
//--------------------------------------------Events--------------------------------------------------------
    event ContractDeployed(address contractAddress);
//------------------------------------------CONSTRUCTOR-----------------------------------------------------
    constructor(
        MioNFT _mioNFT,
        MIOCore _mioCore
    ) {
        mioNFT = _mioNFT;
        mioCore = _mioCore;
    }
//-------------------------------------------FUNCTIONS------------------------------------------------------
       function deployUserContract(string memory _name, string memory _symbol ) external returns (address)  {
        if(msg.sender != address(mioCore)) { revert NotMioCore(); }
        address newMioNFTContract = address( new MioNFT(_name, _symbol));
        emit ContractDeployed(newMioNFTContract);
        return newMioNFTContract;
    }
}
