//an interface for the MioTokenizedPost contract

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface MioNFTInterface {

    function tokenURI(uint256 _userNFTID) external view returns (string memory);
    function setTokenURI(uint256 _userNFTID, string memory _ipfsHash) external;
    function mintNFT(address _to) external;
    function transferNFT(address _to, uint256 _postNFTID) external;
    function burnNFT(uint256 _postNFTID) external;
    function getNFTID() external view returns (uint256);
    
}

