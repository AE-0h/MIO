// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import "openzeppelin-contracts/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract MioNFT is ERC721, Owned(msg.sender) {
    using Strings for uint256;
    //------------------------------ERRORS---------------------------------------------//

    error MintPriceNotPaid();
    error MaxSupply();
    error NonExistentTokenURI();
    error WithdrawTransfer();

    //------------------------------Events---------------------------------------------//

    // event fired when a nft is minted
    // contains: -
    // - the address of the user wh
    // - user nft ID
    //
    event nftMinted(
        address indexed to,
        uint256 indexed nftID,
        bytes32 indexed ipfsHash
    );

    //--------------------------STATE VARIABLES---------------------------------------//
    // userNft unique id
    uint256 public nftID;
    // mapping nftID to description
    mapping(uint256 => bytes32) public ipfsHashFromNFTID;
    string public baseURI;
    uint256 public currentTokenId;
    uint256 public immutable totalSupply;
    uint256 public immutable mintPrice;

    //---------------------------CONSTRUCTOR----------------------------------------//

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _mintPrice,
        string memory _baseURI
    ) payable ERC721(_name, _symbol) {
        nftID = 0;
        owner = msg.sender;
        totalSupply = _totalSupply;
        mintPrice = _mintPrice;
        baseURI = _baseURI;
    }

    //----------------------------FUNCTIONS-------------------------------------//
    function getOwner() external view returns (address) {
        return owner;
    }

    function setTokenURI(uint256 _nftID, bytes32 _ipfsHash) external onlyOwner {
        ipfsHashFromNFTID[_nftID] = _ipfsHash;
    }

    function tokenURI(
        uint256 _nftID
    ) public view override returns (string memory) {
        string memory _tokenURI = string(
            abi.encodePacked(baseURI, ipfsHashFromNFTID[_nftID])
        );
        return _tokenURI;
    }

    function mintNFT(
        address _to,
        uint256 _mintPrice
    ) external payable returns (uint256) {
        if (_mintPrice != mintPrice) {
            console.log("mintPrice", _mintPrice);
            console.log("mintPrice", mintPrice);
            revert MintPriceNotPaid();
        }
        if (nftID >= totalSupply) {
            revert MaxSupply();
        }
        emit nftMinted(_to, ++nftID, ipfsHashFromNFTID[nftID]);

        _safeMint(_to, nftID);

        return nftID;
    }

    function harvest(address payable _contractOwner) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool transferTx, ) = _contractOwner.call{value: balance}("");
        if (!transferTx) {
            revert WithdrawTransfer();
        }
    }
}
