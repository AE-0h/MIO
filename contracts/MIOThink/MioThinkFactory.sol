// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {MioThink} from "./MioThink.sol";
import {MIOCore} from "../MioCore.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MioThinkFactory is Initializable, OwnableUpgradeable {
    //------------------------------------------IMMUTABLES & CONST------------------------------------------------------

    //--------------------------------------------Events--------------------------------------------------------
    event ContractDeployed(
        address contractAddress,
        string title,
        string mediaContent,
        string thought,
        uint256 totalSupply,
        uint256 mintPrice
    );

    //-------------------------------------------FUNCTIONS------------------------------------------------------
    function initialize(address ownerAddress) public initializer {
        __Ownable_init();
        transferOwnership(ownerAddress);
    }

    function deployUserContract(
        string memory _title,
        string memory _mediaContent,
        string memory _thought,
        string memory _collectionBaseURI,
        uint256 _totalSupply,
        uint256 _mintPrice,
        address _eoaInvoker
    ) external onlyOwner returns (address newMioVisionContract) {
        newMioVisionContract = address(new MioThink());
        MioThink(newMioVisionContract).initialize(
            _title,
            _mediaContent,
            _thought,
            _collectionBaseURI,
            _totalSupply,
            _mintPrice,
            _eoaInvoker
        );
        emit ContractDeployed(
            newMioVisionContract,
            _title,
            _mediaContent,
            _thought,
            _totalSupply,
            _mintPrice
        );
        return newMioVisionContract;
    }
}
