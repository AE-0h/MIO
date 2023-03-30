// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";

contract MioVisual is ERC721AUpgradeable, OwnableUpgradeable {
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
        string indexed ipfsHash
    );

    //--------------------------STATE VARIABLES---------------------------------------//
    // userNft unique id
    uint256 public nftID;
    // mapping nftID to ipfsHash
    mapping(uint256 => string) public ipfsHashFromNFTID;
    uint256 public currentTokenId;
    uint256 public _TotalSupply;
    uint256 public mintPrice;

    //---------------------------Initilizer----------------------------------------//

    function initialize(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        uint256 _mintPrice
    ) public initializer {
        __ERC721A_init(_name, _symbol);
        __Ownable_init();
        nftID = 0;
        _TotalSupply = _totalSupply;
        mintPrice = _mintPrice;
    }

    //----------------------------FUNCTIONS-------------------------------------//
    // function getOwner() external view returns (address) {
    //     return owner;
    // }

    function getOwnerOfNFT(uint256 _nftID) external view returns (address) {
        return ownerOf(_nftID);
    }

    function mintNFT(
        address _to,
        string calldata _ipfsHash,
        uint256 _mintPrice
    ) external payable returns (uint256) {
        if (_mintPrice != mintPrice) {
            console.log("mintPrice", _mintPrice);
            console.log("mintPrice", mintPrice);
            revert MintPriceNotPaid();
        }
        if (nftID >= _TotalSupply) {
            revert MaxSupply();
        }
        emit nftMinted(_to, ++nftID, _ipfsHash);
        ipfsHashFromNFTID[nftID] = _ipfsHash;
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
