// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Karma {
    struct UserKarma {
        uint256 totalStars;
        uint256 totalRatings;
    }

    mapping(address => UserKarma) public userKarmas;
    uint256 private constant PRECISION = 10;
    uint256 private constant MAX_STARS = 50; // 5.0 stars * 10 precision

    // Custom errors
    error InvalidRating(uint256 providedRating);

    event KarmaUpdated(address indexed user, uint256 averageStars);

    function addRating(address user, uint256 stars) internal {
        if (stars < PRECISION || stars > MAX_STARS) {
            revert InvalidRating(stars);
        }

        UserKarma memory karma = userKarmas[user];
        karma.totalStars += stars;
        karma.totalRatings++;

        uint256 averageStars = karma.totalStars / karma.totalRatings;
        emit KarmaUpdated(user, averageStars);
    }

    function getUserKarma(
        address user
    ) public view returns (uint256 averageStars) {
        UserKarma memory karma = userKarmas[user];
        if (userKarmas[user].totalRatings == 0) {
            karma.totalStars = 30;
            return karma.totalStars;
        }
        return (karma.totalStars / (karma.totalRatings));
    }
}
