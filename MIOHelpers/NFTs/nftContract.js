module.exports = class NFTContract {
  constructor(
    // The address of the contract nft was minted from
    contractAddress,
    // The owner of the nft contract
    owner,
    //name of the nft contract
    name,
    //symbol of the nft contract
    symbol
  ) {
    this.contractAddress = contractAddress;
    this.owner = owner;
    this.name = name;
    this.symbol = symbol;
  }
  //get the contract address of the nft
  getContractAddress() {
    return this.contractAddress;
  }
  //get the owner of the nft contract
  getOwner() {
    return this.owner;
  }

  //get the name of the nft contract
  getName() {
    return this.name;
  }
  //get the symbol of the nft contract
  getSymbol() {
    return this.symbol;
  }
};
