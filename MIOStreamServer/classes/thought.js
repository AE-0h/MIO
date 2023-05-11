const { supabase } = require("../utilityBelt/supabase");

class Thought {
  constructor(
    userAddress,
    userNFTContract,
    name,
    symbol,
    totalSupply,
    mintPrice,
    baseURI
  ) {
    this.userAddress = userAddress;
    this.userNFTContract = userNFTContract;
    this.name = name;
    this.symbol = symbol;
    this.totalSupply = totalSupply;
    this.mintPrice = mintPrice;
    this.baseURI = baseURI;
  }

  async save() {
    const { data, error } = await supabase
      .from("thoughts")
      .insert([this], { upsert: true });

    if (error) {
      console.error("Error inserting/updating thought:", error);
    } else {
      console.log("Thought data inserted/updated successfully:", data);
    }
  }
}

module.exports = Thought;
