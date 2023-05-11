const { ethers } = require("hardhat");
const {
  mioCoreSepolia,
  mioMarketFactory,
  mioThinkFactory,
} = require("../utilityBelt/contracts");

function listenForMioCoreEvents(ws) {
  console.log("Listening for MioCore events...");
  mioCoreSepolia.on("postCreated", (id, content, media, timestamp, author) => {
    // Log the event arguments
    console.log("mioCore event 'postCreated' emitted:");
    console.log("ID:", id.toString());
    console.log("Content:", content);
    console.log("Media:", media);
    console.log("Timestamp:", timestamp);
    console.log("Author:", author);

    // Send the event data to the WebSocket client
    ws.send(
      JSON.stringify({
        contract: "mioCore",
        event: "postCreated",
        data: {
          id: id.toString(),
          content: content,
          media: media,
          timestamp: timestamp,
          author: author,
        },
      })
    );
  });

  mioCoreSepolia.on(
    "userCreated",
    (userAddress, username, bio, profilePic, profileBanner, event) => {
      // Log the event arguments
      console.log("mioCore event 'userCreated' emitted:");
      console.log("User Address:", userAddress);
      console.log("Username:", username);
      console.log("Bio:", bio);
      console.log("Profile Picture:", profilePic);
      console.log("Profile Banner:", profileBanner);

      // Send the event data to the WebSocket client
      ws.send(
        JSON.stringify({
          contract: "mioCore",
          event: "userCreated",
          data: {
            userAddress: userAddress,
            username: username,
            bio: bio,
            profilePic: profilePic,
            profileBanner: profileBanner,
          },
        })
      );
    }
  );

  mioCoreSepolia.on(
    "userThinkContractCreated",
    (
      userAddress,
      userNFTContract,
      name,
      symbol,
      totalSupply,
      mintPrice,
      baseURI,
      event
    ) => {
      // Log the event arguments
      console.log("mioCore event 'userThinkContractCreated' emitted:");
      console.log("User Address:", userAddress);
      console.log("User NFT Contract Address:", userNFTContract);
      console.log("Name:", name);
      console.log("Symbol:", symbol);
      console.log("Total Supply:", totalSupply.toString());
      console.log("Mint Price:", mintPrice.toString());
      console.log("Base URI:", baseURI);

      // Send the event data to the WebSocket client
      ws.send(
        JSON.stringify({
          contract: "mioCore",
          event: "userThinkContractCreated",
          data: {
            userAddress: userAddress,
            userNFTContract: userNFTContract,
            name: name,
            symbol: symbol,
            totalSupply: totalSupply.toString(),
            mintPrice: mintPrice.toString(),
            baseURI: baseURI,
          },
        })
      );
    }
  );

  mioCoreSepolia.on(
    "userMarketContractCreated",
    (userAddress, userResaleContract, event) => {
      // Log the event arguments
      console.log("mioCore event 'userMarketContractCreated' emitted:");
      console.log("User Address:", userAddress);
      console.log("User Resale Contract Address:", userResaleContract);

      // Send the event data to the WebSocket client
      ws.send(
        JSON.stringify({
          contract: "mioCore",
          event: "userMarketContractCreated",
          data: {
            userAddress: userAddress,
            userResaleContract: userResaleContract,
          },
        })
      );
    }
  );
}

function listenForMioMarketEvents(ws, mioMarket) {
  mioMarketInstance.on(
    "ThoughtListed",
    (contractAddress, tokenId, seller, price, event) => {
      // Log the event arguments
      console.log("mioMarket event 'ThoughtListed' emitted:");
      console.log("Contract Address:", contractAddress);
      console.log("Token ID:", tokenId.toString());
      console.log("Seller:", seller);
      console.log("Price:", price.toString());

      // Send the event data to the WebSocket client
      ws.send(
        JSON.stringify({
          contract: "mioMarket",
          event: "ThoughtListed",
          data: {
            contractAddress: contractAddress,
            tokenId: tokenId.toString(),
            seller: seller,
            price: price.toString(),
          },
        })
      );
    }
  );

  mioMarketInstance.on(
    "ThoughtRemoved",
    (nftAddress, tokenId, seller, event) => {
      // Log the event arguments
      console.log("mioMarket event 'ThoughtRemoved' emitted:");
      console.log("NFT Address:", nftAddress);
      console.log("Token ID:", tokenId.toString());
      console.log("Seller:", seller);

      // Send the event data to the WebSocket client
      ws.send(
        JSON.stringify({
          contract: "mioMarket",
          event: "ThoughtRemoved",
          data: {
            nftAddress: nftAddress,
            tokenId: tokenId.toString(),
            seller: seller,
          },
        })
      );
    }
  );

  mioMarketInstance.on(
    "ThoughtSold",
    (nftAddress, tokenId, buyer, price, event) => {
      // Log the event arguments
      console.log("mioMarket event 'ThoughtSold' emitted:");
      console.log("NFT Address:", nftAddress);
      console.log("Token ID:", tokenId.toString());
      console.log("Buyer:", buyer);
      console.log("Price:", price.toString());

      // Send the event data to the WebSocket client
      ws.send(
        JSON.stringify({
          contract: "mioMarket",
          event: "ThoughtSold",
          data: {
            nftAddress: nftAddress,
            tokenId: tokenId.toString(),
            buyer: buyer,
            price: price.toString(),
          },
        })
      );
    }
  );
}

function listenForMioThinkEvents(ws, mioThink) {
  mioThink.on(
    "ThoughtTokenized",
    (to, nftID, contractAddress, thought, event) => {
      // Log the event arguments
      console.log("mioThink event 'ThoughtTokenized' emitted:");
      console.log("To:", to);
      console.log("NFT ID:", nftID.toString());
      console.log("Contract Address:", contractAddress);
      console.log("Thought:", thought);

      // Send the event data to the WebSocket client
      ws.send(
        JSON.stringify({
          contract: "mioThink",
          event: "ThoughtTokenized",
          data: {
            to: to,
            nftID: nftID.toString(),
            contractAddress: contractAddress,
            thought: thought,
          },
        })
      );
    }
  );

  mioThink.on("contractValueWithdrawn", (to, amount, event) => {
    // Log the event arguments
    console.log("mioThink event 'contractValueWithdrawn' emitted:");
    console.log("To:", to);
    console.log("Amount:", amount.toString());

    // Send the event data to the WebSocket client
    ws.send(
      JSON.stringify({
        contract: "mioThink",
        event: "contractValueWithdrawn",
        data: {
          to: to,
          amount: amount.toString(),
        },
      })
    );
  });
}
module.exports = {
  listenForMioCoreEvents,
  listenForMioMarketEvents,
  listenForMioThinkEvents,
};
