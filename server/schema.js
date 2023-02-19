const { gql } = require("apollo-server");
const typeDef = gql`
  type Query {
    "Get tracks array for homepage grid"
    users: [User!]!
  }
  "A user node in our graph"
  type User {
    "The user's ID via wallet address"
    address: String!
    "The user's brief biography"
    bio: String
    "the profile picture of the user"
    profilePic: String
    "The track's main author"
    profileBanner: String
    "list of nft contracts owned by the user"
    nftContracts: [NftContract!]!
    "list of nfts owned by the user"
    nfts: [Nft!]!
    "list of posts owned by the user"
    posts: [Post!]!
    "list of followers of the user"
    followers: [User!]!
    "list of following of the user"
    following: [User!]!
  }
  "Author of a complete Track or a Module"
  type Post {
    "The author's ID"
    id: ID!
    "The author's first and last name"
    content: String!
    "The author's profile picture"
    media: String
    "the time the post was created"
    timestamp: String!
    "a boolean to check if the post is official"
    isMadeOfficial: Boolean!
  }

  type Nft {
    "The author's ID"
    id: ID!
    "The author's profile picture"
    media: String
    "collection name"
    collectionName: String!
    "collection symbol"
    collectionSymbol: String!
    "mint price"
    mintPrice: String!
  }

  type NftContract {
    "the contract address"
    address: String!
    "the contract name"
    name: String!
    "the contract symbol"
    symbol: String!
  }
`;
module.exports = typeDef;
