const express = require("express");
const os = require("os");

const app = express();
const port = process.env.PORT || 3000;

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

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor executando na porta ${port}`);
});
