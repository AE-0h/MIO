// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "../lib/forge-std/src/Test.sol";
import "../contracts/MioCore.sol";
import "../contracts/MioNFT.sol";
import "../contracts/MioNFTFactory.sol";

contract MioTest is Test {
        MIOCore mioCore;
        MioNFTFactory mioNFTFactory;
        MioNFT mioNFT;
        address user;

    function setUp() public {
        mioNFT = new MioNFT("MioNFT", "MIO");
        mioNFTFactory = new MioNFTFactory(mioNFT);
        mioCore = new MIOCore(mioNFTFactory);
    }

    function testCreateUser() public payable {
        mioCore.createUser{
            value: 1 ether,
            gas: 2000000
        }("aeoh", "HELLO WORLD", "pp.png", "pb.png");

        

    }

    function testFailCreateUserNFTContract() public {
        mioCore.createUserNFTContract("PARADISELOST", "PL");

    }
}
