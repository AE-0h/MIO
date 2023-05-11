const express = require("express");
const { listenForMioCoreEvents } = require("./events");
const port = process.argv[2] || 2222;

const app = express();

app.get("/", (req, res) => {
  res.send("API for mioCore, mioMarket, and mioThink");
});

const server = app.listen(port, () => {
  console.log(`HTTP server listening at http://localhost:${port}`);
});

listenForMioCoreEvents();
