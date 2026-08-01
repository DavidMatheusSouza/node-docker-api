const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../src/app");

async function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
  });
}

test("GET / retorna a mensagem da API", async () => {
  const server = await startServer();

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.message, "Deploy automático funcionando!");
    assert.equal(body.version, "1.1.0");
  } finally {
    server.close();
  }
});

test("GET /health informa que a API está saudável", async () => {
  const server = await startServer();

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, "ok");
    assert.ok(body.hostname);
    assert.ok(body.timestamp);
  } finally {
    server.close();
  }
});

test("GET /metrics expõe métricas do Prometheus", async () => {
  const server = await startServer();

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/metrics`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(
      response.headers.get("content-type"),
      /text\/plain/
    );
    assert.match(body, /process_resident_memory_bytes/);
  } finally {
    server.close();
  }
});
