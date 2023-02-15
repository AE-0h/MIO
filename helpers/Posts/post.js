const IPFS = require("ipfs-http-client");
const fs = require("fs");
const path = require("path");

// Initialize IPFS client
const ipfs = IPFS.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

module.exports = class Post {
  constructor(
    // The id of the post
    id,
    // The content of the post
    content,
    // The media of the post represented by ipfs cid
    media,
    // The author of the post represented by the wallet address
    author,
    // The timestamp of the post
    timestamp,
    // The boolean value of whether the post is made official on polygon
    isMadeOfficial
  ) {
    this.id = id;
    this.content = content;
    this.media = media;
    this.author = author;
    this.timestamp = timestamp;
    this.isMadeOfficial = isMadeOfficial;
  }

  async createPost() {
    // Add post to IPFS as non-official
    const postDirPath = path.join(__dirname, `posts/non-official`);
    if (!fs.existsSync(postDirPath)) {
      fs.mkdirSync(postDirPath, { recursive: true });
    }
    const postFilePath = path.join(postDirPath, `${this.id}.json`);
    const postData = JSON.stringify(this);
    fs.writeFileSync(postFilePath, postData);
    const postHash = await ipfs.add(postData);
    console.log(
      `Added non-official post "${this.id}" by user ${
        this.author
      } to IPFS with hash ${postHash.cid.toString()}`
    );
  }

  async makePostOfficial() {
    // Move post from non-official to official directory
    const nonOfficialPostDirPath = path.join(__dirname, `posts/non-official`);
    const officialPostDirPath = path.join(__dirname, `posts/official`);
    if (!fs.existsSync(officialPostDirPath)) {
      fs.mkdirSync(officialPostDirPath, { recursive: true });
    }
    const nonOfficialPostFilePath = path.join(
      nonOfficialPostDirPath,
      `${this.id}.json`
    );
    const officialPostFilePath = path.join(
      officialPostDirPath,
      `${this.id}.json`
    );
    fs.renameSync(nonOfficialPostFilePath, officialPostFilePath);

    // Pin post to IPFS
    const officialPostData = fs.readFileSync(officialPostFilePath);
    const officialPostHash = await ipfs.add(officialPostData, { pin: true });
    console.log(
      `Pinned official post "${this.id}" by user ${
        this.author
      } to IPFS with hash ${officialPostHash.cid.toString()}`
    );
  }
  async deletePost() {
    // Remove post from non-official directory
    const nonOfficialPostDirPath = path.join(__dirname, `posts/non-official`);
    const nonOfficialPostFilePath = path.join(
      nonOfficialPostDirPath,
      `${this.id}.json`
    );
    fs.unlinkSync(nonOfficialPostFilePath);
    console.log(
      `Deleted non-official post "${this.id}" by user ${this.author}`
    );

    // Remove post from IPFS
    try {
      await ipfs.pin.rm(this);
      console.log(`Removed post media "${this}" from IPFS`);
    } catch (err) {
      console.error(`Error removing post media "${this}" from IPFS: ${err}`);
    }
  }
};
