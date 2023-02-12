// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "../lib/forge-std/src/Test.sol";
// import "../contracts/MioCore.sol";
// import "../contracts/MioNFT.sol";
import "../contracts/MioNFTFactory.sol";

contract MioTest is Test {
    using stdStorage for StdStorage;

    MIOCore mioCore;
    MioNFTFactory mioNFTFactory;
    MioNFT mioNFT;
    address user;

    function setUp() public {
        mioNFTFactory = new MioNFTFactory();
        mioCore = new MIOCore(mioNFTFactory);
    }

    function testCreateUser() public payable {
        mioCore.createUser{value: 1 * 10 ** 16 wei, gas: 2000000}(
            "aeoh",
            "HELLO WORLD",
            "pp.png",
            "pb.png"
        );
    }

    function testCreateUserNFTContract() public {
        mioCore.createUserNFTContract(
            "PARADISELOST",
            "PL",
            100,
            1,
            "https://ipfs.io/ipfs/"
        );
    }
}
