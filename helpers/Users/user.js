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

  async createPost(title, content, imagePath) {
    // Create new post instance
    const timestamp = Date.now();
    const post = new Post(
      title,
      content,
      imagePath,
      this.walletAddress,
      timestamp,
      false
    );

    // Add post to IPFS as non-official
    await post.createPost();

    // Add post to user's non-official post directory
    const postDirPath = path.join(
      __dirname,
      `users/${this.walletAddress}/posts/non-official`
    );
    if (!fs.existsSync(postDirPath)) {
      fs.mkdirSync(postDirPath, { recursive: true });
    }
    const postFilePath = path.join(postDirPath, `${title}.json`);
    const postData = JSON.stringify(post);
    fs.writeFileSync(postFilePath, postData);

    console.log(
      `Added non-official post "${title}" by user ${this.walletAddress}`
    );

    return post;
  }

  async makePostOfficial(title) {
    // Load post from file
    const postDirPath = path.join(
      __dirname,
      `users/${this.walletAddress}/posts/non-official`
    );
    const postFilePath = path.join(postDirPath, `${title}.json`);
    const postData = fs.readFileSync(postFilePath);
    const post = JSON.parse(postData);

    // Make post official
    post.isMadeOfficial = true;
    const officialPost = new Post(
      post.id,
      post.content,
      post.media,
      post.author,
      post.timestamp,
      post.isMadeOfficial
    );

    // Move post from non-official to official directory
    const nonOfficialPostDirPath = path.join(
      __dirname,
      `users/${this.walletAddress}/posts/non-official`
    );
    const officialPostDirPath = path.join(
      __dirname,
      `users/${this.walletAddress}/posts/official`
    );
    if (!fs.existsSync(officialPostDirPath)) {
      fs.mkdirSync(officialPostDirPath, { recursive: true });
    }
    const nonOfficialPostFilePath = path.join(
      nonOfficialPostDirPath,
      `${title}.json`
    );
    const officialPostFilePath = path.join(
      officialPostDirPath,
      `${title}.json`
    );
    fs.renameSync(nonOfficialPostFilePath, officialPostFilePath);

    // Add official post to IPFS and pin it
    await officialPost.createPost();
    await officialPost.makePostOfficial();

    console.log(`Made post "${title}" by user ${this.walletAddress} official`);
  }
};
