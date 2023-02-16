module.exports = class NFTContract {
  constructor(
    // The address of the contract nft was minted from
    contractAddress,
    // a set of token addresses minted from this contract
    mintedNfts = new Set()
  ) {
    this.contractAddress = contractAddress;
    this.owner = owner;
    this.mintedNfts = mintedNfts;
  }
  //get the contract address of the nft
  getContractAddress() {
    return this.contractAddress;
  }
  //get the minted nfts of the nft
  getMintedNfts() {
    return this.mintedNfts;
  }
};
