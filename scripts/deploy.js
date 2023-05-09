const { ethers, upgrades } = require("hardhat");

async function main() {
  try {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    let balance = await deployer.getBalance();
    console.log("Account balance:", (balance / 1e18).toString());

    const ThinkContractFactory = await ethers.getContractFactory(
      "MioThinkFactory"
    );
    const MarketContractFactory = await ethers.getContractFactory(
      "MioMarketFactory"
    );
    const MIOCore = await ethers.getContractFactory("MIOCore");

    const thinkContractFactory = await ThinkContractFactory.deploy();
    console.log(
      "ThinkContractFactory deployed to:",
      thinkContractFactory.address
    );
    await thinkContractFactory.deployed();

    const marketContractFactory = await MarketContractFactory.deploy();
    await marketContractFactory.deployed();
    console.log("MioMarketFactory deployed to:", marketContractFactory.address);

    const mioCore = await upgrades.deployProxy(MIOCore, [
      deployer.address,
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
