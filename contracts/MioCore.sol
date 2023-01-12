// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

 import {ERC721} from "solmate/src/tokens/ERC721.sol";

contract MIOCore is ERC721 {

    //--------------------------STATE VARIABLES-------------------------------------
    // deployer of the contract
    address public owner;
    // mioPost unique id
    uint256 public mioCountID = 0; 
    // userNft unique id
    uint256 public userNFTID = 0;
    // mapping of user address to user nft ID
    mapping (address => bool) public minted;
    // Mapping of user address to user nft ID
    mapping(address => uint256) public userAddressToNFTID;
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
    event userCreated(
        address indexed userAddress,
        uint indexed userNFTID,
        string username, 
        string bio, 
        string profilePic, 
        string profileBanner
    );

    // event fired when a mioPost is liked, true means mioPost has been liked
    // contains:
    // - the address of the liker
    // - the mioPost ID
    // - boolean that represents if the user has liked the tweet or not
    event postLiked(address indexed liker, uint256 postID, bool state_of_like);

//--------------------------CONSTRUCTOR-------------------------------------
    // Establish the owner of the contract as the deployer
    // Set mioPost counter at 0
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
        mioCountID = 0;
        
    }

//--------------------------STRUCTS-------------------------------------
// Define a struct mioPost with the following fields: to be used for messege structure
    struct mioPost {
        uint256 id;
        string content;
        string media;
        uint256 timestamp;
        address author;
    }
    // Define a struct 'user' with the following fields: to be used for user structure
    struct user{
        string username;
        string bio;
        string profilePic;
        string profileBanner;
        uint256 userNFTID;
    }


//--------------------------FUNCTIONS-------------------------------------

function tokenURI(uint256 _userNFTID) public pure virtual override returns (string memory) {
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
        mioPosts[mioCountID] = mioPost(mioCountID, _content, _media,block.timestamp, msg.sender);
        // pay out "owner" or deployer of contract for mio post gas fee
        payable(owner).transfer(msg.value);
    }

// Update user
    function updateUser(string memory _username, string memory _bio, string memory _profilePic, string memory _profileBanner) public {
        // Update the user
        users[msg.sender] = user(_username, _bio, _profilePic, _profileBanner, userNFTID);
    }

     function createUser(string memory _username, string memory _bio, string memory _profilePic, string memory _profileBanner) public payable{
        //require that the user does not exist
        require(!minted[msg.sender], "User already exists");
        //require that .01 matic is sent
        require(msg.value == (1 ether), "You must pay 1 matic to become a user");

        users[msg.sender] = user(_username, _bio, _profilePic, _profileBanner, userNFTID);
        // Increment the userNFTID and emit event
        emit userCreated(msg.sender, userNFTID++, _username, _bio, _profilePic, _profileBanner);
        //mint user Nft with id
        _safeMint(msg.sender, userNFTID);
        //set minted to true
        minted[msg.sender] = true;
        // pay out "owner" or deployer of contract for user creation gas fee
        payable(owner).transfer(msg.value);
    }

      
// Get a mioPost by counterID
    function getPost(uint256 _id) public view returns (string memory _content, string memory _media, address _author) {
        require(_id < mioCountID, "This was never made official");
        // Fetch the mioPost
        mioPost memory _mioPost = mioPosts[_id];
        // Return the mioPost
        return ( _mioPost.content, _mioPost.media, _mioPost.author);
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
        uint256 counter = 0;
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
