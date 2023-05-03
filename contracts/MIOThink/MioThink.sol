// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MioThink is ERC721AUpgradeable, OwnableUpgradeable {
    //------------------------------ERRORS---------------------------------------------//

    error MintPriceNotPaid();
    error MaxSupply();
    error NonExistentTokenURI();
    error NoFundsToWithdraw();

    //-----------------------------Modifier-------------------------------------------//
    // create modifier that checks if the msg.sender is the owner of the nft

    modifier onlyOwnerOf(uint256 _nftID) {
        require(
            msg.sender == ownerOf(_nftID),
            "MioThink: caller is not the owner of the nft"
        );
        _;
    }

    //------------------------------EVENTS---------------------------------------------//

    // event fired when a nft is minted
    // contains: -
    // - the address of the user who minted a copy of a thought
    // - user nft ID
    //
    event ThoughtTokenized(
        address indexed to,
        uint256 indexed nftID,
        address contractAddress,
        string thought
    );

    // event fired when a funds are withdrawn from user MIOVision contract

    event contractValueWithdrawn(address indexed to, uint256 indexed amount);

    //--------------------------STATE VARIABLES---------------------------------------//
    // userNft unique id
    uint256 public nftID;
    uint256 supplyAvailable;
    uint256 public mintPrice;
    uint256 public totalHarvested;
    string public title;
    address public eoaInvoker;
    string public collectionBaseURI;
    string public thought;

    //---------------------------CONSTRUCTOR----------------------------------------//

    function initialize(
        string memory _title,
        string memory _mediaContent,
        string memory _thought,
        string memory _collectionBaseURI,
        uint256 _totalSupply,
        uint256 _mintPrice,
        address _eoaInvoker
    ) public payable initializer initializerERC721A {
        __ERC721A_init(_title, _mediaContent);
        __Ownable_init();
        transferOwnership(_eoaInvoker);
        nftID = 0;
        supplyAvailable = _totalSupply;
        mintPrice = _mintPrice;
        eoaInvoker = _eoaInvoker;
        title = _title;
        thought = _thought;
        collectionBaseURI = _collectionBaseURI;
    }

    //----------------------------FUNCTIONS-------------------------------------//

    function accessThought(address _to) public payable returns (uint256) {
        if (msg.value < mintPrice) {
            revert MintPriceNotPaid();
        }
        if (nftID >= totalSupply()) {
            revert MaxSupply();
        }

        string memory _thoughtWithBase = string(
            abi.encodePacked(_baseURI(), thought)
        );

        emit ThoughtTokenized(_to, ++nftID, address(this), _thoughtWithBase);

        _safeMint(_to, nftID);

        return nftID;
    }

    function harvest(address payable _contractOwner) external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) {
            revert NoFundsToWithdraw();
        }
        _contractOwner.transfer(balance);
        balance += totalHarvested;
        emit contractValueWithdrawn(_contractOwner, balance);
    }

    function _baseURI() internal view override returns (string memory) {
        return collectionBaseURI;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return supplyAvailable;
    }

    function getMediaContent(
        uint256 _thoughtOwnershipId
    ) external view onlyOwnerOf(_thoughtOwnershipId) returns (string memory) {
        return name();
    }

    function getMintPrice() external view returns (uint256) {
        return mintPrice;
    }

    function getThought(
        uint256 _thoughtOwnershipId
    ) external view onlyOwnerOf(_thoughtOwnershipId) returns (string memory) {
        return symbol();
    }

    function getOwnerOfNFT(uint256 _nftID) external view returns (address) {
        return ownerOf(_nftID);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
