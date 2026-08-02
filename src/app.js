const express = require("express");
const os = require("os");
const client = require("prom-client");

const app = express();

client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total de requisições HTTP recebidas",
  labelNames: ["method", "route", "status_code"]
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duração das requisições HTTP em segundos",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2]
});

app.use((req, res, next) => {
  // Evita contabilizar a coleta do próprio Prometheus.
  if (req.path === "/metrics") {
    return next();
  }

  const endTimer = httpRequestDuration.startTimer({
    method: req.method
  });

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: String(res.statusCode)
    };

    httpRequestsTotal.inc(labels);

    endTimer({
      route: labels.route,
      status_code: labels.status_code
    });
  });

  next();
});

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

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
