// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {MIOCore} from "../MioCore.sol";

import {RandGen} from "../interfaces/RandGen.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract VRFv2RandGen is RandGen, VRFConsumerBaseV2, ConfirmedOwner(msg.sender) {
    //--------------------------Events-------------------------------------
    event RandomBytesRequested(bytes32 requestId);
    event RandomBytesReturned(bytes32 requestId, uint256 randomness);

    //LINK immutable private LINK address on polygon mumbai testnet
    address immutable LINK = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;

    //--------------------------Variables-----------------------------------
    VRFCoordinatorV2Interface internal vrfCoordinator;
    bytes32 internal keyHash;
    uint256 internal fee;

    mapping(bytes32 => address) public requesters;
    mapping(bytes32 => uint256) public requestBlockNumbers;

    //--------------------------FUNCTIONS-----------------------------------
    constructor(
        address _vrfCoordinator,
        address _link,
        bytes32 _keyHash,
        uint256 _fee
    ) VRFConsumerBaseV2(_vrfCoordinator, _link) {
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        keyHash = _keyHash;
        fee = _fee;
    }

    // Requests randomness from a user-provided seed  
    //todo needs correct fuction call
    function requestRandomBytes() external override returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        requestId = requestRandomness(keyHash, fee);
        requesters[requestId] = msg.sender;
        requestBlockNumbers[requestId] = block.number;
        emit RandomBytesRequested(requestId);
    }

    // Callback function used by VRF Coordinator
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        emit RandomBytesReturned(requestId, randomness);
        MIOCore(requesters[requestId]).receiveRandomness(requestId, randomness);
    }

    function withdrawLink() external onlyOwner {
        require(LINK.transfer(msg.sender, LINK.balanceOf(address(this))), "Unable to transfer");
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
    }

    function getFee() external view returns (uint256) {
        return fee;
    }

    function getChainlinkToken() public view returns (address) {
        return address(LINK);
    }
}