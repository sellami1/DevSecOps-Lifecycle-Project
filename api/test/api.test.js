const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { createServer } = require("node:http");
const { createApp } = require("../server");

const savedContacts = [];
let server;
let baseUrl;
let dbCalls = 0;

before(async () => {
  const app = createApp({
    db: {
      contactMessage: {
        create: async ({ data }) => {
          dbCalls += 1;
          savedContacts.push(data);
          return { id: "test-id", createdAt: new Date("2026-01-01T00:00:00.000Z") };
        },
      },
    },
    contactLimit: 2,
    contactWindowMs: 60_000,
  });
  server = createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("health endpoint returns a status and security headers", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, "ok");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-powered-by"), null);
});

test("contact submission validates and stores the accepted fields", async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: " Ada Lovelace ",
      email: "ada@example.com",
      message: "Please contact me about secure delivery.",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.message, "Contact message received.");
  assert.equal(savedContacts[0].name, "Ada Lovelace");
  assert.equal(dbCalls, 1);
});

test("invalid and injection-shaped input is rejected without persistence", async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "x'); DROP TABLE contact_messages;--",
      email: "not-an-email",
      message: "short",
      unexpected: "not allowed",
    }),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.error.code, "VALIDATION_ERROR");
  assert.equal(dbCalls, 1);
});

test("malformed JSON receives a structured 400 response", async () => {
  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: '{"name":',
  });

  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, "INVALID_JSON");
});

test("unexpected errors use the centralized generic response", async () => {
  const app = createApp({
    db: { contactMessage: { create: async () => { throw new Error("database details"); } } },
  });
  const errorServer = createServer(app);
  await new Promise((resolve) => errorServer.listen(0, "127.0.0.1", resolve));

  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await fetch(`http://127.0.0.1:${errorServer.address().port}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "Ada",
        email: "ada@example.com",
        message: "Please contact me about secure delivery.",
      }),
    });

    assert.equal(response.status, 500);
    assert.deepEqual((await response.json()).error, {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    });
  } finally {
    console.error = originalError;
    await new Promise((resolve, reject) => errorServer.close((error) => error ? reject(error) : resolve()));
  }
});

test("sensitive contact route returns 429 after its configured limit", async () => {
  const rateServer = createServer(createApp({
    db: { contactMessage: { create: async () => ({ id: "unused", createdAt: new Date() }) } },
    contactLimit: 2,
    contactWindowMs: 60_000,
  }));
  await new Promise((resolve) => rateServer.listen(0, "127.0.0.1", resolve));

  try {
    const url = `http://127.0.0.1:${rateServer.address().port}/api/contact`;
    let requestNumber = 0;
    const request = () => fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `198.51.100.${++requestNumber}`,
      },
      body: JSON.stringify({}),
    });
    const first = await request();
    const second = await request();
    const limited = await request();

    assert.equal(first.status, 400);
    assert.equal(second.status, 400);
    assert.equal(limited.status, 429);
  } finally {
    await new Promise((resolve, reject) => rateServer.close((error) => error ? reject(error) : resolve()));
  }
});
