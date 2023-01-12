const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MIOCore", () => {
  let miocore;
  let user1;

  beforeEach(async () => {
    /// Deploy MIOCore contract with name and symbol args
    const MIOCore = await ethers.getContractFactory("MIOCore");
    // Create a new user
    user1 = await ethers.getSigner();
    // Deploy MIOCore contract
    miocore = await MIOCore.deploy("MIOUserToken", "MUT");
    await miocore.deployed();
  });

  it("should have the correct name and symbol", async () => {
    expect(await miocore.name()).to.equal("MIOUserToken");
    expect(await miocore.symbol()).to.equal("MUT");
    console.log(user1.address);
  });

  it("should be able to add a post", async () => {
    //Initialize addMioPost data
    let postContent = "post";
    let postImage = "https://example.com/image.jpg";
    await miocore
      .connect(user1)
      .addPost(postContent, postImage, { value: ethers.utils.parseEther("1") });
    let post = await miocore.getAllUserMioPosts();
    let postFilter = post[0].filter((item) => item !== "");
    expect(postFilter[1]).to.equal("post");
    expect(postFilter[2]).to.equal("https://example.com/image.jpg");
  });

  it("should be able to mint a token to user ", async () => {
    //Initialize user data
    let username = "User1";
    let bio = "This is my bio";
    let profilePic = "https://example.com/image.jpg";
    let profileBanner = "https://example.com/image2.jpg";

    await miocore
      .connect(user1)
      .createUser(username, bio, profilePic, profileBanner, {
        value: ethers.utils.parseEther("1"),
      });
    const user = await miocore.users(await miocore.signer.getAddress());
    expect(user.username).to.equal("User1");
    expect(user.bio).to.equal("This is my bio");
    expect(user.profilePic).to.equal("https://example.com/image.jpg");
    expect(user.profileBanner).to.equal("https://example.com/image2.jpg");
    expect(user.userNFTID.toNumber()).to.equal(0);
  });
});
