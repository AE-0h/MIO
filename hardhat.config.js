require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-foundry");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ID_SEPOLIA;
const QUICKNODE_API_KEY_GOERLI = process.env.NEXT_PUBLIC_QUICKNODE_GOERLI;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
const SECOND_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY_TWO;
const ETHERSCAN_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_KEY;
const INFURA_WEB3_KEY = process.env.NEXT_PUBLIC_INFURA_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${INFURA_WEB3_KEY}`,
      accounts: [PRIVATE_KEY, SECOND_PRIVATE_KEY],
      gasPrice: 10000000000,
      gasLimit: 500000,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: `https://ancient-shy-gas.ethereum-goerli.discover.quiknode.pro/${QUICKNODE_API_KEY_GOERLI}/`,
      accounts: [PRIVATE_KEY, SECOND_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};
