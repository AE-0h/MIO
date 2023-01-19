//an interface for the MioTokenizedPost contract

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface RandGen{
    event RandomBytesRequested(bytes32 requestId);
    event RandomBytesReturned(bytes32 requestId, uint256 randomness);

   //---------------------------Functions-------------------------------
 
    // Requests randomness from a user-provided seed
    function requestRandomBytes() external returns (bytes32 requestId);
}