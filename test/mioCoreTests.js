const { expect } = require("chai");
const { ethers } = require("hardhat");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("MIOCore", () => {
  let miocore;
  let nftContract;
  let nftContractFactory;
  let user1;

  let mioUser;
 

  beforeEach(async () => {
    //deploy NFT contract
    const NFTContract = await ethers.getContractFactory("MioNFT");
    nftContract = await NFTContract.deploy("MIONFT", "MIO");
    await nftContract.deployed();
    //deploy NFT factory contract passing in NFT contract address to constructor
    const NFTContractFactory = await ethers.getContractFactory("MioNFTFactory");
    nftContractFactory = await NFTContractFactory.deploy(nftContract.address);
    await nftContractFactory.deployed();
    //deploy MIOCore contract passing in NFT factory contract address to constructor
    const MIOCore = await ethers.getContractFactory("MIOCore");
    miocore = await MIOCore.deploy(nftContractFactory.address);
    await miocore.deployed();
    //get signers
    [user1] = await ethers.getSigners();
  });

  //it should save msg.sender as owner in contructor
  it("it should save msg.sender as owner in contructor", async () => {
    expect(await miocore.owner()).to.equal(await miocore.signer.getAddress());
    console.log(`Owner: ${await miocore.owner()}`);
  });

  //it should create a user and add a post while emmiting events for each creation event
  it("should be able to add a post", async () => {
    //Initialize createUser data
    let username = "Miouser1";
    let bio = "Hello world";
    let profilePic = "https://blah.com/pp.jpg";
    let profileBanner = "https://blah.com/pb.jpg";
    //create user
    mioUser = await miocore
      .connect(user1)
      .createUser(username, bio, profilePic, profileBanner, {
        value: ethers.utils.parseEther("1"),
      });
    //emit userCreated(msg.sender, _username, _bio, _profilePic, _profileBanner);
    await expect(mioUser)
      .to.emit(miocore, "userCreated")
      .withArgs(user1.address, username, bio, profilePic, profileBanner);
    console.log(
      `event emitted{ userAddress: ${user1.address}, username: ${username}, bio: ${bio}, profilePic: ${profilePic}, profileBanner: ${profileBanner}}`
    );
    //Initialize addMioPost data
    let postContent = "post1";
    let postImage = "https://blah.com/image1.jpg";
    let userAddPost = await miocore
      .connect(user1)
      .addPost(postContent, postImage, {
        value: ethers.utils.parseEther("1"),
        gasLimit: 1000000,
      });
    //emit postCreated(_postID, _postContent, _postMedia, _author);
    await expect(userAddPost)
      .to.emit(miocore, "postCreated")
      .withArgs(1, postContent, postImage, user1.address);
    console.log(
      `event emitted{ postID: 1, postContent: ${postContent}, postMedia: ${postImage}, author: ${user1.address}}`
    );
  });

  //it should be able to create a user and add a post and retrieve all posts made official by user
  it("should be able to add a post and retrieve all post data for user", async () => {
    mioUser = await miocore
      .connect(user1)
      .createUser(
        "MioUser3",
        "Hello world",
        "https://blah.com/pp.jpg",
        "https://blah.com/pb.jpg",
        {
          value: ethers.utils.parseEther("1"),
          gasLimit: 1000000,
        }
      );
    //Initialize addMioPost data
    // 1st post user 1
    let postContent = "post2";
    let postImage = "https://blah.com/image2.jpg";
    // 2nd post user 1
    let pc2 = "post3";
    let pi2 = "https://blah.com/image3.jpg";
    //add post user 1
    await miocore.connect(user1).addPost(postContent, postImage, {
      value: ethers.utils.parseEther("1"),
      gasLimit: 1000000,
    });
    //add post user 1
    await miocore.connect(user1).addPost(pc2, pi2, {
      value: ethers.utils.parseEther("1"),
      gasLimit: 1000000,
    });
    //get all posts for user 1
    let allUser1Post = await miocore.getAllUserMioPosts(user1.address);
    console.log(allUser1Post.length);
    //filter out empty array
    let post1Filter = allUser1Post[0].filter((item) => item !== "");
    //filter out empty array
    let post2Filter = allUser1Post[1].filter((item) => item !== "");

    //check post 1
    expect(post1Filter.length).to.equal(4);
    expect(post1Filter[1]).to.equal("post2");
    expect(post1Filter[2]).to.equal("https://blah.com/image2.jpg");
    expect(post1Filter[3]).to.equal(user1.address);
    //check post 2
    expect(post2Filter.length).to.equal(4);
    expect(post2Filter[1]).to.equal("post3");
    expect(post2Filter[2]).to.equal("https://blah.com/image3.jpg");
    expect(post2Filter[3]).to.equal(user1.address);
  });

  //it should be able to create a user and retrieve user data via getUser() from user address
  it("should be able to create a user and retrieve user data from user address", async () => {
    mioUser = await miocore
      .connect(user1)
      .createUser(
        "MioUser2",
        "Hello world",
        "https://blah.com/pp.jpg",
        "https://blah.com/pb.jpg",
        {
          value: ethers.utils.parseEther("1"),
          gasLimit: 1000000,
        }
      );
    const user = await miocore.getUser(
      await mioUser.wait().then((x) => x.from)
    );
    console.log(user);
    expect(user[0]).to.equal("MioUser2");
    expect(user[1]).to.equal("Hello world");
    expect(user[2]).to.equal("https://blah.com/pp.jpg");
    expect(user[3]).to.equal("https://blah.com/pb.jpg");
    console.log(
      `Username: ${user[0]} Bio: ${user[1]} Profile Pic: ${user[2]} Profile Banner: ${user[3]}`
    );
  });
});
