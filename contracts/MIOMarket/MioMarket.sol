// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../MIOResale/MioResale.sol";
import "../MIOKarma/MioKarma.sol";

contract MioMarket is Karma, Initializable, OwnableUpgradeable {
    using Strings for uint256;

    //------------------------------------------ERRORS------------------------------------------------------
    error communityKarmaTooLow();
    error onlySellerCanRemove();


    //--------------------------------------------Events--------------------------------------------------------
    event MioResaleAdded(
        address nftAddress,
        uint256 tokenId,
        address seller,
        uint256 price
    );

    event MioResaleRemoved(address nftAddress, uint256 tokenId, address seller);

    event MioResaleSold(
        address nftAddress,
        uint256 tokenId,
        address buyer,
        uint256 price
    );

    //-------------------------------------------STRUCTS-------------------------------------------------------

    struct MioResaleItem {
        address nftAddress;
        uint256 tokenId;
        address seller;
        uint256 price;
    }

    //-------------------------------------------STATE VARIABLES-------------------------------------------------------

    mapping(address => mapping(uint256 => MioResaleItem)) public mioResaleItems;
    uint256 public karmaRequiredToSell;

    //-------------------------------------------MODIFIERS-------------------------------------------------------

    modifier onlyKarmaUser(address user) {
        uint256 averageStars = getUserKarma(user);
        if (averageStars < karmaRequiredToSell) {
            revert communityKarmaTooLow();
        }
        _;
    }

    //-------------------------------------------FUNCTIONS-------------------------------------------------------

    function initialize(address _eoaInvoker) public initializer {
        __Ownable_init();
        karmaRequiredToSell = 30;
        transferOwnership(_eoaInvoker);
    }

    function listMioResale(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) public onlyKarmaUser(msg.sender) {
        MioResale(_nftAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        mioResaleItems[_nftAddress][_tokenId] = MioResaleItem({
            nftAddress: _nftAddress,
            tokenId: _tokenId,
            seller: msg.sender,
            price: _price
        });

        emit MioResaleAdded(_nftAddress, _tokenId, msg.sender, _price);
    }

    function removeMioResale(address _nftAddress, uint256 _tokenId) public {
        MioResaleItem memory item = mioResaleItems[_nftAddress][_tokenId];
        if (item.seller != msg.sender) {
            revert onlySellerCanRemove();
        }

        MioResale(_nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        emit MioResaleRemoved(_nftAddress, _tokenId, msg.sender);

        delete mioResaleItems[_nftAddress][_tokenId];
    }

    function buyMioResale(
        address _nftAddress,
        uint256 _tokenId
    ) public payable {
        MioResaleItem storage item = mioResaleItems[_nftAddress][_tokenId];
        MioResale(_nftAddress).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        emit MioResaleSold(_nftAddress, _tokenId, msg.sender, item.price);

        delete mioResaleItems[_nftAddress][_tokenId];

        payable(item.seller).transfer(msg.value);
    }

    function setKarmaRequiredToSell(
        uint256 _karmaRequiredToSell
    ) public onlyOwner {
        karmaRequiredToSell = _karmaRequiredToSell;
    }
}
