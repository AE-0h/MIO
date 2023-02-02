require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-foundry");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const ALCHEMY_API_KEY_MAINNET = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_ID;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_MAINNET}`,
      accounts: [PRIVATE_KEY],
    },
  },
  solidity: "0.8.17",
};
