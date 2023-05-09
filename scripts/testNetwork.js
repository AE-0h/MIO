const { ethers } = require("hardhat");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/c0085a0165504607bc082f6c2f40ced2"
  );
  console.log("Provider URL:", provider.connection.url);

  try {
    const network = await provider.getNetwork();
    console.log("Network:", network);
    const blockNumber = await provider.getBlockNumber();
    console.log("Block number:", blockNumber);
    const balance = await provider.getBalance(
      "0xb113955919842af1A5dC4dFd611Ed99F2a667B30"
    );
    console.log("Balance:", ethers.utils.formatEther(balance));
  } catch (error) {
    console.error("Error while getting network:", error);
  }
}

main();
