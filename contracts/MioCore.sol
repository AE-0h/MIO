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

contract MIOCore is Owned(msg.sender), ReentrancyGuard {
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
    //throws error when a user tries to get all of there posts and there are no posts
    error NoPosts();

    //---------------------------IMMUTABLES----------------------------------------
    // address of the MioNFTFactory contract
    MioNFTFactory immutable mioNFTFactory;

    //--------------------------STATE VARIABLES-------------------------------------
    // current nft contract being used by the user
    address userNFTAddress;
    // mioPost unique id
    uint256 private mioCountID;
    // mapping of user address to user nft ID
    mapping(address => bool) public userExists;
    // Mapping of user address to user struct
    mapping(address => user) public users;
    // Mapping of mioPost ID to mioPost struct
    mapping(uint256 => mioPost) public mioPosts;
    // mapping of user address to an array of nft contract structs
    mapping(address => userNFTContract[]) public userNFTContracts;
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
        address indexed author
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
    constructor(MioNFTFactory _mioNFTFactory) {
        mioCountID = 0;
        owner = payable(msg.sender);
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
    struct user {
        string username;
        string bio;
        string profilePic;
        string profileBanner;
        address userAddress;
    }

    struct userNFTContract {
        string name;
        string symbol;
        address contractAddress;
        // uint nonce
    }

    //--------------------------FUNCTIONS-------------------------------------

    // Create a new user nft contract
    function createUserNFTContract(
        string memory _name,
        string memory symbol
    ) external payable {
        //must have msg.value of 1 ether
        if (msg.value != 1 ether) {
            revert InsufficientFunds();
        }
        //error msg.sender is an existing user
        if (!userExists[msg.sender]) {
            revert UserDoesNotExist();
        }
        address newcontract = mioNFTFactory.deployUserContract(_name, symbol);
        userNFTContracts[msg.sender].push(
            userNFTContract(_name, symbol, newcontract)
        );
        setNFTContractAddress(_name, symbol);
        emit userNFTContractCreated(msg.sender, newcontract);
        payable(owner).transfer(msg.value);
    }

    // get deployed nft contract address from name and symbol
    function setNFTContractAddress(
        string memory _name,
        string memory _symbol
    ) internal returns (address) {
        for (uint i = 0; i < userNFTContracts[msg.sender].length; i++) {
            if (
                keccak256(
                    abi.encodePacked(userNFTContracts[msg.sender][i].name)
                ) ==
                keccak256(abi.encodePacked(_name)) &&
                keccak256(
                    abi.encodePacked(userNFTContracts[msg.sender][i].symbol)
                ) ==
                keccak256(abi.encodePacked(_symbol))
            ) {
                userNFTAddress = userNFTContracts[msg.sender][i]
                    .contractAddress;
                return userNFTAddress;
            }
        }
    }

    // mint an NFT from specific user contract
    function mintNFT(address _to) public {
        // if(msg.value < 1 ether){revert InsufficientFunds();}
        MioNFTInterface(userNFTAddress).mintNFT(_to);
    }

    // transfer an NFT to another user
    function transferNFT(address _to, uint256 _postNFTID) public {
        MioNFTInterface(userNFTAddress).transferNFT(_to, _postNFTID);
    }

    // burn an NFT
    function burnNFT(uint256 _postNFTID) public {
        MioNFTInterface(userNFTAddress).burnNFT(_postNFTID);
    }

    // Create a new mioPost
    function addPost(
        string memory _content,
        string memory _media
    ) public payable nonReentrant {
        //user must exist
        if (!userExists[msg.sender]) revert UserDoesNotExist();
        //use error  content is not empty
        if (bytes(_content).length == 0) revert NoContent();
        //require that the content is not too long
        if (bytes(_content).length > 280) revert PostTooLong();
        //require that the msg has a value of 0.01 ether
        if (msg.value < 0.01 ether) revert InsufficientFunds();
        // Emit the event and increment mioCount
        emit postCreated(++mioCountID, _content, _media, msg.sender);
        // Create the post
        mioPosts[mioCountID] = mioPost(
            mioCountID,
            _content,
            _media,
            msg.sender
        );
        // pay out "owner" or deployer of contract for mio post gas fee
        payable(owner).transfer(msg.value);
    }

    // Update user
    function updateUser(
        string memory _username,
        string memory _bio,
        string memory _profilePic,
        string memory _profileBanner
    ) public {
        //require that the user exists
        if (!userExists[msg.sender]) revert UserDoesNotExist();
        //require user is updating only their own profile
        if (users[msg.sender].userAddress != msg.sender) {
            revert NotYourProfile();
        }

        // Update the user
        users[msg.sender] = user(
            _username,
            _bio,
            _profilePic,
            _profileBanner,
            msg.sender
        );
    }

    // Create a new user
    function createUser(
        string memory _username,
        string memory _bio,
        string memory _profilePic,
        string memory _profileBanner
    ) public payable nonReentrant {
        //require that the user does not exist
        if (userExists[msg.sender]) {
            revert UserAlreadyExists();
        }
        //require that .01 matic is sent
        if (msg.value != (1 ether)) {
            revert InsufficientFunds();
        }
        //create the user
        users[msg.sender] = user(
            _username,
            _bio,
            _profilePic,
            _profileBanner,
            msg.sender
        );
        // Increment the userNFTID and emit event
        emit userCreated(
            msg.sender,
            _username,
            _bio,
            _profilePic,
            _profileBanner
        );
        //set minted to true
        userExists[msg.sender] = true;
        // pay out "owner" or deployer of contract for user creation gas fee
        payable(owner).transfer(msg.value);
    }

    // Get a mioPost by counterID
    function getPost(
        uint256 _id
    )
        public
        view
        returns (string memory _content, string memory _media, address _author)
    {
        if (!userExists[msg.sender]) revert UserDoesNotExist();
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
    function getAllUserMioPosts(
        address _user
    ) public view returns (mioPost[] memory result) {
        if (!userExists[msg.sender]) revert UserDoesNotExist();
        if (mioCountID == 0) {
            revert NoPosts();
        }
        // Create a temporary array to store the mioPosts
        result = new mioPost[](mioCountID);
        // Create a counter to keep track of the index
        uint256 counter = 0;
        // Loop through all the mioPosts
        for (uint256 i = 1; i <= mioCountID; i++) {
            // Check if the mioPost is from the user
            if (mioPosts[i].author == _user) {
                // Add the mioPost to the array
                result[counter] = mioPosts[i];
                // Increment the counter
                counter++;
            }
        }
        //pop the empty elements from the array
        assembly {
            mstore(result, counter)
        }
        return result;
    }

    // Get all mioPosts
    function getAllMioPosts() public view returns (mioPost[] memory result) {
        //check if msg.sender is associated with a user account
        if (!userExists[msg.sender]) revert UserDoesNotExist();
        // Create a temporary array to store the mioPosts
        result = new mioPost[](mioCountID);
        //Create a counter to keep track of the index
        uint256 counter = 0;
        // Loop through all the mioPosts
        for (uint256 i = 1; i <= mioCountID; i++) {
            // Add the mioPost to the array
            result[counter] = mioPosts[i];
            // Increment the counter
            counter++;
        }
        assembly {
            mstore(result, counter)
        }
        return result;
    }

    // Get user
    function getUser(
        address _userAddress
    )
        public
        view
        returns (string memory, string memory, string memory, string memory)
    {
        // Check if the user exists
        if (!userExists[msg.sender]) revert UserDoesNotExist();
        // Fetch the user
        user memory _user = users[_userAddress];
        // Return the user
        return (
            _user.username,
            _user.bio,
            _user.profilePic,
            _user.profileBanner
        );
    }
}
