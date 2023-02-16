//an interface for the MioTokenizedPost contract

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface MioNFTInterface {
    function getOwner() external view returns (address);

    function harvest(address _contractOwner) external;

    function tokenURI(uint256 _userNFTID) external view returns (string memory);

    function mintNFT(
        address _to,
        uint256 _mintPrice,
        bytes32 _ipfsHash
    ) external payable;

    function transferNFT(address _to, uint256 _postNFTID) external;
}
