// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {ERC721} from "solmate/src/tokens/ERC721.sol";
import {Owned} from "solmate/src/auth/Owned.sol";

contract MioTokenizedPost is ERC721, Owned(msg.sender) {

    //--------------------------Events-------------------------------------

    // event fired when a new post is made official by another user aside from it's owner
    // contains: -
    // - the address of the user
    // - user nft ID
    // 
    event postMinted(
        address indexed _userAddress,
        uint indexed _userNFTID
    );

    //--------------------------STATE VARIABLES-------------------------------------

    // userNft unique id
    uint256 public postNFTID;
    //mapping of user address to posts
    mapping(address => uint256[]) public userAddressToPostID;

    //--------------------------CONSTRUCTOR-------------------------------------


    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        postNFTID = 0;
        owner = msg.sender;
    }
    //--------------------------FUNCTIONS-------------------------------------
    //external function that safemints a new NFT

    function tokenURI(uint256 _userNFTID) public pure virtual override returns (string memory) {
    }

    function mintNFT(address _to) external {
        emit postMinted(_to, postNFTID++);
        _safeMint(_to, postNFTID);
    }

    function burnPostNFT(uint256 _postNFTID) external {
        _burn(_postNFTID);
    }

    function transferPostNFT(address _to, uint256 _postNFTID) external {
        safeTransferFrom(msg.sender, _to, _postNFTID);
        emit Transfer(msg.sender, _to, _postNFTID);
    }

    function getPostNFTID() public view returns (uint256) {
        return postNFTID;
    }
}