require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-foundry");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const MUMBAI_PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [MUMBAI_PRIVATE_KEY],
    },
  },
  solidity: "0.8.17",
};
