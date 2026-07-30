const express = require("express");
const os = require("os");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "API Node.js executando com Docker!" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
