module.exports = class User {
  constructor(
    //id is represented by users polygon wallet address
    id,
    username,
    bio,
    profilePic,
    profileBanner,
    nftContracts,
    nfts,
    posts
  ) {
    nftContracts = nftContracts || new Set();
    nfts = nfts || new Set();
    posts = posts || new Set();
    this.id = id;
    this.username = username;
    this.bio = bio;
    this.profilePic = profilePic;
    this.profileBanner = profileBanner;
    this.nftContracts = nftContracts;
    this.nfts = nfts;
    this.posts = posts;
  }
};
