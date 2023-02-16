module.exports = class User {
  constructor(
    username,
    bio,
    profilePic,
    profileBanner,
    walletAddress,
    nftContracts = new Set(),
    followers = new Set(),
    following = new Set(),
    posts = new Set(),
    mintedNFTs = new Set()
  ) {
    this.username = username;
    this.bio = bio;
    this.profilePic = profilePic;
    this.profileBanner = profileBanner;
    this.walletAddress = walletAddress;
    this.nftContracts = nftContracts;
    this.posts = posts;
    this.followers = followers;
    this.following = following;
    this.mintedNFTs = mintedNFTs;
  }
  follow(user) {
    this.followers.add(user);
  }

  unfollow(user) {
    this.followers.delete(user);
  }

  getFollowers() {
    return this.followers;
  }

  getFollowing() {
    return this.following;
  }

  getMintedNFTs() {
    return this.mintedNFTs;
  }
};
