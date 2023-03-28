// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {MioAlbum} from "./MioAlbum.sol";
import {Owned} from "solmate/src/auth/Owned.sol";

contract MioAlbumFactory is Owned {
    uint256 public initialMintPrice;
    uint256 public initialSupply;

    constructor(uint256 _initialMintPrice, uint256 _initialSupply) {
        initialMintPrice = _initialMintPrice;
        initialSupply = _initialSupply;
    }

    event ContractDeployed(address contractAddress, string baseURI);

    function deployUserContract(
        string memory _baseURI,
        uint256 _edition
    ) external onlyOwner returns (address newAlbumNFTContract) {
        uint256 totalSupply = initialSupply / (2 ** _edition);
        uint256 mintPrice = initialMintPrice * (2 ** _edition);

        newAlbumNFTContract = address(
            new MioAlbum(_baseURI, totalSupply, mintPrice)
        );
        emit ContractDeployed(newAlbumNFTContract, _baseURI);
        return newAlbumNFTContract;
    }
}
