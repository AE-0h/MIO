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
      gasPrice: 900000000,
      gasLimit: 500000,
    },
    polygon: {
      url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY_MAINNET}`,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: `https://ancient-shy-gas.ethereum-goerli.discover.quiknode.pro/a8428ff11043166324f36a939ab75254969c5bbe/`,
      accounts: [PRIVATE_KEY, SECOND_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_KEY,
  },
};
