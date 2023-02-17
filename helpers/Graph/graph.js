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

    this.following = new Map();
    this.followers = new Map();
  }

  addUser(user) {
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
      edges.set(post.author.id, []);
    }
    edges.get(post.author.id).push(post);
  }

  addNFTContract(nftContract) {
    this.nftContracts.set(nftContract.id, nftContract);

    const edges = this.edges.get("users-nftContracts");
    if (!edges.has(nftContract.owner.id)) {
      edges.set(nftContract.owner.id, []);
    }
    edges.get(nftContract.owner.id).push(nftContract);
  }

  addNFT(nft) {
    this.nfts.set(nft.id, nft);

    const edges = this.edges.get("nftContracts-nfts");
    if (!edges.has(nft.contract.id)) {
      edges.set(nft.contract.id, []);
    }
    edges.get(nft.contract.id).push(nft);

    const userEdges = this.edges.get("users-nfts");
    if (!userEdges.has(nft.owner.id)) {
      userEdges.set(nft.owner.id, []);
    }
    userEdges.get(nft.owner.id).push(nft);
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
