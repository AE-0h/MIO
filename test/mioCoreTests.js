const { expect } = require("chai");
const { FixedNumber } = require("ethers");
const { ethers } = require("hardhat");
require("dotenv").config();

describe("MIOCore", () => {
  let miocore;
  let nftContractFactory;
  let user1;
  let user2;
  let mioUser;
  let mioUser2;
  let username;
  let bio;
  let profilePic;
  let profileBanner;
  let user2name;
  let bio2;
  let profilePic2;
  let profileBanner2;

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
    [user1, user2] = await ethers.getSigners();
    // user2 = new ethers.Wallet(
    //   process.env.NEXT_PUBLIC_PRIVATE_KEY_TWO,
    //   ethers.provider
    // );
    console.log(
      `-------------------WALLET_ADDRESS_ON_MUMBAI--------------------------`
    );
    console.log(`User1: ${user1.address}`);
    console.log(`User2: ${user2.address}`);
    console.log(
      `---------------------------------------------------------------------`
    );

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

  //it should save msg.sender as owner in contructor
  // it("it should save msg.sender as owner in constructor", async () => {
  //   expect(await miocore.connect(user2).owner()).to.equal(user1.address);
  //   console.log(`Owner: ${await miocore.owner()}`);
  // });

  // //it should create a user and add a post while emmiting events for each creation event
  // it("should be able to make a post official while emmiting events for user creation and officiating post", async () => {
  //   //emit userCreated(msg.sender, _username, _bio, _profilePic, _profileBanner);
  //   await expect(mioUser)
  //     .to.emit(miocore, "userCreated")
  //     .withArgs(user1.address, username, bio, profilePic, profileBanner);
  //   console.log(
  //     `NEW USER CREATED::{ userAddress: ${user1.address}, username: ${username}, bio: ${bio}, profilePic: ${profilePic}, profileBanner: ${profileBanner}}`
  //   );
  //   //Initialize addMioPost data
  //   let postContent = "post1";
  //   let postImage = "https://blah.com/image1.jpg";
  //   let userAddPost = await miocore
  //     .connect(user1)
  //     .addPost(postContent, postImage, {
  //       value: ethers.utils.parseEther("0.01"),
  //       gasLimit: 1000000,
  //     });
  //   //emit postCreated(_postID, _postContent, _postMedia, _author);
  //   await expect(userAddPost)
  //     .to.emit(miocore, "postCreated")
  //     .withArgs(1, postContent, postImage, user1.address);
  //   console.log(
  //     `NEW POST MADE OFFICIAL::{ postID: 1, postContent: ${postContent}, postMedia: ${postImage}, author: ${user1.address}}`
  //   );
  // });
  // it("should add 2 posts made official while also retrieving all posts made official by specific user and by all users on platform", async () => {
  //   //emit userCreated(msg.sender, _username, _bio, _profilePic, _profileBanner);
  //   await expect(mioUser)
  //     .to.emit(miocore, "userCreated")
  //     .withArgs(user1.address, username, bio, profilePic, profileBanner);
  //   //emit userCreated(msg.sender, _username, _bio, _profilePic, _profileBanner);
  //   await expect(mioUser2)
  //     .to.emit(miocore, "userCreated")
  //     .withArgs(user2.address, user2name, bio2, profilePic2, profileBanner2);

  //   //Initialize addMioPost data
  //   // 1st post user 1
  //   let postContent = "post2";
  //   let postImage = "https://blah.com/image2.jpg";
  //   // 2nd post user 1
  //   let pc2 = "post3";
  //   let pi2 = "https://blah.com/image3.jpg";
  //   //add post user 1
  //   let userAddPost = await miocore
  //     .connect(user1)
  //     .addPost(postContent, postImage, {
  //       value: ethers.utils.parseEther("0.01"),
  //       gasLimit: 1000000,
  //     });

  //   await expect(userAddPost)
  //     .to.emit(miocore, "postCreated")
  //     .withArgs(1, postContent, postImage, user1.address);
  //   //add post user 1
  //   let userAddPost2 = await miocore.connect(user1).addPost(pc2, pi2, {
  //     value: ethers.utils.parseEther("0.01"),
  //     gasLimit: 1000000,
  //   });

  //   await expect(userAddPost2)
  //     .to.emit(miocore, "postCreated")
  //     .withArgs(2, pc2, pi2, user1.address);
  //   // 1st post user 2
  //   let pc4 = "post4";
  //   let pi4 = "https://blah.com/image4.jpg";
  //   // 2nd post user 2
  //   let pc5 = "post5";
  //   let pi5 = "https://blah.com/image5.jpg";

  //   //add post user 2
  //   let user2PostCreate = await miocore.connect(user2).addPost(pc4, pi4, {
  //     value: ethers.utils.parseEther("0.01"),
  //     gasLimit: 1000000,
  //   });

  //   await expect(user2PostCreate)
  //     .to.emit(miocore, "postCreated")
  //     .withArgs(3, pc4, pi4, user2.address);
  //   //add post user 2
  //   let user2PostCreate2 = await miocore.connect(user2).addPost(pc5, pi5, {
  //     value: ethers.utils.parseEther("0.01"),
  //     gasLimit: 1000000,
  //   });

  //   await expect(user2PostCreate2)
  //     .to.emit(miocore, "postCreated")
  //     .withArgs(4, pc5, pi5, user2.address);
  //   //get all posts for user 1
  //   let allUser1Post = await miocore
  //     .connect(user1)
  //     .getAllUserMioPosts(user1.address);
  //   //get all posts for user 2
  //   let allUser2Post = await miocore
  //     .connect(user2)
  //     .getAllUserMioPosts(user2.address);
  //   //get all posts made offical by any user on the platform
  //   let allMioPosts = await miocore.connect(user1).getAllMioPosts();
  //   //confirming the length of all posts made official by any user on the platform is equal to 4
  //   console.log(`allMioPosts length: ${allMioPosts.length}`);
  //   console.log(`allUser1Post length: ${allUser1Post.length}`);
  //   console.log(`allUser2Post length: ${allUser2Post.length}`);
  //   // filter out empty array
  //   let post1Filter = await allUser1Post[0].filter((item) => item !== "");
  //   //filter out empty array
  //   let post2Filter = await allUser1Post[1].filter((item) => item !== "");
  //   //filter out empty array
  //   let post3Filter = await allUser2Post[0].filter((item) => item !== "");
  //   //filter out empty array
  //   let post4Filter = await allUser2Post[1].filter((item) => item !== "");

  //   //check array of all posts made official by any user on the platform length is equal to 4
  //   expect(await allMioPosts.length).to.equal(4);

  //   //check array of user post length
  //   expect(await allUser1Post.length).to.equal(2);
  //   //check post 1
  //   expect(await post1Filter.length).to.equal(4);
  //   expect(await post1Filter[1]).to.equal("post2");
  //   expect(await post1Filter[2]).to.equal("https://blah.com/image2.jpg");
  //   expect(await post1Filter[3]).to.equal(user1.address);
  //   //check post 2
  //   expect(await post2Filter.length).to.equal(4);
  //   expect(await post2Filter[1]).to.equal("post3");
  //   expect(await post2Filter[2]).to.equal("https://blah.com/image3.jpg");
  //   expect(await post2Filter[3]).to.equal(user1.address);

  //   //check array of user post length
  //   expect(await allUser2Post.length).to.equal(2);
  //   //check post 1
  //   expect(await post3Filter.length).to.equal(4);
  //   expect(await post3Filter[1]).to.equal("post4");
  //   expect(await post3Filter[2]).to.equal("https://blah.com/image4.jpg");
  //   expect(await post3Filter[3]).to.equal(user2.address);
  //   //check post 2
  //   expect(await post4Filter.length).to.equal(4);
  //   expect(await post4Filter[1]).to.equal("post5");
  //   expect(await post4Filter[2]).to.equal("https://blah.com/image5.jpg");
  //   expect(await post4Filter[3]).to.equal(user2.address);

  //   console.log(
  //     `NEW POST MADE OFFICIAL::{ postID: 1, postContent: ${postContent}, postMedia: ${postImage}, author: ${user1.address}}`
  //   );
  //   console.log(
  //     `NEW POST MADE OFFICIAL::{ postID: 2, postContent: ${pc2}, postMedia: ${pi2}, author: ${user1.address}}`
  //   );
  //   console.log(
  //     `NEW POST MADE OFFICIAL::{ postID: 3, postContent: ${pc4}, postMedia: ${pi4}, author: ${user2.address}}`
  //   );
  //   console.log(
  //     `NEW POST MADE OFFICIAL::{ postID: 4, postContent: ${pc5}, postMedia: ${pi5}, author: ${user2.address}}`
  //   );
  // });

  // // it should be able to create a user and retrieve user data via getUser() from user address
  // it("should be able to create a user and retrieve user data from user address using getUser()", async () => {
  //   const user = await miocore
  //     .connect(user2)
  //     .getUser(await mioUser2.wait().then((x) => x.from));

  //   expect(user[0]).to.equal("Miouser2");
  //   expect(user[1]).to.equal("ello erld");
  //   expect(user[2]).to.equal("https://blah.com/pp2.jpg");
  //   expect(user[3]).to.equal("https://blah.com/pb2.jpg");
  //   console.log(
  //     `Username: ${user[0]} Bio: ${user[1]} Profile Pic: ${user[2]} Profile Banner: ${user[3]}`
  //   );
  // });

  // it should be able to create a user and then create a new nft contract for that user and then mint a new nft for that user
  it("should be able to emit user1 creation event => then create a new nft contract with user1 => then user2 mints an NFT from the contract user1 created", async () => {
    await expect(mioUser)
      .to.emit(miocore, "userCreated")
      .withArgs(user1.address, username, bio, profilePic, profileBanner);
    console.log(
      `NEW USER CREATED::{ userAddress: ${user1.address}, username: ${username}, bio: ${bio}, profilePic: ${profilePic}, profileBanner: ${profileBanner}}`
    );
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
    console.log(nftTxReceipt.logs[0].topics);
    //exception from mumbai to hardhat network (mumbai contract =logs[1] hardhat=logs[0])
    let nftContractAddress = nftTxReceipt.logs[1].address;
    console.log(nftContractAddress);

    // get emitted event
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
    console.log(
      `NEW USER NFT CONTRACT CREATED::{ userAddress: ${user1.address}, nftContractAddress: ${nftContractAddress}}`
    );
    // mint nft
    let nftMint = await miocore
      .connect(user2)
      .mintUserNFT(user2.address, "myIPFSCID", {
        value: ethers.utils.parseEther("0.02"),
        gasLimit: 2500000,
      });

    console.log(nftMint);
    let nftMintTx = await nftMint.wait();
    //get transaction hash
    let nftMintTxHash = nftMintTx.transactionHash;
    //get transaction receipt via getTransactionReceipt() passing in transaction hash from above
    let nftMintTxReceipt = await ethers.provider.getTransactionReceipt(
      nftMintTxHash
    );
    // transaction receipt formatted for console.log
    console.log(`TRANSACTION RECEIPT:
                    GAS USED : ${nftMintTxReceipt.gasUsed}
                    CONTRACT ADDRESS : ${nftContractAddress}
                    TRANSACTION HASH : ${nftMintTxHash}
                    FROM : ${nftMintTxReceipt.from}
                    TO : ${nftMintTxReceipt.to}
                    STATUS : ${nftMintTxReceipt.status}
                    `);
  });
});
