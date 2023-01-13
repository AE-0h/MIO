const hre = require("hardhat");

async function main() {
  //deploy MioCore and MioNFT
  const MioCore = await hre.ethers.getContractFactory("MioCore");
  const mioCore = await MioCore.deploy();
  await mioCore.deployed();

  const MioNFT = await hre.ethers.getContractFactory("MioNFT");
  const mioNFT = await MioNFT.deploy();
  await mioNFT.deployed();

  console.log("MioCore deployed to:", mioCore.address);
  console.log("MioNFT deployed to:", mioNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
