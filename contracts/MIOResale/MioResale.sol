// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "erc721a-upgradeable/contracts/ERC721AUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MioResale is ERC721AUpgradeable, OwnableUpgradeable {
    //------------------------------ERRORS---------------------------------------------//

    error MaxSupply();
    error NonExistentTokenURI();

    //------------------------------EVENTS---------------------------------------------//

    // event fired when a nft is minted
    // contains: -
    // - productName
    // - productBrand
    // - productCategory
    // - sku number to officially identify the product
    // - array of ipfsURIs that contain images and argument provisioned metadata of the product
    //
    event nftMinted(
        string productName,
        string productBrand,
        string productCategory,
        string indexed sku,
        string[] indexed completeMetaURIArray
    );

    //--------------------------STATE VARIABLES---------------------------------------//

    // mapping nftID to ipfsHash
    uint256 public totalHarvested;
    string public metaBaseURI;
    address public eoaInvoker;
    uint256 public totalMinted;

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

    function getOwnerOfNFT(uint256 _nftID) external view returns (address) {
        return ownerOf(_nftID);
    }

    function mintNFT(
        string memory _productName,
        string memory _productBrand,
        string memory _productCategory,
        string memory _sku,
        string[] calldata _metaURIs
    ) external {
        if (totalMinted >= 1) {
            revert MaxSupply();
        }
        string[] memory completeURIs = new string[](_metaURIs.length);
        for (uint256 i = 0; i < _metaURIs.length; i++) {
            completeURIs[i] = string(
                abi.encodePacked(metaBaseURI, _metaURIs[i])
            );
        }
        //last element of the array is sku
        //second last element of the array is productCategory
        //third last element of the array is productBrand
        //fourth last element of the array is productName
        assembly {
            let size := mload(completeURIs) // load the current size of the array
            mstore(completeURIs, add(size, 4)) // increase the size by 4
            mstore(add(completeURIs, mul(add(size, 1), 32)), _productName) // push _productName to the end of the array
            mstore(add(completeURIs, mul(add(size, 2), 32)), _productBrand) // push _productBrand to the end of the array
            mstore(add(completeURIs, mul(add(size, 3), 32)), _productCategory) // push _productCategory to the end of the array
            mstore(add(completeURIs, mul(add(size, 4), 32)), _sku) // push _sku to the end of the array
        }
        emit nftMinted(
            _productName,
            _productBrand,
            _productCategory,
            _sku,
            completeURIs
        );
        _safeMint(eoaInvoker, totalMinted);
        totalMinted++;
    }
}
