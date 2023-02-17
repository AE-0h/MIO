module.exports = class User {
  constructor(username, bio, profilePic, profileBanner, walletAddress) {
    this.username = username;
    this.bio = bio;
    this.profilePic = profilePic;
    this.profileBanner = profileBanner;
    this.walletAddress = walletAddress;
    this.nftContracts = nftContracts;
  }
  follow(user) {
    this.followers.add(user);
  }

  unfollow(user) {
    this.followers.delete(user);
  }
};
