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
    assert.equal(body.message, "API Node.js executando com Docker!");
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
