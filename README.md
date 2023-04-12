# MIO ⚠️(W.I.P)

<img src="public/MIOICO.svg" size="100px" >

A decentralized digital public square and market with a hybrid ui/ux. Where users can tokenize their art or music as well as anything they want to resell. All posts are stored on a social graph for 24-hours unless you “Make It Official” on the Polygon Mumbai Testnet, otherwise they are wiped from storage entirely. This project aims to use a familiar social-media ux to help new adopters explore resale item tokenization as well as content tokenization. I am using chiru labs er721a upgradeable contract as well as libraries like solmate and openzeppelin. Moralis strams are also used to take event emissions and populate post queries to to the Mio social graph on supabase.  All token metadata and official post metadataare stored on ipfs and kept in references on mio social graph.

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
