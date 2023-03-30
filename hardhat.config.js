require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-foundry");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const AlCHEMY_API_KEY_GOERLI = process.env.NEXT_PUBLIC_ALCHEMY_ID_GOERLI;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const SECOND_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY_TWO;
const ALCHEMY_API_KEY_MAINNET = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_ID;
const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY, SECOND_PRIVATE_KEY],
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_MAINNET}`,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${AlCHEMY_API_KEY_GOERLI}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};
