// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {MioAlbum} from "./MioAlbum.sol";
import {Owned} from "solmate/src/auth/Owned.sol";

contract MioAlbumFactory is Owned(msg.sender) {
    uint256 public initialMintPrice;
    uint256 public initialSupply;

    constructor(uint256 _initialMintPrice, uint256 _initialSupply) {
        initialMintPrice = _initialMintPrice;
        initialSupply = _initialSupply;
    }

    event ContractDeployed(
        address contractAddress,
        string _name,
        string _artist,
        uint256 _edition
    );

    function deployUserContract(
        string memory _name,
        string memory _artist,
        uint256 _edition
    ) external onlyOwner returns (address newAlbumNFTContract) {
        uint256 totalSupply = initialSupply / (2 ** _edition);
        uint256 mintPrice = initialMintPrice * (2 ** _edition);

        newAlbumNFTContract = address(
            new MioAlbum(_name, _artist, mintPrice, totalSupply)
        );
        emit ContractDeployed(newAlbumNFTContract, _name, _artist, _edition);
        return newAlbumNFTContract;
    }
}
