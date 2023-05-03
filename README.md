# MIO ⚠️(W.I.P)

<img src="public/MIOICO.svg" size="100px" >

A thought monetization platform where any actor can engage in p2p sales of thought via a familiar ui/ux adopted from some of the most used applications on the planet and battle tested contracts like chiru labs erc721a and the OpenZeppelin suite. All thought tokenization contracts and market contracts are deployed and owned by the user not MIO. We give you the power of web3 and tokenization without the hassle and technical static.

## How to use

1. Clone the repo
2. Run `npm install`
3. create a .env file in the root directory and add the following variables

```
NEXT_PUBLIC_ALCHEMY_ID="YOUR_ALCHEMY_ID"
NEXT_PUBLIC_PRIVATE_KEY="YOUR_PRIVATE_KEY"
NEXT_PUBLIC_PRIVATE_KEY_TWO="YOUR_PRIVATE_KEY_TWO"
NEXT_PUBLIC_MIOCORE_ADDRESS="YOUR_MIOCORE_ADDRESS"
NEXT_PUBLIC_IPFS_SECRET="YOUR_IPFS_SECRET"
NEXT_PUBLIC_IPFS_ID="YOUR_IPFS_ID"

```

4. Run `npx hardhat test` to run the tests
5. Run `npx hardhat run scripts/deploy.js --network mumbai` to deploy the contracts to the mumbai testnet
6. Run `npm run dev` to start the development server
