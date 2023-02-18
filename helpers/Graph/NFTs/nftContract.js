module.exports = class NFTContract {
  constructor(
    // The address of the contract nft was minted from
    contractAddress,
    // The owner of the nft contract
    owner
  ) {
    this.contractAddress = contractAddress;
    this.owner = owner;
  }
  //get the contract address of the nft
  getContractAddress() {
    return this.contractAddress;
  }
  //get the owner of the nft contract
  getOwner() {
    return this.owner;
  }
};
