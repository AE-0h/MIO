// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {ERC1155} from "solmate/src/tokens/ERC1155.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract MioAlbum is ERC1155, Owned(msg.sender) {
    using Strings for uint256;

    //------------------------------ERRORS---------------------------------------------//

    error MintPriceNotPaid();
    error MaxSupply();
    error NonExistentTokenURI();
    error WithdrawTransfer();

    //------------------------------Events---------------------------------------------//

    event AlbumMinted(address indexed to, uint256 indexed albumID);

    event TrackMinted(
        address indexed to,
        uint256 indexed albumID,
        uint256 indexed trackID
    );

    //------------------------------STATE VARIABLES---------------------------------------//

    uint256 public albumID;
    uint256 public trackID;
    uint256 public immutable mintPrice;
    uint256 public immutable totalSupply;

    mapping(uint256 => string) public albumURIs;
    mapping(uint256 => string) public trackURIs;
    mapping(uint256 => uint256[]) public tracksByAlbum;

    //------------------------------CONSTRUCTOR----------------------------------------//

    constructor(
        string memory _name,
        string memory _artist,
        uint256 _mintPrice,
        uint256 _initialSupply
    ) payable ERC1155() {
        albumID = 0;
        trackID = 0;
        owner = msg.sender;
        mintPrice = _mintPrice;
        totalSupply = _initialSupply;
    }

    //------------------------------FUNCTIONS-------------------------------------//

    function mintAlbum(address _to) external onlyOwner returns (uint256) {
        uint256 newAlbumID = ++albumID;
        _mint(_to, newAlbumID, 1, "");
        emit AlbumMinted(_to, newAlbumID);
        return newAlbumID;
    }

    function setAlbumURI(
        uint256 _albumID,
        string calldata _uri
    ) external onlyOwner {
        albumURIs[_albumID] = _uri;
        emit URI(_uri, _albumID);
    }

    function mintTrack(
        address _to,
        uint256 _albumID,
        string calldata _ipfsHash
    ) external payable returns (uint256) {
        if (msg.value != mintPrice) {
            revert MintPriceNotPaid();
        }
        uint256 newTrackID = ++trackID;
        _mint(_to, newTrackID, 1, "");
        trackURIs[newTrackID] = _ipfsHash;
        tracksByAlbum[_albumID].push(newTrackID);
        emit TrackMinted(_to, _albumID, newTrackID);
        return newTrackID;
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return trackURIs[_id];
    }

    function getTracksByAlbum(
        uint256 _albumID
    ) external view returns (uint256[] memory) {
        return tracksByAlbum[_albumID];
    }

    function harvest(address payable _contractOwner) external onlyOwner {
        uint256 balance = address(this).balance;
        (bool transferTx, ) = _contractOwner.call{value: balance}("");
        if (!transferTx) {
            revert WithdrawTransfer();
        }
    }
}
