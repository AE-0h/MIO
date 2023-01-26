// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {Owned} from "solmate/src/auth/Owned.sol";

contract MioNFT is ERC721, Owned(msg.sender) {

    //--------------------------Events-------------------------------------

    // event fired when a new post is made official by another user aside from it's owner
    // contains: -
    // - the address of the user
    // - user nft ID
    // 
    event nftMinted(
        address indexed owner,
        uint256 indexed nftID
    );

    //--------------------------STATE VARIABLES-------------------------------------
    // userNft unique id
    uint256 public nftID;
    // mapping nftID to description
    mapping(uint256 => string) public ipfsHashFromNFTID;

    //--------------------------CONSTRUCTOR-------------------------------------


    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        nftID = 0;
        owner = msg.sender;

    }
    //--------------------------FUNCTIONS-------------------------------------

    function setOwner(address _newOwner) public virtual override onlyOwner {
        owner = _newOwner;
        emit OwnerUpdated(msg.sender, _newOwner);
    }
    function setTokenURI(uint256 _nftID, string calldata _ipfsHash) external {
        ipfsHashFromNFTID[_nftID] = _ipfsHash;
    }
    function tokenURI(uint256 _nftID) public override view returns (string memory) {
        string memory baseURI = "https://ipfs.io/ipfs/";
        string memory _tokenURI = string(abi.encodePacked(baseURI, ipfsHashFromNFTID[_nftID] ));
        return _tokenURI;

    }

    function mintNFT(address _to) external payable onlyOwner{
        require(msg.value == (1 ether), "You must pay 1 matic to ");
        emit nftMinted(_to, ++nftID);
        _safeMint(_to, nftID );
        //transfer msg value to owner
        payable(owner).transfer(msg.value);
    }

    function burnNFT(uint256 _postNFTID) external onlyOwner {
        _burn(_postNFTID);
    }

    function transferNFT(address _to, uint256 _postNFTID) external onlyOwner {
        safeTransferFrom(msg.sender, _to, _postNFTID);
        emit Transfer(msg.sender, _to, _postNFTID);
    }

    function getNFTID() public view returns (uint256) {
        return nftID;
    }

}