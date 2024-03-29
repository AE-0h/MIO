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

pragma solidity ^0.8.7;
import {MioThink} from "./MIOThink/MioThink.sol";
import {MioThinkFactory} from "./MIOThink/MioThinkFactory.sol";
import {MioMarket} from "./MIOMarket/MioMarket.sol";
import {MioMarketFactory} from "./MIOMarket/MioMarketFactory.sol";
import {Owned} from "solmate/src/auth/Owned.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";

contract MIOCore is OwnableUpgradeable {
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
    error NotmioVisualFactory();
    //throw error when innsufficient funds are sent to contract
    error InsufficientFunds();
    //throw error when a post doesnt exist
    error PostDoesNotExist();
    //throws error when a user tries to get all of there posts and there are no posts
    error NoPosts();
    // trows error when user already has one mioMarket contract deployed
    error UserAlreadyHasMarket();

    //---------------------------MODIFIERS----------------------------------------
    modifier nonReentrant() virtual {
        require(locked == 1, "REENTRANCY");

        locked = 2;

        _;

        locked = 1;
    }

    //--------------------------STATE VARIABLES-------------------------------------
    uint256 private locked;
    // mioPost unique id
    uint256 private officialPostID;
    // MioThinkFactory contract
    MioThinkFactory public mioThinkFactory;
    // MioMarketFactory contract
    MioMarketFactory public mioMarketFactory;

    // mapping of user address to user nft ID
    mapping(address => bool) public userExists;
    // Mapping of user address to user struct
    mapping(address => user) public users;
    // Mapping of mioPost ID to mioPost struct
    mapping(uint256 => mioPost) public mioPosts;

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
        string timestamp,
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

    // event fired when user MioVision contract is created
    // contains: -
    // - the address of the user
    // - the address of the user MioVision contract
    event userThinkContractCreated(
        address indexed userAddress,
        address indexed userNFTContract,
        string name,
        string symbol,
        uint256 totalSupply,
        uint256 mintPrice,
        string baseURI
    );

    // event fired when MioResale contract is created
    // contains: -
    // - the address of the user
    // - the address of the user MioResale contract
    event userMarketContractCreated(
        address indexed userAddress,
        address indexed userResaleContract
    );

    //--------------------------CONSTRUCTOR-------------------------------------
    // Set mioPost counter at 0
    function initialize(
        address _eoaInvoker,
        MioThinkFactory _mioThinkFactory,
        MioMarketFactory _mioMarketFactory
    ) public initializer {
        __Ownable_init();
        transferOwnership(_eoaInvoker);

        officialPostID = 0; // Set the initial value of `officialPostID`
        mioThinkFactory = _mioThinkFactory;
        mioMarketFactory = _mioMarketFactory;

        locked = 1; // Set the initial value of `locked` (in ReentrancyGuard.sol)
    }

    //--------------------------STRUCTS-------------------------------------
    // Define a struct mioPost with the following fields: to be used for messege structure
    struct mioPost {
        uint256 id;
        string content;
        string media;
        string timeStamp;
        address author;
    }
    // Define a struct 'user' with the following fields: to be used for user structure
    struct user {
        string username;
        string bio;
        string profilePic;
        string profileBanner;
        address userAddress;
        bool marketExists;
    }

    struct userVisualContract {
        string name;
        string symbol;
        address contractAddress;
        uint256 totalSupply;
        uint256 mintPrice;
        string baseURI;
    }

    //--------------------------FUNCTIONS-------------------------------------

    function createUserMarketContract() public {
        //error market contract already exists
        if (users[msg.sender].marketExists != false) {
            revert UserAlreadyHasMarket();
        }
        address newcontract = mioMarketFactory.deployUserMarketContract(
            msg.sender
        );

        emit userMarketContractCreated(msg.sender, newcontract);
        users[msg.sender].marketExists = true;
    }

    function createNewThinkContract(
        string memory _title,
        string memory _mediaContent,
        string memory _thought,
        string memory _collectionBaseURI,
        uint256 _totalSupply,
        uint256 _mintPrice
    ) public payable nonReentrant {
        //must have msg.value of 1 ether
        if (msg.value != (1 * 10 ** 16 wei)) {
            revert InsufficientFunds();
        }
        //error msg.sender is an existing user
        if (!userExists[msg.sender]) {
            revert UserDoesNotExist();
        }
        address newcontract = mioThinkFactory.deployUserContract(
            _title,
            _mediaContent,
            _thought,
            _collectionBaseURI,
            _totalSupply,
            _mintPrice,
            msg.sender
        );

        emit userThinkContractCreated(
            msg.sender,
            newcontract,
            _title,
            _mediaContent,
            _totalSupply,
            _mintPrice,
            _collectionBaseURI
        );
        payable(owner()).transfer(msg.value);
    }

    // Create a new mioPost
    function makePostOfficial(
        string memory _content,
        string memory _media,
        string memory _timeStamp
    ) public payable nonReentrant {
        //user must exist
        if (!userExists[msg.sender]) revert UserDoesNotExist();
        //use error  content is not empty
        if (bytes(_content).length == 0) revert NoContent();
        //require that the content is not too long
        if (bytes(_content).length > 280) revert PostTooLong();
        //require that the msg has a value of 0.01 ether
        if (msg.value < (1 * 10 ** 16 wei)) revert InsufficientFunds();
        // Emit the event and increment mioCount
        emit postCreated(
            ++officialPostID,
            _content,
            _media,
            _timeStamp,
            msg.sender
        );
        // Create the post
        mioPosts[officialPostID] = mioPost(
            officialPostID,
            _content,
            _media,
            _timeStamp,
            msg.sender
        );
        // pay out "owner" or deployer of contract for mio post gas fee
        payable(owner()).transfer(msg.value);
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
            msg.sender,
            users[msg.sender].marketExists
        );
    }

    //check if user exists
    function checkUserExists(address _userAddress) public view returns (bool) {
        return userExists[_userAddress];
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
        //require that .01 matic is sent in wei
        if (msg.value != (1 * 10 ** 16 wei)) {
            revert InsufficientFunds();
        }
        //create the user
        users[msg.sender] = user(
            _username,
            _bio,
            _profilePic,
            _profileBanner,
            msg.sender,
            false
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
        // pay out "owner" or deployer of contract for user creation
        payable(owner()).transfer(msg.value);
    }

    // Get a mioPost by counterID
    function getPost(
        uint256 _id
    )
        public
        view
        returns (
            string memory _content,
            string memory _media,
            string memory _timeStamp,
            address _author
        )
    {
        if (!userExists[msg.sender]) revert UserDoesNotExist();
        // Check if the mioPost exists
        if (mioPosts[_id].id > officialPostID || mioPosts[_id].id == 0) {
            revert PostDoesNotExist();
        }
        // Fetch the mioPost
        mioPost memory _mioPost = mioPosts[_id];
        // Return the mioPost
        _content = _mioPost.content;
        _media = _mioPost.media;
        _timeStamp = _mioPost.timeStamp;
        _author = _mioPost.author;
        return (_content, _media, _timeStamp, _author);
    }

    // Get all mioPosts by a user
    function getAllUserMioPosts(
        address _user
    ) public view returns (mioPost[] memory result) {
        if (!userExists[msg.sender]) revert UserDoesNotExist();
        if (officialPostID == 0) {
            revert NoPosts();
        }
        // Create a temporary array to store the mioPosts
        result = new mioPost[](officialPostID);
        // Create a counter to keep track of the index
        uint256 counter = 0;
        // Loop through all the mioPosts
        for (uint256 i = 1; i <= officialPostID; i++) {
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
        result = new mioPost[](officialPostID);
        //Create a counter to keep track of the index
        uint256 counter = 0;
        // Loop through all the mioPosts
        for (uint256 i = 1; i <= officialPostID; i++) {
            // Add the mioPost to the array
            result[counter] = mioPosts[i];
            // Increment the counter
            counter++;
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
