// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {MioResale} from "./MioResale.sol";
import {MIOCore} from "../MioCore.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MioVisionFactory is Initializable, OwnableUpgradeable {
    using Strings for uint256;

    //------------------------------------------IMMUTABLES & CONST------------------------------------------------------

    //--------------------------------------------Events--------------------------------------------------------
    event ContractDeployed(address contractAddress, string name, string symbol);

    //-------------------------------------------FUNCTIONS------------------------------------------------------
    function initialize(address ownerAddress) public initializer {
        __Ownable_init();
        transferOwnership(ownerAddress);
    }

    function deployUserContract(
        string memory _name,
        string memory _symbol,
        address _eoaInvoker
    ) external onlyOwner returns (address newMioVisionContract) {
        newMioVisionContract = address(new MioResale());
        MioResale(newMioVisionContract).initialize(_name, _symbol, _eoaInvoker);
        emit ContractDeployed(newMioVisionContract, _name, _symbol);
        return newMioVisionContract;
    }
}
