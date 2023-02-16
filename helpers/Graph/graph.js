module.exports = class Graph {
  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.NFTs = new Map();
    this.NFTContracts = new Map();
  }

  // Add a user to the graph
  addUser(user) {
    this.users.set(user.id, user);
  }

  // Add a post to the graph
  addPost(post) {
    this.posts.set(post.id, post);
    post.author.posts.push(post);
  }

  // Get a user by id
  getUserByAddress(walletAddress) {
    return this.users.get(walletAddress);
  }

  // Get all users
  getAllUsers() {
    let users = [];
    // loop through all users
    this.users.forEach((user) => {
      // add user to array
      users.push(user);
    });
    return users;
  }

  // Get all posts by a user
  getPostsByUser(walletAddress) {
    const user = this.getUserByAddress(walletAddress);
    if (!user) {
      throw new Error("User not found.");
    }
    return user.posts;
  }

  // Get a post by id
  getPostById(postID) {
    return this.posts.get(postID);
  }
  // Get all posts
  getAllPosts() {
    let posts = [];
    // loop through all users
    this.users.forEach((user) => {
      // loop through all posts
      user.posts.forEach((post) => {
        // add post to array
        posts.push(post);
      });
    });
    return posts;
  }

  // add a nft contract to the graph
  addNFTContract(nftContract) {
    this.NFTContracts.set(nftContract.contractAddress, nftContract);
  }
  // Get a nft contract by adderss
  getNFTContractByAddress(contractAddress) {
    return this.NFTContracts.get(contractAddress);
  }
  // Get all nft contracts
  getAllNFTContracts() {
    let nftContracts = [];
    // loop through all nft contracts
    this.NFTContracts.forEach((nftContract) => {
      // add nft contract to array
      nftContracts.push(nftContract);
    });
    return nftContracts;
  }
  // add a nft to the graph
  addNFT(nft) {
    this.NFTs.set(nft.id, nft);
  }
  // Get a nft by id
  getNFTById(id) {
    return this.NFTs.get(id);
  }
  // Get all nfts that have been minted from a contract
  getNFTsByContractAddress(contractAddress) {
    let nfts = [];
    // loop through all nfts
    this.NFTs.forEach((nft) => {
      // if nft is minted from contract
      if (nft.contractAddress === contractAddress) {
        // add nft to array
        nfts.push(nft);
      }
    });
    return nfts;
  }
  // Get all nfts
  getAllNFTs() {
    let nfts = [];
    // loop through all nfts
    this.NFTs.forEach((nft) => {
      // add nft to array
      nfts.push(nft);
    });
    return nfts;
  }
};
