// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {MIOCore} from "../MioCore.sol";

import {RandGen} from "../interfaces/RandGen.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract VRFv2RandGen is RandGen, VRFConsumerBaseV2, ConfirmedOwner{

    //--------------------------Errors-------------------------------------
    error NotMioCore();

    //--------------------------Events-------------------------------------
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    //--------------------------Immutables----------------------------------
    // ChainLink token on Polygon Mumbai testnet  = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    // ChainLink VRFv2 Cordinator on Polygon Mumbai testnet = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    // ChainLink VRFv2 KeyHash on Polygon Mumbai testnet = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;

    //MIOCore contract address
    MIOCore immutable public mioCore;

    /// Public key to generate randomness against.
    bytes32 internal immutable chainlinkKeyHash;

    ///Fee required to fulfill a VRF request.
    uint256 internal immutable chainlinkFee;


    //--------------------------Variables-----------------------------------
    VRFCoordinatorV2Interface internal vrfCoordinator;
    bytes32 internal keyHash;
    uint256 internal fee;
    uint256 internal lastRequestId;
    uint64 internal subscriptionId;
    uint16 internal requestConfirmations;
    uint32 internal callbackGasLimit;
    uint32 internal numWords;
 

    constructor(
        MIOCore _mioCore,
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _fee,
        uint64 _subscriptionId
    ) VRFConsumerBaseV2(_vrfCoordinator ) {
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;
        fee = _fee;
        mioCore = _mioCore;
        subscriptionId = _subscriptionId;
        ConfirmedOwner(msg.sender);
    }

    // Requests randomness from a user-provided seed  
   function requestRandomBytes() onlyOwner external returns (uint256 requestId) {
        require(msg.sender == address(mioCore), "NotMioCore");
        requestId = vrfCoordinator.requestRandomWords(
            keyHash,
            subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

   function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        emit RequestFulfilled(_requestId, _randomWords);
    }

}