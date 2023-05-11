const { supabase } = require("../utilityBelt/supabase");
const User = require("../classes/user");
const Post = require("../classes/post");

const {
  mioCoreSepolia,
  mioMarketFactory,
  mioThinkFactory,
} = require("../utilityBelt/contracts");

async function handleUserCreated(userData) {
  // Create a new User instance
  const user = new User(
    userData.userAddress,
    userData.username,
    userData.bio,
    userData.profilePic,
    userData.profileBanner
  );

  // Save the user instance to the database
  await user.save();

  console.log("User data inserted/updated successfully");
}

async function handlePostCreated(postData) {
  // Create a new Post instance
  const post = new Post(
    postData.id,
    postData.content,
    postData.media,
    postData.timestamp,
    postData.author
  );

  // Save the post instance to the database
  await post.save();

  console.log("Post data inserted/updated successfully");
}

function listenForMioCoreEvents() {
  console.log("Listening for MioCore events...");

  mioCoreSepolia.on("postCreated", (id, content, media, timestamp, author) => {
    // Log the event arguments
    console.log('mioCore event "postCreated" emitted:');
    console.log("ID:", id.toString());
    console.log("Content:", content);
    console.log("Media:", media);
    console.log("Timestamp:", timestamp);
    console.log("Author:", author);

    handlePostCreated({
      id: id.toString(),
      content: content,
      media: media,
      timestamp: timestamp,
      author: author,
    });
  });

  mioCoreSepolia.on(
    "userCreated",
    (userAddress, username, bio, profilePic, profileBanner) => {
      // Log the event arguments
      console.log('mioCore event "userCreated" emitted:');
      console.log("User Address:", userAddress);
      console.log("Username:", username);
      console.log("Bio:", bio);
      console.log("Profile Picture:", profilePic);
      console.log("Profile Banner:", profileBanner);

      handleUserCreated({
        userAddress: userAddress,
        username: username,
        bio: bio,
        profilePic: profilePic,
        profileBanner: profileBanner,
      });
    }
  );

  // Add event listeners for other events and call their respective handlers
}

module.exports = { listenForMioCoreEvents };
