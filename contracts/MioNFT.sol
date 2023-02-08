// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

contract MioNFT is ERC721, Owned(msg.sender) {
    using Strings for uint256;

    //------------------------------ERRORS---------------------------------------------//

    error MintPriceNotPaid();
    error MaxSupply();
    error NonExistentTokenURI();
    error WithdrawTransfer();

    //------------------------------Events---------------------------------------------//

    // event fired when a new post is made official by another user aside from it's owner
    // contains: -
    // - the address of the user
    // - user nft ID
    //
    event nftMinted(
        address indexed owner,
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
    ) ERC721(_name, _symbol) {
        nftID = 0;
        owner = msg.sender;
        totalSupply = _totalSupply;
        mintPrice = _mintPrice;
        baseURI = _baseURI;
    }

    //----------------------------FUNCTIONS-------------------------------------//

    function setOwner(address _newOwner) public virtual override onlyOwner {
        owner = _newOwner;
        emit OwnerUpdated(msg.sender, _newOwner);
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

    function mintNFT(address _to) external payable returns (uint256) {
        if (msg.value != mintPrice) {
            revert MintPriceNotPaid();
        }
        if (nftID >= totalSupply) {
            revert MaxSupply();
        }
        if (ipfsHashFromNFTID[nftID] == "") {
            revert NonExistentTokenURI();
        }
        emit nftMinted(_to, ++nftID, ipfsHashFromNFTID[nftID]);

        _safeMint(_to, nftID);

        return nftID;
    }

    function withdrawPayments(address payable payee) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool transferTx, ) = payee.call{value: balance}("");
        if (!transferTx) {
            revert WithdrawTransfer();
        }
    }
}
