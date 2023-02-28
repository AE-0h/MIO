const { ethers } = require("hardhat");
const MIOCoreJSON = require("../artifacts/contracts/MioCore.sol/MIOCore.json");
require("dotenv").config();

async function main() {
  const MIOCoreABI = await MIOCoreJSON.abi;
  const provider = await new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_PROVIDER_URL
  );

  //create wallet with private key
  const signer = await new ethers.Wallet(
    process.env.NEXT_PUBLIC_PRIVATE_KEY,
    provider
  );
  console.log(signer.address);

  //get contract at address
  const Mio = await new ethers.Contract(
    process.env.NEXT_PUBLIC_MIOCORE_ADDRESS,
    MIOCoreABI,
    signer
  );

  let mioUser = await Mio.connect(signer).createUser(
    "ae0h",
    "hey guys love this",
    "pp.jpg",
    "pb.jpg",
    {
      value: ethers.utils.parseEther("0.01"),
      gasLimit: 1000000,
    }
  );
  console.log(mioUser);
  let getTX = await Mio.getUser(signer.address, { gasLimit: 1000000 });
  console.log(getTX);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
