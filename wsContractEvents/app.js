const express = require("express");
const WebSocket = require("ws");
const {
  listenForMioCoreEvents,
  listenForMioMarketEvents,
  listenForMioThinkEvents,
} = require("./events");

const app = express();
const port = 2222;

app.get("/", (req, res) => {
  res.send("WebSocket API for mioCore, mioMarket, and mioThink");
});

const server = app.listen(port, () => {
  console.log(`WebSocket API listening at http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

console.log("WebSocket API listening at ws://localhost:2222");
console.log(wss);

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  // Listen for events from mioCore
  listenForMioCoreEvents(ws);

  // Listen for events from mioMarket
  listenForMioMarketEvents(ws);

  // Listen for events from mioThink
  listenForMioThinkEvents(ws);
});

wss.on("error", (error) => {
  console.log("WebSocket error: ", error);
});

wss.on("close", () => {
  console.log("WebSocket closed");
});
