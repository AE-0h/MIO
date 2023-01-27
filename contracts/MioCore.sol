// SPDX-License-Identifier: MIT

/*/──────────────────────────────────────────────────
─██████──────────██████─██████████─██████████████─
─██░░██████████████░░██─██░░░░░░██─██░░░░░░░░░░██─
─██░░░░░░░░░░░░░░░░░░██─████░░████─██░░██████░░██─
─██░░██████░░██████░░██───██░░██───██░░██──██░░██─
─██░░██──██░░██──██░░██───██░░██───██░░██──██░░██─
─██░░██──██░░██──██░░██───██░░██───██░░██──██░░██─
─██░░██──██████──██░░██───██░░██───██░░██──██░░██─
─██░░██──────────██░░██───██░░██───██░░██──██░░██─
─██░░██──────────██░░██─████░░████─██░░██████░░██─
─██░░██──────────██░░██─██░░░░░░██─██░░░░░░░░░░██─
─██████──────────██████─██████████─██████████████─
──────────────────────────────────────────────────/*/


pragma solidity ^0.8.9;
import {MioNFTFactory} from "./MioNFTFactory.sol";
import {MioNFTInterface} from "./interfaces/MioNFTInterface.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import {ReentrancyGuard} from "solmate/src/utils/ReentrancyGuard.sol";

