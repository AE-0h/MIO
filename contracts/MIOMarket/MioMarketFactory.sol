// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./MioMarket.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MioMarketFactory is Initializable, OwnableUpgradeable {
    //------------------------------------------IMMUTABLES & CONST------------------------------------------------------

    //--------------------------------------------Events--------------------------------------------------------
    event ContractDeployed(address contractAddress, address eoaInvoker);

    //-------------------------------------------FUNCTIONS------------------------------------------------------
    function initialize(address mioCore) public initializer {
        __Ownable_init();
        transferOwnership(mioCore);
    }

    function deployUserMarketContract(
        address _eoaInvoker
    ) external onlyOwner returns (address newMioMarketContract) {
        newMioMarketContract = address(new MioMarket());
        MioMarket(newMioMarketContract).initialize(_eoaInvoker);
        emit ContractDeployed(newMioMarketContract, _eoaInvoker);
        return newMioMarketContract;
    }
}
