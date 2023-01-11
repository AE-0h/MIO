const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MIOCore", () => {
  let contract;

  before(async () => {
    // Deploy the contract before running any tests
    contract = await ethers
      .getContractFactory("MIOCore")
      .deploy("MIOCore", "MC");
    await contract.deployed();
  });

  it("Should have a correct owner", async () => {
    const owner = await contract.owner();
    expect(owner).to.equal(await ethers.provider.getSigner().getAddress());
  });

  it("Should increment mioCountID after addPost()", async () => {
    const mioCountID = await contract.mioCountID();
    await contract.addPost("Test post content", "Test post media", {
      value: ethers.utils.parseEther("0.01"),
    });
    const newMioCountID = await contract.mioCountID();
    expect(newMioCountID.sub(1).eq(mioCountID)).to.be.true;
  });

  it("Should emit postCreated event on addPost()", async () => {
    const tx = await contract.addPost("Test post content", "Test post media", {
      value: ethers.utils.parseEther("0.01"),
    });
    expect(tx.events.postCreated).to.exist;
  });

  it("Should require content on addPost()", async () => {
    try {
      await contract.addPost("", "Test post media", {
        value: ethers.utils.parseEther("0.01"),
      });
      expect.fail("Should have thrown error");
    } catch (err) {
      expect(err.reason).to.equal("Content is required");
    }
  });

  it("Should have a gas fee of 0.01 matic on addPost()", async () => {
    try {
      await contract.addPost("Test post content", "Test post media", {
        value: ethers.utils.parseEther("0.05"),
      });
      expect.fail("Should have thrown error");
    } catch (err) {
      expect(err.reason).to.equal("You must pay 0.01 matic to make it offical");
    }
  });

  it("Should transfer gas fee to owner after adding a post", async () => {
    const pre = await ethers.provider.getBalance(
      await ethers.provider.getSigner().getAddress()
    );
    await contract.addPost("Test post content", "Test post media", {
      value: ethers.utils.parseEther("0.01"),
    });
    const post = await ethers.provider.getBalance(
      await ethers.provider.getSigner().getAddress()
    );
    expect(pre.sub(ethers.utils.parseEther("0.01")).eq(post)).to.be.true;
  });
});
