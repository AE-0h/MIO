// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../MIOResale/MioResale.sol";
import "../MIOKarma/MioKarma.sol";

contract MioMarket is Initializable, OwnableUpgradeable {
    using Strings for uint256;

    //------------------------------------------IMMUTABLES & CONST------------------------------------------------------

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
    Karma public karmaContract;
    uint256 public karmaRequiredToSell;

    //-------------------------------------------MODIFIERS-------------------------------------------------------

    modifier onlyKarmaUser(address user) {
        require(
            karmaContract.getUserKarma(user).rating >= karmaRequiredToSell,
            "MioMarket: user doesn't have enough karma to sell on the market"
        );
        _;
    }

    //-------------------------------------------FUNCTIONS-------------------------------------------------------

    function initialize(
        address _mioVisionFactory,
        address _karmaContract
    ) public initializer {
        __Ownable_init();
        mioVisionFactory = MioVisionFactory(_mioVisionFactory);
        karmaContract = Karma(_karmaContract);
        karmaRequiredToSell = 
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
        MioResaleItem storage item = mioResaleItems[_nftAddress][_tokenId];
        require(item.seller == msg.sender, "MioMarket: only seller can remove");

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
        require(item.seller != address(0), "MioMarket: invalid sale item");
        require(
            item.seller != msg.sender,
            "MioMarket: seller can't buy their own item"
        );
        require(
            msg.value >= item.price,
            "MioMarket: not enough funds to buy item"
        );

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
