module.exports = class NFT {
  constructor(
    // The address of the contract nft was minted from
    contractAddress,
    // The id of the nft minted
    id,
    // The content associated with the nft in a IPFS CID
    media
  ) {
    this.contractAddress = contractAddress;
    this.id = id;
    this.media = media;
  }
  //get the contract address of the nft
  getContractAddress() {
    return this.contractAddress;
  }
  //get the id of the nft
  getId() {
    return this.id;
  }
  //get the media of the nft
  getMedia() {
    return this.media;
  }
};
