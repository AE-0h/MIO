module.exports = class NFT {
  constructor(
    // The id of the nft minted
    id,
    // The content associated with the nft in a IPFS CID
    media,
    //collection name
    collectionName,
    //collection symbol
    collectionSymbol,
    //mint price
    mintPrice,
    //minter of the nft
    minter
  ) {
    this.id = id;
    this.media = media;
    this.collectionName = collectionName;
    this.collectionSymbol = collectionSymbol;
    this.mintPrice = mintPrice;
    this.minter = minter;
  }
  //get the id of the nft
  getId() {
    return this.id;
  }
  //get the media of the nft
  getMedia() {
    return this.media;
  }
  //get the collection name of the nft
  getCollectionName() {
    return this.collectionName;
  }
  //get the collection symbol of the nft
  getCollectionSymbol() {
    return this.collectionSymbol;
  }
  //get the mint price of the nft
  getMintPrice() {
    return this.mintPrice;
  }
  // minter of the nft
  minter() {
    return this.minter;
  }
};
