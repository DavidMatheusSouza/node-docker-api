const express = require("express");
const os = require("os");

const app = express();

app.get("/", (req, res) => {
  res.json({
    message: "Deploy automático funcionando!",
    version: "1.1.0"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

const client = require("prom-client");

client.collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
