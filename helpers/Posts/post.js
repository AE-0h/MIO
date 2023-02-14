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

  // add post to +
};
