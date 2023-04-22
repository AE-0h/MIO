// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Karma is Initializable, OwnableUpgradeable {
    struct UserKarma {
        uint256 totalStars;
        uint256 totalRatings;
    }

    mapping(address => UserKarma) public userKarmas;

    // Custom errors
    error InvalidRating(uint256 providedRating);

    event KarmaUpdated(address indexed user, uint256 averageStars);

    function initialize(address _eoaInvoker) public initializer {
        __Ownable_init();
        transferOwnership(_eoaInvoker);
    }

    function addRating(address user, uint256 stars) external onlyOwner {
        if (stars < 1 || stars > 5) {
            revert InvalidRating(stars);
        }

        UserKarma storage karma = userKarmas[user];
        karma.totalStars += stars;
        karma.totalRatings++;

        uint256 averageStars = karma.totalStars / karma.totalRatings;
        emit KarmaUpdated(user, averageStars);
    }

    function getUserKarma(
        address user
    ) external view returns (uint256 averageStars) {
        UserKarma storage karma = userKarmas[user];
        return (karma.totalStars / karma.totalRatings);
    }
}
