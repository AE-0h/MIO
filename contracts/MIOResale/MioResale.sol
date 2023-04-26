// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

//th

contract MioResale is ERC721AUpgradeable, OwnableUpgradeable {
    //------------------------------ERRORS---------------------------------------------//

    error NonExistentTokenURI();

    //------------------------------EVENTS---------------------------------------------//

    // event fired when a nft is minted
    // contains: -
    // - array of ipfsURIs that contain images in indexes 0 - n and argument provisioned metadata of the product
    // such as :
    // - productName  positioned at arr.length - 3
    // - productBrand positioned at arr.length - 2
    // - productCategory positioned at arr.length - 1
    // - uuid number to officially identify the product positioned at arr.length
    //
    event itemTokenized(bytes indexed completeMetaURIArray);

    //--------------------------STATE VARIABLES---------------------------------------//

    string public metaBaseURI;
    address public eoaInvoker;
    uint256 public totalMinted;
    mapping(string => address) public uuidToOwner;

    //---------------------------CONSTRUCTOR----------------------------------------//

    function initialize(
        string memory _name,
        string memory _symbol,
        address _eoaInvoker
    ) public payable initializer initializerERC721A {
        __ERC721A_init(_name, _symbol);
        __Ownable_init();
        transferOwnership(_eoaInvoker);
        eoaInvoker = _eoaInvoker;
    }

    //----------------------------FUNCTIONS-------------------------------------//

    function setBaseURI(string memory _itemBaseURI) external onlyOwner {
        metaBaseURI = _itemBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return metaBaseURI;
    }

    function ownerOf(
        string memory _uuid
    ) public view virtual returns (address) {
        return uuidToOwner[_uuid];
    }

    function tokenizeItem(
        string memory _productName,
        string memory _productBrand,
        string memory _productCategory,
        string memory _uuid,
        uint256 _totalInventoryForItem,
        string[] calldata _metaURIs
    ) external onlyOwner {
        bytes memory completeURIsBytes;

        for (uint256 i = 0; i < _metaURIs.length; i++) {
            string memory completeURI = string(
                abi.encodePacked(metaBaseURI, _metaURIs[i])
            );
            completeURIsBytes = abi.encodePacked(
                completeURIsBytes,
                completeURI
            );
        }

        // Add _productName, _productBrand, _productCategory, and _uuid to the bytes
        completeURIsBytes = abi.encodePacked(
            completeURIsBytes,
            _productName,
            _productBrand,
            _productCategory,
            _uuid
        );

        uuidToOwner[_uuid] = eoaInvoker;

        emit itemTokenized(completeURIsBytes);
        _safeMint(eoaInvoker, _totalInventoryForItem, completeURIsBytes);

        totalMinted++;
    }
}
