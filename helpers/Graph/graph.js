class Graph {
  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.nfts = new Map();
    this.nftContracts = new Map();

    this.edges = new Map();
    this.edges.set("users-posts", new Map());
    this.edges.set("users-nftContracts", new Map());
    this.edges.set("nftContracts-nfts", new Map());
    this.edges.set("users-nfts", new Map());
    this.edges.set("users-followers", new Map());

    this.following = new Map();
    this.followers = new Map();
  }

  addUser(user) {
    // create uuid and set user id
    this.users.set(user.id, user);
    this.following.set(user.id, new Set());
    this.followers.set(user.id, new Set());
  }

  addFollower(user, follower) {
    this.followers.get(user.id).add(follower);
    this.following.get(follower.id).add(user);
  }

  addFollowing(user, following) {
    this.following.get(user.id).add(following);
    this.followers.get(following.id).add(user);
  }

  getFollowers(userId) {
    return Array.from(this.followers.get(userId));
  }

  getFollowing(userId) {
    return Array.from(this.following.get(userId));
  }

  addPost(post) {
    this.posts.set(post.id, post);

    const edges = this.edges.get("users-posts");
    if (!edges.has(post.author.id)) {
      edges.set(post.author, []);
    }
    edges.get(post.author).push(post);

    const followers = this.getFollowers(post.author.id);
    for (const follower of followers) {
      const followingEdges = this.edges.get("users-following");
      if (!followingEdges.has(post.author.id)) {
        followingEdges.set(post.author.id, []);
      }
      followingEdges.get(post.author.id).push(follower);
    }
  }

  addNFTContract(nftContract) {
    this.nftContracts.set(nftContract.id, nftContract);

    const edges = this.edges.get("users-nftContracts");
    if (!edges.has(nftContract.owner.id)) {
      edges.set(nftContract.owner.id, []);
    }
    edges.get(nftContract.owner.id).push(nftContract);
  }

  addNFT(nft, nftContract) {
    this.nfts.set(nft.id, nft);

    const edges = this.edges.get("nftContracts-nfts");
    if (!edges.has(nftContract.contractAddress)) {
      edges.set(nftContract.contractAddress, []);
    }
    edges.get(nftContract.contractAddress).push(nft);

    const userEdges = this.edges.get("users-nfts");
    if (!userEdges.has(nft.owner.id)) {
      userEdges.set(nft.owner.id, []);
    }
    userEdges.get(nft.owner.id).push(nft);

    if (nft.minter && nft.minter !== nftContract.getOwner()) {
      // check if NFT was minted by someone other than the owner of the NFT contract
      const minterEdges = this.edges.get("users-nftContracts");
      if (!minterEdges.has(nft.minter.id)) {
        minterEdges.set(nft.minter.id, []);
      }
      minterEdges.get(nft.minter.id).push(nftContract.getOwner());
    }
  }

  getUserById(userId) {
    return this.users.get(userId);
  }

  getPostsByUserId(userId) {
    const edges = this.edges.get("users-posts");
    return edges.has(userId) ? edges.get(userId) : [];
  }

  getNFTContractsByUserId(userId) {
    const edges = this.edges.get("users-nftContracts");
    return edges.has(userId) ? edges.get(userId) : [];
  }

  getNFTsByContractId(contractId) {
    const edges = this.edges.get("nftContracts-nfts");
    return edges.has(contractId) ? edges.get(contractId) : [];
  }

  getNFTsByUserId(userId) {
    const edges = this.edges.get("users-nfts");
    return edges.has(userId) ? edges.get(userId) : [];
  }
}
