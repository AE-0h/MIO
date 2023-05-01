// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../MIOThink/MioThink.sol";
import "../MIOKarma/MioKarma.sol";

contract MioMarket is Karma, Initializable, OwnableUpgradeable {
    using Strings for uint256;

    //------------------------------------------ERRORS------------------------------------------------------
    error communityKarmaTooLow();
    error onlySellerCanRemove();

    //--------------------------------------------Events--------------------------------------------------------
    event ThoughtAdded(
        address nftAddress,
        uint256 tokenId,
        address seller,
        uint256 price
    );

    event ThoughtRemoved(address nftAddress, uint256 tokenId, address seller);

    event ThoughtSold(
        address nftAddress,
        uint256 tokenId,
        address buyer,
        uint256 price
    );

    //-------------------------------------------STRUCTS-------------------------------------------------------

    struct MioThought {
        address contractAddress;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool sold;
    }

    //-------------------------------------------STATE VARIABLES-------------------------------------------------------
    //
    mapping(address => mapping(uint256 => MioThought)) public mioThoughts;
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
        address _contractAddress,
        uint256 _tokenId,
        uint256 _price
    ) public onlyKarmaUser(msg.sender) {
        MioThink(_contractAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        mioThoughts[_contractAddress][_tokenId] = MioThought({
            contractAddress: _contractAddress,
            tokenId: _tokenId,
            seller: msg.sender,
            price: _price,
            sold: false
        });

        emit ThoughtAdded(_contractAddress, _tokenId, msg.sender, _price);
    }

    function removeMioResale(
        address _contractAddress,
        uint256 _tokenId
    ) public {
        MioThought memory thought = mioThoughts[_contractAddress][_tokenId];
        if (thought.seller != msg.sender) {
            revert onlySellerCanRemove();
        }

        MioThink(_contractAddress).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        emit ThoughtRemoved(_contractAddress, _tokenId, msg.sender);

        delete mioThoughts[_contractAddress][_tokenId];
    }

    function buyMioResale(
        address _contractAddress,
        uint256 _tokenId
    ) public payable {
        MioThought memory thought = mioThoughts[_contractAddress][_tokenId];
        MioThink(_contractAddress).safeTransferFrom(
            address(this),
            msg.sender,
            _tokenId
        );

        emit ThoughtSold(_contractAddress, _tokenId, msg.sender, thought.price);

        thought.sold = true;

        payable(thought.seller).transfer(msg.value);
    }

    function setKarmaRequiredToSell(
        uint256 _karmaRequiredToSell
    ) public onlyOwner {
        karmaRequiredToSell = _karmaRequiredToSell;
    }
}
