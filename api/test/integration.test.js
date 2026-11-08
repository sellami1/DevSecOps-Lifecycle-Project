const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { prisma } = require("../server");

const frontendUrl = process.env.FRONTEND_URL || "http://frontend:3000";
let createdMessageId;

before(async () => {
  await prisma.$connect();
});

after(async () => {
  if (createdMessageId) {
    await prisma.contactMessage.delete({ where: { id: createdMessageId } });
  }
  await prisma.$disconnect();
});

test("frontend contact submission reaches the API and PostgreSQL", async () => {
  const payload = {
    name: "Activity 4 integration test",
    email: "activity4@example.com",
    message: "Verify the frontend to API to PostgreSQL flow.",
  };
  const response = await fetch(`${frontendUrl}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });

  assert.equal(response.status, 201);
  const body = await response.json();

  const saved = await prisma.contactMessage.findUnique({ where: { id: body.contact.id } });
  createdMessageId = saved?.id;
  assert.ok(saved, "the submitted message must be persisted in PostgreSQL");
  assert.equal(saved.email, payload.email);
  assert.equal(saved.message, payload.message);
});
