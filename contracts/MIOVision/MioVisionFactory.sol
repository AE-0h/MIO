// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {MioVision} from "./MioVision.sol";
import {MIOCore} from "../MioCore.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MioVisionFactory is Initializable, OwnableUpgradeable {
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
        string calldata _baseURI,
        address _eoaInvoker
    ) external onlyOwner returns (address newMioVisionContract) {
        newMioVisionContract = address(new MioVision());
        MioVision(newMioVisionContract).initialize(
            _name,
            _symbol,
            _totalSupply,
            _mintPrice,
            _baseURI,
            _eoaInvoker
        );
        emit ContractDeployed(
            newMioVisionContract,
            _name,
            _symbol,
            _totalSupply,
            _mintPrice,
            _baseURI
        );
        return newMioVisionContract;
    }
}
