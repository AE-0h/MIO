const { supabase } = require("../utilityBelt/supabase");

class Post {
  constructor(id, content, media, timestamp, author) {
    this.id = id;
    this.content = content;
    this.media = media;
    this.timestamp = timestamp;
    this.author = author;
    this.isOfficial = false;
  }

  async save() {
    const { data, error } = await supabase
      .from("posts")
      .insert([this], { upsert: true });

    if (error) {
      console.error("Error inserting/updating post:", error);
    } else {
      console.log("Post data inserted/updated successfully:", data);
    }
  }
}

module.exports = Post;
