const { expect, assert } = require("chai");
const { ethers, artifacts } = require("hardhat");

//initialize variables
let mioUser;
let mioUser2;
let miocore;
let thinkFactoryContract;
let marketFactoryContract;
let user1;
let user2;
let user3;

describe("MIOCore Contract Tests", () => {
  beforeEach(async () => {
    const thinkFactory = await ethers.getContractFactory("MioThinkFactory");
    thinkFactoryContract = await thinkFactory.deploy();
    await thinkFactoryContract.deployed();

    console.log("ThinkFactory deployed to:", thinkFactoryContract.address);

    const marketFactory = await ethers.getContractFactory("MioMarketFactory");
    marketFactoryContract = await marketFactory.deploy();
    await marketFactoryContract.deployed();

    console.log("MarketFactory deployed to:", marketFactoryContract.address);

    [user1, user2, user3] = await ethers.getSigners();

    const mioCore = await ethers.getContractFactory("MIOCore");
    miocore = await upgrades.deployProxy(mioCore, [
      user1.address,
      thinkFactoryContract.address,
      marketFactoryContract.address,
    ]);
    await miocore.deployed();

    console.log("MIOCore deployed to:", miocore.address);

    marketFactoryContract.initialize(miocore.address);
    thinkFactoryContract.initialize(miocore.address);

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
        gasLimit: 2000000,
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
        gasLimit: 2000000,
      });

    console.log("MIOCore deployed to:", miocore.address);
  });

  describe("Ownership and Users", () => {
    it("it should have transfered ownership of mioCore to eoa deployer", async () => {
      let x = await miocore.connect(user1).owner({
        gasLimit: 200000000,
      });
      expect(x).to.equal(user1.address);
    }).timeout(800000000);

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
      let userMakePostOfficial = await miocore
        .connect(user1)
        .makePostOfficial(postContent, postImage, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 1000000,
        });
      //emit postCreated(_postID, _postContent, _postMedia, _author);
      await expect(userMakePostOfficial)
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
      let userMakePostOfficial = await miocore
        .connect(user1)
        .makePostOfficial(postContent, postImage, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 2000000,
        });

      await expect(userMakePostOfficial)
        .to.emit(miocore, "postCreated")
        .withArgs(1, postContent, postImage, timestamp, user1.address);

      let userMakePostOfficial2 = await miocore
        .connect(user1)
        .makePostOfficial(pc2, pi2, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 2000000,
        });

      await expect(userMakePostOfficial2)
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
        .makePostOfficial(pc4, pi4, timestamp, {
          value: ethers.utils.parseEther("0.01"),
          gasLimit: 2000000,
        });

      await expect(user2PostCreate)
        .to.emit(miocore, "postCreated")
        .withArgs(3, pc4, pi4, timestamp, user2.address);
      //add post user 2

      let user2PostCreate2 = await miocore
        .connect(user2)
        .makePostOfficial(pc5, pi5, timestamp, {
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

  describe("createUserThinkContract", () => {
    it("should create a new user think contract", async () => {
      await expect(mioUser)
        .to.emit(miocore, "userCreated")
        .withArgs(user1.address, username, bio, profilePic, profileBanner);

      let title = "MEV ALPHA part 1";
      let content = "d834jfd48003824thjt43454";
      let thought = "dfh84hr89fh43898tyhy8043";
      let maxSupply = 200;
      const mintPrice = 1;
      const baseURI = "https://ipfs.io/ipfs/";
      //create MioThink contract via createNewThinkContract() in MioCore.sol
      let thinkContract = await miocore
        .connect(user1)
        .createNewThinkContract(
          title,
          content,
          thought,
          baseURI,
          maxSupply,
          mintPrice,
          {
            value: ethers.utils.parseEther("0.01"),
            gasLimit: 3500000,
          }
        );

      let thinkContractTx = await thinkContract.wait();
      //get contract address
      let thinkTxHash = await thinkContractTx.transactionHash;
      let nftTxReceipt = await ethers.provider.getTransactionReceipt(
        thinkTxHash
      );

      //exception from mumbai to hardhat network (mumbai contract =logs[1] hardhat=logs[0])
      let thinkContractAddress = nftTxReceipt.logs[1].address;

      await expect(thinkContract)
        .to.emit(miocore, "userThinkContractCreated")
        .withArgs(
          user1.address,
          thinkContractAddress,
          title,
          content,
          maxSupply,
          mintPrice,
          baseURI
        );
    });

    it("should revert with InsufficientFunds error if msg.value is not 0.01 matic", async () => {
      let title = "MEV ALPHA part 1";
      let content = "d834jfd48003824thjt43454";
      let thought = "dfh84hr89fh43898tyhy8043";
      let baseURI = "https://ipfs.io/ipfs/";
      let maxSupply = 200;
      const mintPrice = 1;

      try {
        await miocore
          .connect(user1)
          .createNewThinkContract(
            title,
            content,
            thought,
            baseURI,
            maxSupply,
            mintPrice,
            {
              value: ethers.utils.parseEther("0"),
              gasLimit: 3500000,
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
      let title = "MEV ALPHA part 1";
      let content = "d834jfd48003824thjt43454";
      let thought = "dfh84hr89fh43898tyhy8043";
      let baseURI = "https://ipfs.io/ipfs/";
      let maxSupply = 200;
      const mintPrice = 1;
      try {
        await miocore
          .connect(user3)
          .createNewThinkContract(
            title,
            content,
            thought,
            baseURI,
            maxSupply,
            mintPrice,
            {
              value: ethers.utils.parseEther("0.01"),
              gasLimit: 3500000,
            }
          );
        assert.fail("Expected UserDoesNotExist error");
      } catch (error) {
        assert(
          /revert.*UserDoesNotExist\(\)/.test(error.message),
          `Unexpected error: ${error.message}`
        );
      }
    });
  });

  describe("gain access to a thought by minting from a MIOThink contract", () => {
    it("should mint an access token to a thought for the user", async () => {
      let title = "MEV ALPHA part 1";
      let content = "d834jfd48003824thjt43454";
      let thought = "dfh84hr89fh43898tyhy8043";
      let maxSupply = 200;
      const mintPrice = 1;
      const baseURI = "https://ipfs.io/ipfs/";

      let thinkContract = await miocore
        .connect(user1)
        .createNewThinkContract(
          title,
          content,
          thought,
          baseURI,
          maxSupply,
          mintPrice,
          {
            value: ethers.utils.parseEther("0.01"),
            gasLimit: 6000000,
          }
        );

      let thinkContractDeploymentViaMIOCore = await thinkContract.wait();
      let thinkContractAddress = await thinkContractDeploymentViaMIOCore.logs[0]
        .address;
      let contractArtifact = await artifacts.readArtifactSync("MioThink");
      let thinkInstance = new ethers.Contract(
        thinkContractAddress,
        contractArtifact.abi,
        user1
      );

      // Mint a new NFT from the think contract
      await thinkInstance.connect(user2).accessThought(user2.address, {
        value: ethers.utils.parseEther("1"),
        gasLimit: 6000000,
      });

      // Check if the minting was successful
      const thoughtAccessOwner = await thinkInstance.getOwnerOfNFT(0, {
        gasLimit: 6000000,
      }); // Assuming it's the first NFT minted
      expect(thoughtAccessOwner).to.equal(user2.address);
    });
  });

  describe("harvestNFTContract", () => {
    it("should allow the owner of the MioThink contract to harvest the contract value", async () => {
      let title = "MEV ALPHA part 1";
      let content = "d834jfd48003824thjt43454";
      let thought = "dfh84hr89fh43898tyhy8043";
      let maxSupply = 200;
      const mintPrice = 1;
      const baseURI = "https://ipfs.io/ipfs/";

      let thinkContract = await miocore
        .connect(user1)
        .createNewThinkContract(
          title,
          content,
          thought,
          baseURI,
          maxSupply,
          mintPrice,
          {
            value: ethers.utils.parseEther("0.01"),
          }
        );

      let thinkContractDeploymentViaMIOCore = await thinkContract.wait();
      let thinkContractAddress =
        thinkContractDeploymentViaMIOCore.logs[0].address;
      let contractArtifact = await artifacts.readArtifactSync("MioThink");
      let thinkInstance = new ethers.Contract(
        thinkContractAddress,
        contractArtifact.abi,
        user1
      );

      // Mint a new NFT from the think contract
      await thinkInstance.connect(user2).accessThought(user2.address, {
        value: ethers.utils.parseEther("1"),
      });

      const user1BalanceBefore = await user1.getBalance();

      await thinkInstance.connect(user1).harvest();

      const user1BalanceAfter = await user1.getBalance();
      const contractBalance = await ethers.provider.getBalance(
        thinkInstance.address
      );

      expect(user1BalanceAfter.sub(user1BalanceBefore)).to.be.greaterThan(0);
      expect(contractBalance).to.equal(0);
    });
  });

  describe("marketplace", () => {
    it("should deploy new market contract, deploy a think contract and then allow a second user to mint from think contract for user to sell thought with their marketplace", async () => {
      let marketContract = await miocore
        .connect(user2)
        .createUserMarketContract({ gasLimit: 6000000 });

      let title = "MEV ALPHA part 1";
      let content = "d834jfd48003824thjt43454";
      let thought = "dfh84hr89fh43898tyhy8043";
      let maxSupply = 200;
      const mintPrice = 1;
      const baseURI = "https://ipfs.io/ipfs/";

      let thinkContract = await miocore
        .connect(user1)
        .createNewThinkContract(
          title,
          content,
          thought,
          baseURI,
          maxSupply,
          mintPrice,
          {
            value: ethers.utils.parseEther("0.01"),
          }
        );

      let thinkContractDeploymentViaMIOCore = await thinkContract.wait();
      let thinkContractAddress =
        thinkContractDeploymentViaMIOCore.logs[0].address;
      let thinkContractArtifact = await artifacts.readArtifactSync("MioThink");
      let thinkInstance = new ethers.Contract(
        thinkContractAddress,
        thinkContractArtifact.abi,
        user1
      );

      // Mint a new NFT from the think contract
      await thinkInstance.connect(user2).accessThought(user2.address, {
        value: ethers.utils.parseEther("1"),
      });

      let x = await thinkInstance.connect(user2).getOwnerOfNFT(0);

      let marketContractDeploymentViaMIOCore = await marketContract.wait();
      let marketContractAddress =
        marketContractDeploymentViaMIOCore.logs[0].address;
      let contractArtifact = await artifacts.readArtifactSync("MioMarket");
      let marketInstance = new ethers.Contract(
        marketContractAddress,
        contractArtifact.abi,
        user1
      );

      //use chai matchers emit to check if the userMarketContractCreated event was emitted
      expect(marketContractDeploymentViaMIOCore)
        .to.emit(miocore, "userMarketContractCreated")
        .withArgs(user1.address, marketContractAddress);
      //set approval for market contract to sell the tokenized thought
      await thinkInstance
        .connect(user2)
        .setApprovalForAll(marketContractAddress, true);
      //list the thought for sale on the market
      await marketInstance
        .connect(user2)
        .listThought(thinkContractAddress, 0, 2, {
          gasLimit: 6000000,
        });

      //use chai matchers emit to check if the thoughtListed event was emitted
      expect(marketInstance)
        .to.emit(marketInstance, "thoughtListed")
        .withArgs(
          thinkContractAddress,
          0,
          user2.address,
          ethers.utils.parseEther("2")
        );

      await marketInstance.connect(user1).buyThought(thinkContractAddress, 0, {
        value: ethers.utils.parseEther("2"),
        gasLimit: 6000000,
      });
    });
  });
});
