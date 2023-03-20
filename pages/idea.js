// class Comment {
//   constructor(user, content) {
//     this.user = user;
//     this.content = content;
//   }
// }

// class User {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }
// }

// class Post {
//   constructor(id, user, title, content) {
//     this.id = id;
//     this.user = user;
//     this.title = title;
//     this.content = content;
//   }
// }

// class Graph {
//   constructor() {
//     this.vertices = new Set();
//     this.adjacencyList = new Map();
//   }

//   addVertex(vertex) {
//     this.vertices.add(vertex);
//     this.adjacencyList.set(vertex, []);
//   }

//   addEdge(v1, v2, type, data) {
//     this.adjacencyList.get(v1).push({ vertex: v2, type, data });
//   }

//   findUserByName(name) {
//     for (let vertex of this.vertices) {
//       if (vertex instanceof User && vertex.name === name) {
//         return vertex;
//       }
//     }
//     return null;
//   }

//   findPostById(id) {
//     for (let vertex of this.vertices) {
//       if (vertex instanceof Post && vertex.id === id) {
//         return vertex;
//       }
//     }
//     return null;
//   }

//   getPostLikes(post) {
//     let likes = 0;
//     for (let edges of this.adjacencyList.values()) {
//       likes += edges.filter(
//         (edge) => edge.vertex === post && edge.type === "like"
//       ).length;
//     }
//     return likes;
//   }

//   getPostComments(post) {
//     const comments = [];
//     for (let edges of this.adjacencyList.values()) {
//       const postComments = edges.filter(
//         (edge) => edge.vertex === post && edge.type === "comment"
//       );
//       comments.push(...postComments);
//     }
//     return comments;
//   }
// }

// // Create graph
// const graph = new Graph();

// // Add users and posts as vertices
// const user42 = new User("User 42", 30);
// const user43 = new User("User 43", 25);
// const post1 = new Post(1, user42, "First post", "This is the first post.");
// const post2 = new Post(2, user43, "Second post", "This is the second post.");
// const post3 = new Post(3, user42, "Third post", "This is the third post.");
// const post4 = new Post(4, user43, "Fourth post", "This is the fourth post.");
// const post5 = new Post(5, user42, "Fifth post", "This is the fifth post.");
// const post6 = new Post(6, user43, "Sixth post", "This is the sixth post.");

// graph.addVertex(user42);
// graph.addVertex(user43);
// graph.addVertex(post1);
// graph.addVertex(post2);
// graph.addVertex(post3);
// graph.addVertex(post4);
// graph.addVertex(post5);
// graph.addVertex(post6);

// // Add edges (likes, comments, mints, shares)
// graph.addEdge(user42, post1, "like");
// graph.addEdge(user43, post1, "like");
// graph.addEdge(user43, post1, "comment", new Comment(user43, "Great post!"));
// graph.addEdge(user42, post1, "mint");
// graph.addEdge(user43, post1, "share");
// graph.addEdge(user42, post2, "like");
// graph.addEdge(user43, post2, "like");
// graph.addEdge(user42, post2, "comment", new Comment(user42, "cool post!"));
// graph.addEdge(user43, post2, "comment", new Comment(user43, "nice post!"));
// graph.addEdge(user42, post2, "mint");
// graph.addEdge(user43, post2, "share");
// graph.addEdge(user42, post3, "like");
// graph.addEdge(user43, post3, "like");
// graph.addEdge(user42, post3, "comment", new Comment(user42, "right!"));

// // Search for a user by name
// const targetName = "User 42";
// const foundUser = graph.findUserByName(targetName);

// if (foundUser) {
//   console.log(`Found user with name "${targetName}":`, foundUser);
//   console.log();
// } else {
//   console.log(`User with name "${targetName}" not found.`);
// }

// // Search for a post by ID
// const targetPostId = 1;
// const foundPost = graph.findPostById(targetPostId);
// if (foundPost) {
//   //   console.log(`Found post with ID "${targetPostId}":`, foundPost);
//   let likes = graph.getPostLikes(foundPost);
//   console.log(graph.adjacencyList);
//   console.log(`Likes: ${likes}`);

//   const comments = graph.getPostComments(foundPost);

//   console.log(`Comments (${comments.length}):`);
//   comments.forEach((commentEdge) => {
//     console.log(
//       `- ${commentEdge.data.user.name}: "${commentEdge.data.content}"`
//     );
//   });
// } else {
//   console.log(`Post with ID "${targetPostId}" not found.`);
// }
