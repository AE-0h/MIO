// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MioResale is ERC721AUpgradeable, OwnableUpgradeable {
    //------------------------------ERRORS---------------------------------------------//

    error MintPriceNotPaid();
    error MaxSupply();
    error NonExistentTokenURI();
    error NoFundsToWithdraw();

    //------------------------------EVENTS---------------------------------------------//

    // event fired when a nft is minted
    // contains: -
    // - the address of the user wh
    // - user nft ID
    //
    event nftMinted(
        address indexed to,
        uint256 indexed nftID,
        string indexed ipfsHashwithBase
    );

    // event fired when a funds are withdrawn from user MIOVision contract

    event contractValueWithdrawn(address indexed to, uint256 indexed amount);

    //--------------------------STATE VARIABLES---------------------------------------//
    // userNft unique id
    uint256 public nftID;
    // mapping nftID to ipfsHash
    mapping(uint256 => string) public ipfsHashFromNFTID;
    uint256 public currentTokenId;
    uint256 public mintPrice;
    uint256 public totalMinted;
    uint256 public totalHarvested;
    string public metaBaseURI;
    string[] public metaURIArray;
    address public eoaInvoker;

    //---------------------------CONSTRUCTOR----------------------------------------//

    function initialize(
        string memory _name,
        string memory _symbol,
        string memory _metaBaseURI,
        address _eoaInvoker,
        string[] memory _metaURI
    ) public payable initializer initializerERC721A {
        __ERC721A_init(_name, _symbol);
        __Ownable_init();
        transferOwnership(_eoaInvoker);
        nftID = 0;
        metaBaseURI = _metaBaseURI;
        eoaInvoker = _eoaInvoker;
        metaURIArray = _metaURI;
    }

    //----------------------------FUNCTIONS-------------------------------------//
    function _baseURI() internal view override returns (string memory) {
        return metaBaseURI;
    }

    function getOwnerOfNFT(uint256 _nftID) external view returns (address) {
        return ownerOf(_nftID);
    }

    function transferOwnershipToEOAInvoker() external onlyOwner {
        transferOwnership(eoaInvoker);
    }

    function mintNFT(
        address _to,
        string calldata _ipfsHash
    ) external returns (uint256) {
        if (metaURIArray.length == 0) {
            revert NonExistentTokenURI();
        }
        string memory _ipfsHashWithBase = string(
            abi.encodePacked(_baseURI(), _ipfsHash)
        );

        emit nftMinted(_to, ++nftID, _ipfsHashWithBase);

        ipfsHashFromNFTID[nftID] = _ipfsHashWithBase;

        _safeMint(_to, nftID);

        return nftID;
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function harvest(address payable _contractOwner) external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) {
            revert NoFundsToWithdraw();
        }
        _contractOwner.transfer(balance);
    }
}
