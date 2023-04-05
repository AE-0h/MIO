// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {MioVisual} from "./MioVisual.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {MIOCore} from "../MioCore.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MioVisualFactory is Initializable, OwnableUpgradeable {
    using Strings for uint256;

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

    //-------------------------------------------FUNCTIONS------------------------------------------------------
    function initialize(address ownerAddress) public initializer {
        __Ownable_init();
        transferOwnership(ownerAddress);
    }

    function deployUserContract(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _mintPrice,
        string calldata _baseURI
    ) external onlyOwner returns (address newMioNFTContract) {
        newMioNFTContract = address(new MioVisual());
        MioVisual(newMioNFTContract).initialize(
            _name,
            _symbol,
            _totalSupply,
            _mintPrice,
            _baseURI
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
