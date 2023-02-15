const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  //deploy nftContractFactory on polygon mumbai testnet
  const NFTContractFactory = await hre.ethers.getContractFactory(
    "MioNFTFactory"
  );
  const nftContractFactory = await NFTContractFactory.deploy();
  await nftContractFactory.deployed();
  console.log("NFTContractFactory deployed to:", nftContractFactory.address);

  //deploy MioCore and MioNFT on polygon mumbai testnet
  const MIOCore = await hre.ethers.getContractFactory("MIOCore");
  const mioCore = await MIOCore.deploy(nftContractFactory.address);
  await mioCore.deployed();
  console.log("MIOCore deployed to:", mioCore.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
