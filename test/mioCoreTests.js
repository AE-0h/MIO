const { expect, assert } = require("chai");
const { FixedNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("MIOCore Contract Tests", () => {
  beforeEach(async () => {
    //deploy NFT factory contract passing in NFT contract address to constructor
    const NFTContractFactory = await ethers.getContractFactory("MioNFTFactory");
    nftContractFactory = await NFTContractFactory.deploy();
    await nftContractFactory.deployed();
    //deploy MIOCore contract passing in NFT factory contract address to constructor
    const MIOCore = await ethers.getContractFactory("MIOCore");
    miocore = await MIOCore.deploy(nftContractFactory.address);
    await miocore.deployed();
    //get signers and assign to user1 and user2 on chosen network
    [user1, user2, unregisteredUser] = await ethers.getSigners();

    //Initialize createUser data
    username = "Miouser1";
    bio = "Hello world";
    profilePic = "https://blah.com/pp.jpg";
    profileBanner = "https://blah.com/pb.jpg";
    //create user1
    mioUser = await miocore
      .connect(user1)
      .createUser(username, bio, profilePic, profileBanner, {
        value: ethers.utils.parseEther("0.01"),
        gasLimit: 1000000,
      });
    //Initialize createUser data
    user2name = "Miouser2";
    bio2 = "ello erld";
    profilePic2 = "https://blah.com/pp2.jpg";
    profileBanner2 = "https://blah.com/pb2.jpg";
    //create user2
    mioUser2 = await miocore
      .connect(user2)
      .createUser(user2name, bio2, profilePic2, profileBanner2, {
        value: ethers.utils.parseEther("0.01"),
        gasLimit: 1000000,
      });
  });

  describe("Ownership and Users", () => {
    it("it should save msg.sender as owner in constructor", async () => {
      expect(await miocore.connect(user2).owner()).to.equal(user1.address);
    });

    it("should be able to check if a user exists", async () => {
      expect(
        await miocore.connect(user1).checkUserExists(user1.address)
      ).to.equal(true);
    });

    it("should be able to create a user and retrieve user data from user address using getUser()", async () => {
      const user = await miocore
        .connect(user2)
        .getUser(await mioUser2.wait().then((x) => x.from));

      expect(user[0]).to.equal("Miouser2");
      expect(user[1]).to.equal("ello erld");
      expect(user[2]).to.equal("https://blah.com/pp2.jpg");
      expect(user[3]).to.equal("https://blah.com/pb2.jpg");
    });
  });
  describe("Posts and Events", () => {
    it("should be able to make a post official while emmiting events for user creation and officiating post", async () => {
      await expect(mioUser)
        .to.emit(miocore, "userCreated")
        .withArgs(user1.address, username, bio, profilePic, profileBanner);
      //Initialize addMioPost data
      let postContent = "post1";
      let postImage = "https://blah.com/image1.jpg";
      let timestamp = Date.now().toString();
      let userAddPost = await miocore
        .connect(user1)
        .addPost(postContent, postImage, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 1000000,
        });
      //emit postCreated(_postID, _postContent, _postMedia, _author);
      await expect(userAddPost)
        .to.emit(miocore, "postCreated")
        .withArgs(1, postContent, postImage, timestamp, user1.address);
    });

    it("should add 2 posts made official while also retrieving all posts made official by specific user and by all users on platform", async () => {
      await expect(mioUser)
        .to.emit(miocore, "userCreated")
        .withArgs(user1.address, username, bio, profilePic, profileBanner);

      //emit userCreated(msg.sender, _username, _bio, _profilePic, _profileBanner);
      await expect(mioUser2)
        .to.emit(miocore, "userCreated")
        .withArgs(user2.address, user2name, bio2, profilePic2, profileBanner2);

      //Initialize addMioPost data
      // 1st post user 1
      let postContent = "post2";
      let postImage = "https://blah.com/image2.jpg";
      let timestamp = Date.now().toString();
      // 2nd post user 1
      let pc2 = "post3";
      let pi2 = "https://blah.com/image3.jpg";
      //add post user 1
      let userAddPost = await miocore
        .connect(user1)
        .addPost(postContent, postImage, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 2000000,
        });

      await expect(userAddPost)
        .to.emit(miocore, "postCreated")
        .withArgs(1, postContent, postImage, timestamp, user1.address);

      let userAddPost2 = await miocore
        .connect(user1)
        .addPost(pc2, pi2, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 2000000,
        });

      await expect(userAddPost2)
        .to.emit(miocore, "postCreated")
        .withArgs(2, pc2, pi2, timestamp, user1.address);
      // 1st post user 2
      let pc4 = "post4";
      let pi4 = "https://blah.com/image4.jpg";
      // 2nd post user 2
      let pc5 = "post5";
      let pi5 = "https://blah.com/image5.jpg";

      //add post user 2
      let user2PostCreate = await miocore
        .connect(user2)
        .addPost(pc4, pi4, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 2000000,
        });

      await expect(user2PostCreate)
        .to.emit(miocore, "postCreated")
        .withArgs(3, pc4, pi4, timestamp, user2.address);
      //add post user 2

      let user2PostCreate2 = await miocore
        .connect(user2)
        .addPost(pc5, pi5, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 10000000,
        });
      await expect(user2PostCreate2)
        .to.emit(miocore, "postCreated")
        .withArgs(4, pc5, pi5, timestamp, user2.address);

      //get all posts for user 1
      let allUser1Post = await miocore
        .connect(user1)
        .getAllUserMioPosts(user1.address);

      //get all posts for user 2
      let allUser2Post = await miocore
        .connect(user2)
        .getAllUserMioPosts(user2.address);
      //get all posts made offical by any user on the platform
      let allMioPosts = await miocore.connect(user1).getAllMioPosts();

      // filter out empty array
      let post1Filter = await allUser1Post[0].filter((item) => item !== "");
      //filter out empty array
      let post2Filter = await allUser1Post[1].filter((item) => item !== "");
      //filter out empty array
      let post3Filter = await allUser2Post[0].filter((item) => item !== "");
      //filter out empty array
      let post4Filter = await allUser2Post[1].filter((item) => item !== "");

      //check array of all posts made official by any user on the platform length is equal to 4
      expect(await allMioPosts.length).to.equal(4);

      //check array of user post length
      expect(await allUser1Post.length).to.equal(2);
      //check post 1
      expect(await post1Filter.length).to.equal(5);
      expect(await post1Filter[1]).to.equal("post2");
      expect(await post1Filter[2]).to.equal("https://blah.com/image2.jpg");
      expect(await post1Filter[4]).to.equal(user1.address);
      //check post 2
      expect(await post2Filter.length).to.equal(5);
      expect(await post2Filter[1]).to.equal("post3");
      expect(await post2Filter[2]).to.equal("https://blah.com/image3.jpg");
      expect(await post2Filter[4]).to.equal(user1.address);

      //check array of user post length
      expect(await allUser2Post.length).to.equal(2);
      //check post 1
      expect(await post3Filter.length).to.equal(5);
      expect(await post3Filter[1]).to.equal("post4");
      expect(await post3Filter[2]).to.equal("https://blah.com/image4.jpg");
      expect(await post3Filter[4]).to.equal(user2.address);
      //check post 2
      expect(await post4Filter.length).to.equal(5);
      expect(await post4Filter[1]).to.equal("post5");
      expect(await post4Filter[2]).to.equal("https://blah.com/image5.jpg");
      expect(await post4Filter[4]).to.equal(user2.address);
    });
  });

  describe("createUserNFTContract", () => {
    it("should create a new user NFT contract", async () => {
      await expect(mioUser)
        .to.emit(miocore, "userCreated")
        .withArgs(user1.address, username, bio, profilePic, profileBanner);

      let name = "MioNFT";
      let symbol = "MIO";
      let maxSupply = 200;
      let mintPrice = (FixedNumber.from("0.02") * 10 ** 18).toString();
      let baseURI = "https://ipfs.io/ipfs/";
      //create nft contract
      let nftContract = await miocore
        .connect(user1)
        .createUserNFTContract(name, symbol, maxSupply, mintPrice, baseURI, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 3500000,
        });

      let nftContractTx = await nftContract.wait();
      //get contract address
      let nftTxHash = await nftContractTx.transactionHash;
      let nftTxReceipt = await ethers.provider.getTransactionReceipt(nftTxHash);

      //exception from mumbai to hardhat network (mumbai contract =logs[1] hardhat=logs[0])
      let nftContractAddress = nftTxReceipt.logs[0].address;
      console.log(nftContractAddress);

      await expect(nftContract)
        .to.emit(miocore, "userNFTContractCreated")
        .withArgs(
          user1.address,
          nftContractAddress,
          name,
          symbol,
          maxSupply,
          mintPrice,
          baseURI
        );
    });

    it("should revert with InsufficientFunds error if msg.value is not 0.01 matic", async () => {
      const _name = "TestNFT";
      const _symbol = "TNFT";
      const _totalSupply = 1000;
      const _mintPrice = ethers.utils.parseEther("0.1");
      const _baseURI = "https://ipfs.io/ipfs/";

      try {
        await miocore
          .connect(user1)
          .createUserNFTContract(
            _name,
            _symbol,
            _totalSupply,
            _mintPrice,
            _baseURI,
            {
              value: ethers.utils.parseEther("0"),
              gasLimit: 2000000,
            }
          );
        assert.fail("Expected InsufficientFunds error");
      } catch (error) {
        assert(
          error.message.includes("revert InsufficientFunds"),
          `Unexpected error: ${error.message}`
        );
      }
    });

    it("should revert with UserDoesNotExist error if user is not registered", async () => {
      const _name = "TestNFT";
      const _symbol = "TNFT";
      const _totalSupply = 1000;
      const _mintPrice = ethers.utils.parseEther("0.1");
      const _baseURI = "https://ipfs.io/ipfs/";

      try {
        await miocore
          .connect(unregisteredUser)
          .createUserNFTContract(
            _name,
            _symbol,
            _totalSupply,
            _mintPrice,
            _baseURI,
            {
              value: ethers.utils.parseEther("1"),
              gasLimit: 2000000,
            }
          );
        assert.fail("Expected UserDoesNotExist error");
      } catch (error) {
        assert(
          error.message.includes("revert UserDoesNotExist"),
          `Unexpected error: ${error.message}`
        );
      }
    });
  });

  describe("mintUserNFT", () => {
    it("should mint a new NFT for the user", async () => {
      // Set up the test by creating an NFT contract
      // and getting the user NFT address (use the code from the previous test)

      const _hash = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG";
      const mintPrice = ethers.utils.parseEther("0.1");

      await miocore.connect(user1).mintUserNFT(user1.address, _hash, {
        value: mintPrice,
        gasLimit: 2000000,
      });

      const nftContract = new ethers.Contract(
        userNFTAddress,
        MioNFTInterface.abi,
        user1
      );
      const nftOwner = await nftContract.ownerOf(1); // Assuming it's the first NFT minted

      expect(nftOwner).to.equal(user1.address);
    });
  });

  describe("transferNFT", () => {
    it("should transfer an NFT to another user", async () => {
      // Set up the test by creating an NFT contract, minting an NFT,
      // and getting the user NFT address (use the code from the previous tests)

      const _postNFTID = 1;

      await miocore.connect(user1).transferNFT(user2.address, _postNFTID);

      const nftContract = new ethers.Contract(
        userNFTAddress,
        MioNFTInterface.abi,
        user1
      );
      const nftOwner = await nftContract.ownerOf(_postNFTID);

      expect(nftOwner).to.equal(user2.address);
    });
  });

  describe("harvestNFTContract", () => {
    it("should allow the owner of the NFT contract to harvest the contract value", async () => {
      // Set up the test by creating an NFT contract, minting an NFT,
      // and getting the user NFT address (use the code from the previous tests)

      const user1BalanceBefore = await user1.getBalance();

      await miocore.connect(user1).harvestNFTContract();

      const user1BalanceAfter = await user1.getBalance();
      const nftContract = new ethers.Contract(
        userNFTAddress,
        MioNFTInterface.abi,
        user1
      );
      const contractBalance = await nftContract.getContractBalance();

      expect(user1BalanceAfter.sub(user1BalanceBefore)).to.be.gt(0);
      expect(contractBalance).to.equal(0);
    });
  });
});
