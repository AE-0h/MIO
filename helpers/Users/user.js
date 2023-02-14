const IPFS = require("ipfs-http-client");
const fs = require("fs");
const path = require("path");
const Post = require("../Posts/post");

// Initialize IPFS client
const ipfs = IPFS.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

module.exports = class User {
  constructor(username, bio, profilePic, profileBanner, walletAddress) {
    this.username = username;
    this.bio = bio;
    this.profilePic = profilePic;
    this.profileBanner = profileBanner;
    this.walletAddress = walletAddress;
  }

  async initialize() {
    // Load user metadata from IPFS, if available
    const indexFilePath = path.join(
      __dirname,
      `users/${this.walletAddress}/index.json`
    );
    try {
      const indexData = fs.readFileSync(indexFilePath);
      const indexJson = JSON.parse(indexData);
      this.username = indexJson.username || this.username;
      this.bio = indexJson.bio || this.bio;
      this.profilePic = indexJson.profilePic || this.profilePic;
      this.profileBanner = indexJson.profileBanner || this.profileBanner;
      this.metadataHash = indexJson.metadataHash || "";
    } catch (err) {
      console.log(
        `Could not load index.json for user ${this.walletAddress}: ${err}`
      );
    }
  }

  async updateMetadata(metadata) {
    // Merge new metadata with existing metadata
    const oldMetadata = await this.getMetadata();
    const newMetadata = { ...oldMetadata, ...metadata };

    // Save user metadata to IPFS
    const indexData = JSON.stringify(newMetadata);
    const indexHash = await ipfs.add(indexData);
    const indexFilePath = path.join(
      __dirname,
      `users/${this.walletAddress}/index.json`
    );
    fs.writeFileSync(indexFilePath, indexData);

    this.metadataHash = indexHash.cid.toString();
    console.log(
      `Updated metadata for user ${
        this.walletAddress
      } on IPFS with hash ${indexHash.cid.toString()}`
    );
  }

  async getMetadata() {
    const indexFilePath = path.join(
      __dirname,
      `users/${this.walletAddress}/index.json`
    );
    try {
      const indexData = fs.readFileSync(indexFilePath);
      const indexJson = JSON.parse(indexData);
      return indexJson;
    } catch (err) {
      console.log(
        `Could not load index.json for user ${this.walletAddress}: ${err}`
      );
      return {};
    }
  }
};
