module.exports = class Post {
  constructor(
    // The id of the post
    id,
    // The content of the post
    content,
    // The media of the post represented by ipfs cid
    media,
    // The author of the post represented by the wallet address
    author
  ) {
    this.id = id;
    this.content = content;
    this.media = media;
    this.author = author;
    this.timestamp = new Date().getTime();
    this.isMadeOfficial = false;
  }

  isExpired() {
    return Date.now() - this.timestamp > 24 * 60 * 60 * 1000;
  }

  isOfficial() {
    return this.isMadeOfficial;
  }
};