contract MIOCore is Owned(msg.sender), ReentrancyGuard{
    //----------------------------ERRORS-------------------------------------------
    // error thrown when a user tries to create a user that already exists
    error UserAlreadyExists();
    // error thrown when a user doesnt exist
    error UserDoesNotExist();
    //error thrown when a user tries to update a profile that isn't theirs
    error NotYourProfile();
    // error thrown when no content is provided
    error NoContent();
    // error thrown when a post length in bytes is greater than 280
    error PostTooLong();
    //error thrown when createUserNFTContract is called by anyone except factory contract
    error NotMioNFTFactory();
    //throw error when innsufficient funds are sent to contract
    error InsufficientFunds();
    //throw error when a post doesnt exist
    error PostDoesNotExist();


    //---------------------------IMMUTABLES----------------------------------------
    // address of the MioNFTFactory contract
    MioNFTFactory immutable mioNFTFactory;

    //--------------------------STATE VARIABLES-------------------------------------
    //last UserID Generated
    uint64 public lastUserID;
    // address of the MioNFTFactory contract
    address mioNFTAddress;
    // mioPost unique id
    uint256 private mioCountID; 
    // mapping of user address to user nft ID
    mapping (address => bool) public userExists;
     // Mapping of user address to user struct
    mapping(address => user) public users;
    // Mapping of mioPost ID to mioPost struct 
    mapping(uint256 => mioPost) public mioPosts;
    // mapping of user address to an array of nft contract address
    mapping(address => address[]) public userNFTContracts;
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

    // event fired when user nft contract is created
    // contains: -
    // - the address of the user
    // - the address of the user nft contract
    event userNFTContractCreated(
        address indexed userAddress,
        address indexed userNFTContract
    );

 //--------------------------CONSTRUCTOR-------------------------------------
    // Establish the owner of the contract as the deployer
    // Set mioPost counter at 0
    constructor(
        MioNFTFactory _mioNFTFactory
    ) {
        mioCountID = 0;
        owner  = payable(msg.sender); 
        mioNFTFactory = _mioNFTFactory;

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
        address userAddress;
    }


 //--------------------------FUNCTIONS-------------------------------------

    // Create a new user nft contract
    function createUserNFTContract(string memory _name, string memory symbol) external{
        //error msg.sender is an existing user
        if(!userExists[msg.sender]){
            revert UserDoesNotExist();
        }

       address newcontract =  mioNFTFactory.deployUserContract(_name, symbol);
        userNFTContracts[msg.sender].push(newcontract);
        emit userNFTContractCreated(msg.sender, newcontract);
    }

    // mint an NFT from specific user contract
    function mintNFT(address _to) public {
        MioNFTInterface(mioNFTAddress).mintNFT(_to);
    }

    // transfer an NFT to another user
    function transferNFT(address _to, uint256 _postNFTID) public {
        MioNFTInterface(mioNFTAddress).transferNFT(_to, _postNFTID);
    }

    // burn an NFT
    function burnNFT(uint256 _postNFTID) public {
        MioNFTInterface(mioNFTAddress).burnNFT(_postNFTID);
    }
    //TODO: add args in NFT logic for amount in collection and price of NFT (research transmision and frankie solution VRGDA)
    //TODO @https://github.com/transmissions11/VRGDAs/tree/c2f3afebcb1d449572b3e5ce3a6acb9cf4a957cd

 // Create a new mioPost 
    function addPost(string memory _content, string memory _media) public payable nonReentrant {
        //use error  content is not empty
        if(bytes(_content).length == 0) revert NoContent();
        //require that the content is not too long
        if(bytes(_content).length > 280) revert PostTooLong();
        //require that the msg has a value of 0.01 ether
        if(msg.value < 0.01 ether) revert InsufficientFunds();
      // Emit the event and increment mioCount
        emit postCreated(++mioCountID, _content, _media, msg.sender, block.timestamp);
        // Create the post
        mioPosts[mioCountID] =  mioPost(mioCountID, _content, _media, msg.sender);
        // pay out "owner" or deployer of contract for mio post gas fee
        payable(owner).transfer(msg.value);
    }


 // Update user
    function updateUser(string memory _username, string memory _bio, string memory _profilePic, string memory _profileBanner) public {
        //require that the user exists
        if(userExists[msg.sender] = false) { revert UserDoesNotExist(); }
        //require user is updating only their own profile
        if(users[msg.sender].userAddress != msg.sender) { revert NotYourProfile(); }

        // Update the user
        users[msg.sender] = user(_username, _bio, _profilePic, _profileBanner, msg.sender);
    }
// Create a new user
     function createUser(string memory _username, string memory _bio, string memory _profilePic, string memory _profileBanner) public payable nonReentrant{
        //require that the user does not exist
        if(userExists[msg.sender]) { revert UserAlreadyExists(); }
        //require that .01 matic is sent
        if(msg.value != (1 ether)) { revert InsufficientFunds(); }
        //create the user
        users[msg.sender] = user(_username, _bio, _profilePic, _profileBanner, msg.sender);
        // Increment the userNFTID and emit event
        emit userCreated(msg.sender, _username, _bio, _profilePic, _profileBanner);
        //set minted to true
        userExists[msg.sender] = true;
        // pay out "owner" or deployer of contract for user creation gas fee
        payable(owner).transfer(msg.value);
    }

      
 // Get a mioPost by counterID
   function getPost(uint256 _id) public view returns (string memory _content, string memory _media, address _author) {
    // Check if the mioPost exists
    if (mioPosts[_id].id > mioCountID || mioPosts[_id].id == 0) {
        revert PostDoesNotExist();
    }
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
        return result;
    }

// Get all mioPosts
    function  getAllMioPosts() public view returns(mioPost[] memory){
        // Create a temporary array to store the mioPosts
        mioPost[] memory result = new mioPost[](mioCountID);
        //Create a counter to keep track of the index
        uint256  counter = 0;
        // Loop through all the mioPosts
        for (uint256 i = 1; i <= mioCountID; i++) {
                // Add the mioPost to the array
                result[counter] = mioPosts[i];
                // Increment the counter
                counter++;
        }
      
        return result;
    } 
       
// Get user
    function getUser(address _userAddress) public view returns (string memory , string memory, string memory, string memory) {
        // Fetch the user
        user memory _user = users[_userAddress];
        // Return the user
        return (_user.username, _user.bio, _user.profilePic, _user.profileBanner);
    }
}
