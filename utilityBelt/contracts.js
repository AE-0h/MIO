const { ethers, artifacts } = require("hardhat");
const { sepoliaProvider } = require("./provider");

// Define ABI's
const mioCoreABI = artifacts.readArtifactSync("MIOCore");
const mioMarketABI = artifacts.readArtifactSync("MioMarket");
const mioThinkABI = artifacts.readArtifactSync("MioThink");

// Define addresses
const mioCoreAddressSepolia = "0x8Aa746F44f26d71Ae2d3d405B728081B65464c8c";

// Define contracts
const mioCoreSepolia = new ethers.Contract(
  mioCoreAddressSepolia,
  mioCoreABI.abi,
  sepoliaProvider
);
const mioMarketFactory = new ethers.ContractFactory(
  mioMarketABI.abi,
  "",
  sepoliaProvider.getSigner()
);
const mioThinkFactory = new ethers.ContractFactory(
  mioThinkABI.abi,
  "",
  sepoliaProvider.getSigner()
);

module.exports = { mioCoreSepolia, mioMarketFactory, mioThinkFactory };
