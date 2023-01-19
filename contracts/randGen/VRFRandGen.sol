// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {MIOCore} from "../MioCore.sol";

import {RandGen} from "../interfaces/RandGen.sol";

import {VRFConsumerBase} from "../../lib/chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


contract VRFv2RandGen is RandGen, VRFConsumerBase{

    //--------------------------Errors-------------------------------------
    error NotMIO_CORE();
   

    //--------------------------Immutables----------------------------------

    //MIO_CORE contract address
    MIOCore immutable public MIO_CORE;

    /// Public key to generate randomness against.
    bytes32 internal immutable KEY_HASH;

    ///Fee required to fulfill a VRF request.
    uint256 internal immutable FEE;


    //--------------------------Variables-----------------------------------
 

    constructor(
        MIOCore _MIO_CORE,
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBase(_vrfCoordinator, _link ) {
        KEY_HASH = _keyHash;
        FEE = _fee;
        MIO_CORE = _MIO_CORE;

        
    }

    // Requests randomness from a user-provided seed  
     /// Request random bytes from Chainlink VRF. Can only by called by MIOCore contract.
    function requestRandomBytes() external  returns (bytes32 requestId) {
        // The caller must be the MIOCore contract, revert otherwise.
        if (msg.sender != address(MIO_CORE)) revert NotMIO_CORE();

        // The requestRandomness call will revert if we don't have enough LINK to afford the request.
        emit RandomBytesRequested(requestId = requestRandomness(KEY_HASH, FEE));
    }

    ///VRF response by calling back into the MIOCore contract.
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        emit RandomBytesReturned(requestId, randomness);
        MIO_CORE.acceptRandomSeed(requestId, randomness);
    }

    

}