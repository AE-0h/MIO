const { ethers } = require("hardhat");
const { networks } = require("../hardhat.config");

//define networks
const mumbai = networks.mumbai;
const sepolia = networks.sepolia;
const goerli = networks.goerli;

// Define providers for each network via hardhat.config.js
const sepoliaProvider = new ethers.providers.JsonRpcProvider(sepolia.url);
const goerliProvider = new ethers.providers.JsonRpcProvider(goerli.url);
const mumbaiProvider = new ethers.providers.JsonRpcProvider(mumbai.url);

// Export providers
module.exports = {
  sepoliaProvider,
  goerliProvider,
  mumbaiProvider,
};
