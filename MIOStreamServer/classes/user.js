const { supabase } = require("../utilityBelt/supabase");

class User {
  constructor(userAddress, username, bio, profilePic, profileBanner) {
    this.userAddress = userAddress;
    this.username = username;
    this.bio = bio;
    this.profilePic = profilePic;
    this.profileBanner = profileBanner;
  }

  async save() {
    const { data, error } = await supabase
      .from("users")
      .insert([this], { upsert: true });

    if (error) {
      console.error("Error inserting/updating user:", error);
    } else {
      console.log("User data inserted/updated successfully:", data);
    }
  }
}

module.exports = User;
