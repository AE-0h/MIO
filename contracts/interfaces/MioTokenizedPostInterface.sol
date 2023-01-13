//an interface for the MioTokenizedPost contract

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface MioTokenizedPostInterface {
    function mintNFT(address _to) external;
    function transferPostNFT(address _to, uint256 _postNFTID) external;
    function burnPostNFT(uint256 _postNFTID) external;
    function getPostNFTID() external view returns (uint256);
}

