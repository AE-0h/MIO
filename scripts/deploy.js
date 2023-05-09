const { ethers, upgrades } = require("hardhat");

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const ThinkContractFactory = await ethers.getContractFactory(
      "MioThinkFactory"
    );
    const thinkContractFactory = await ThinkContractFactory.deploy();
    await thinkContractFactory.deployed();
    console.log(
      "ThinkContractFactory deployed to:",
      thinkContractFactory.address
    );

    const MarketContractFactory = await ethers.getContractFactory(
      "MioMarketFactory"
    );
    const marketContractFactory = await MarketContractFactory.deploy();
    await marketContractFactory.deployed();
    console.log("MioMarketFactory deployed to:", marketContractFactory.address);

    const MIOCore = await ethers.getContractFactory("MIOCore");
    const mioCore = await upgrades.deployProxy(MIOCore, [
      thinkContractFactory.address,
      marketContractFactory.address,
    ]);
    await mioCore.deployed();
    console.log("MIOCore deployed to:", mioCore.address);
  } catch (error) {
    console.log(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
