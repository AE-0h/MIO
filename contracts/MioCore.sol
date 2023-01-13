// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import {MioTokenizedPostInterface} from "./interfaces/MioTokenizedPostInterface.sol";
import {Owned} from "solmate/src/auth/Owned.sol";



contract MIOCore is Owned(msg.sender){

    //--------------------------STATE VARIABLES-------------------------------------
    MioTokenizedPostInterface mioTokenizedPost = MioTokenizedPostInterface(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    // mioPost unique id
    uint256 public mioCountID; 
    // mapping of user address to user nft ID
    mapping (address => bool) public userExists;
     // Mapping of user address to user struct
    mapping(address => user) public users;
    // Mapping of mioPost ID to mioPost struct 
    mapping(uint256 => mioPost) public mioPosts;
    // Mapping of mioCountID to each like address
    // that liked the mioPost
 //--------------------------Events--------------------------------------------------------

    // event fired when a new mioPost is written
    // contains: -
    // - current ID of the mioPost
    // - the content of the mioPost
    // - media included in mioPost 
    // - the user that wrote the mioPostl
    // - date/time the mioPost was created
    event postCreated(
        uint256 indexed id,
        string content, 
        string media, 
        address indexed author, 
        uint256 timestamp
    );

    // event fired when a new user is created
    // contains: -
    // - the address of the user
    // - user nft ID
    // - the username of the user
    // - the bio of the user
    // - the profile pic of the user
    // - the profile banner of the user
    event userCreated(
        address indexed userAddress,
        string username, 
        string bio, 
        string profilePic, 
        string profileBanner
    );

    // event fired when a mioPost is liked, true means mioPost has been liked
    // contains:
    // - the address of the liker
    // - the mioPost ID
 //--------------------------CONSTRUCTOR-------------------------------------
    // Establish the owner of the contract as the deployer
    // Set mioPost counter at 0
    constructor()  {
        mioCountID = 0;
        
    }

 //--------------------------STRUCTS-------------------------------------
 // Define a struct mioPost with the following fields: to be used for messege structure
    struct mioPost {
        uint256 id;
        string content;
        string media;
        address author;
    }
    // Define a struct 'user' with the following fields: to be used for user structure
    struct user{
        string username;
        string bio;
        string profilePic;
        string profileBanner;
    }


 //--------------------------FUNCTIONS-------------------------------------

 /// create an art or music NFT

    function createNFT() public payable {
        require(msg.value == (1 ether), "You must pay 1 matic to become a user");
        mioTokenizedPost.mintNFT(msg.sender);
        // pay out "owner" or deployer of contract for user creation gas fee
        payable(owner).transfer(msg.value);
    }

    // transfer an NFT to another user
    function transferNFT(address _to, uint256 _postNFTID) public {
        mioTokenizedPost.transferNFT(_to, _postNFTID);
    }

    // burn an NFT
    function burnNFT(uint256 _postNFTID) public {
        mioTokenizedPost.burnNFT(_postNFTID);
    }

    // get the NFT ID
    function getNFTID() public view returns (uint256) {
        return mioTokenizedPost.getNFTID();
    }




 // Create a new mioPost 
    function addPost(string memory _content, string memory _media) public payable {
        //require that the content is not empty
        require(bytes(_content).length > 0, "Content is required");
        //require that the content is not too long
        require(bytes(_content).length <= 280, "Content is too long");
        //require that the msg has a value of 0.01 ether
        require(msg.value == (1 ether), "You must pay 1 matic to make it offical");
      // Emit the event and increment mioCount
        emit postCreated(mioCountID++, _content, _media, msg.sender, block.timestamp);
        // Create the post
        mioPosts[mioCountID] =  mioPost(mioCountID, _content, _media, msg.sender);
        // pay out "owner" or deployer of contract for mio post gas fee
        payable(owner).transfer(msg.value);
    }


 // Update user
    function updateUser(string memory _username, string memory _bio, string memory _profilePic, string memory _profileBanner) public {
        // Update the user
        users[msg.sender] = user(_username, _bio, _profilePic, _profileBanner);
    }

     function createUser(string memory _username, string memory _bio, string memory _profilePic, string memory _profileBanner) public payable returns (uint256 _userNFTID){
        //require that the user does not exist
        require(!userExists[msg.sender], "User already exists");
        //require that .01 matic is sent
        require(msg.value == (1 ether), "You must pay 1 matic to become a user");
        //create the user
        users[msg.sender] = user(_username, _bio, _profilePic, _profileBanner);
        // Increment the userNFTID and emit event
        emit userCreated(msg.sender, _username, _bio, _profilePic, _profileBanner);
        //set minted to true
        userExists[msg.sender] = true;
        // pay out "owner" or deployer of contract for user creation gas fee
        payable(owner).transfer(msg.value);
    }

      
 // Get a mioPost by counterID
   function getPost(uint256 _id) public view returns (string memory _content, string memory _media, address _author) {
    require(_id <= mioCountID, "Invalid ID");
    // Fetch the mioPost
    mioPost storage _mioPost = mioPosts[_id];
    // Return the mioPost
    _content = _mioPost.content;
    _media = _mioPost.media;
    _author = _mioPost.author;
    return (_content, _media, _author);
    }
   

 // Get all mioPosts by a user
    function getAllUserMioPosts() public view returns(mioPost[] memory){
        // Create a temporary array to store the mioPosts
        mioPost[] memory result = new mioPost[](mioCountID);
        // Create a counter to keep track of the index
        uint256 counter = 0;
        // Loop through all the mioPosts
        for (uint256 i = 1; i <= mioCountID; i++) {
            // Check if the mioPost is not deleted
                // Check if the mioPost is from the user
                if (mioPosts[i].author == msg.sender) {
                    // Add the mioPost to the array
                    result[counter] = mioPosts[i];
                    // Increment the counter
                    counter++;
                }
        }
        // Create a new array with the correct size
        mioPost[] memory _mioPosts = new mioPost[](counter);
        // Copy the mioPosts to the new array
        for (uint256 i = 0; i < counter; i++) {
            _mioPosts[i] = result[i];
        }
        // Return the array
        return _mioPosts;
    }


// Get all mioPosts
    function  getAllMioPosts() public view returns(mioPost[] memory){
        // Create a temporary array to store the mioPosts
        mioPost[] memory result = new mioPost[](mioCountID);
        // Create a counter to keep track of the index
        uint256  counter = 0;
        // Loop through all the mioPosts
        for (uint256 i = 1; i <= mioCountID; i++) {
            // Check if the mioPost is not deleted
                // Add the mioPost to the array
                result[counter] = mioPosts[i];
                // Increment the counter
                counter++;
        }
        // Create a new array with the correct size
        mioPost[] memory _mioPosts = new mioPost[](counter);
        // Copy the mioPosts to the new array
        for (uint256 i = 0; i < counter; i++) {
            _mioPosts[i] = result[i];
        }
        // Return the array
        return _mioPosts;
    } 
       
// Get user
    function getUser(address _userAddress) public view returns (string memory , string memory, string memory, string memory) {
        // Fetch the user
        user memory _user = users[_userAddress];
        // Return the user
        return (_user.username, _user.bio, _user.profilePic, _user.profileBanner);
    }
}
