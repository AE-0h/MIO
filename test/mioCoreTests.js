const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MIOCore", () => {
  let miocore;
  let nftContract;
  let nftContractFactory;
  let user1;

  beforeEach(async () => {
    const NFTContract = await ethers.getContractFactory("MioNFT");
    nftContract = await NFTContract.deploy("MIONFT", "MIO");
    await nftContract.deployed();

    const NFTContractFactory = await ethers.getContractFactory("MioNFTFactory");
    nftContractFactory = await NFTContractFactory.deploy(nftContract.address);
    await nftContractFactory.deployed();
    const MIOCore = await ethers.getContractFactory("MIOCore");
    user1 = await ethers.getSigner();
    miocore = await MIOCore.deploy(nftContractFactory.address);
    await miocore.deployed();
  });

  //it should save msg.sender as owner in contructor
  it("it should save msg.sender as owner in contructor", async () => {
    expect(await miocore.owner()).to.equal(await miocore.signer.getAddress());
    console.log(`Owner: ${await miocore.owner()}`);
  });

  it("should be able to add a post and retrieve single post data from postID", async () => {
    //Initialize addMioPost data
    let postContent = "post1";
    let postImage = "https://blah.com/image1.jpg";
    await miocore.connect(user1).addPost(postContent, postImage, {
      value: ethers.utils.parseEther("1"),
    });
    let postFromID = await miocore.getPost(1);
    expect(postFromID[0]).to.equal("post1");
    expect(postFromID[1]).to.equal("https://blah.com/image1.jpg");

    console.log(`Post Content: ${postFromID[0]} Post Image: ${postFromID[1]}`);
  });

  it("should be able to add a post and retrieve all post data for user", async () => {
    //Initialize addMioPost data
    let postContent = "post2";
    let postImage = "https://blah.com/image2.jpg";
    await miocore.connect(user1).addPost(postContent, postImage, {
      value: ethers.utils.parseEther("1"),
    });
    let allUserPost = await miocore.getAllUserMioPosts();
    let postFilter = allUserPost[0].filter((item) => item !== "");
    expect(postFilter[1]).to.equal("post2");
    expect(postFilter[2]).to.equal("https://blah.com/image2.jpg");

    console.log(`Post Content: ${postFilter[1]} Post Image: ${postFilter[2]}`);
  });

  it("should be able to create a user and retrieve user data from user address", async () => {
    //Initialize user data
    let username = "User2";
    let bio = "This is my bio";
    let profilePic = "https://blah.com/pp.jpg";
    let profileBanner = "https://blah.com/pb.jpg";
    await miocore
      .connect(user1)
      .createUser(username, bio, profilePic, profileBanner, {
        value: ethers.utils.parseEther("1"),
      });
    const user = await miocore.getUser(await miocore.signer.getAddress());
    expect(user[0]).to.equal("User2");
    expect(user[1]).to.equal("This is my bio");
    expect(user[2]).to.equal("https://blah.com/pp.jpg");
    expect(user[3]).to.equal("https://blah.com/pb.jpg");

    console.log(
      `Username: ${user[0]} Bio: ${user[1]} Profile Pic: ${user[2]} Profile Banner: ${user[3]}`
    );
  });
});
