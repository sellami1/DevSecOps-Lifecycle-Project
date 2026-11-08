require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { ipKeyGenerator, rateLimit } = require("express-rate-limit");
const { z } = require("zod");
const { PrismaClient } = require("@prisma/client");

const profile = require("./data/profile");
const projects = require("./data/projects");
const skills = require("./data/skills");

const prisma = new PrismaClient();

const contactSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(254),
    message: z.string().trim().min(10).max(5000),
  })
  .strict();

function createApp({ db = prisma, contactLimit = 5, contactWindowMs = 15 * 60 * 1000 } = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "10kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
  });

  app.get("/api/profile", (_req, res) => {
    res.json(profile);
  });

  app.get("/api/projects", (_req, res) => {
    res.json(projects);
  });

  app.get("/api/skills", (_req, res) => {
    res.json(skills);
  });

  app.post(
    "/api/contact",
    rateLimit({
      windowMs: contactWindowMs,
      limit: contactLimit,
      keyGenerator: (req) => ipKeyGenerator(req.socket.remoteAddress),
      standardHeaders: "draft-7",
      legacyHeaders: false,
      handler: (_req, res) => {
        res.status(429).json({
          error: { code: "RATE_LIMITED", message: "Too many contact requests. Try again later." },
        });
      },
    }),
    async (req, res, next) => {
      const result = contactSchema.safeParse(req.body);
      if (!result.success) {
        return next({
          status: 400,
          code: "VALIDATION_ERROR",
          message: "Invalid contact submission.",
          details: result.error.issues.map(({ path, message }) => ({ path, message })),
        });
      }

      try {
        const contact = await db.contactMessage.create({ data: result.data });
        res.status(201).json({
          message: "Contact message received.",
          contact: { id: contact.id, createdAt: contact.createdAt },
        });
      } catch (error) {
        next(error);
      }
    },
  );

  app.use((_req, _res, next) => {
    next({ status: 404, code: "NOT_FOUND", message: "Not found." });
  });

  app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
      return res.status(400).json({
        error: { code: "INVALID_JSON", message: "Request body must be valid JSON." },
      });
    }

    if (error.status && error.status < 500) {
      return res.status(error.status).json({
        error: {
          code: error.code || "BAD_REQUEST",
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      });
    }

    console.error("Unhandled API error:", error);
    return res.status(500).json({
      error: { code: "INTERNAL_SERVER_ERROR", message: "An unexpected error occurred." },
    });
  });

  return app;
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4000);
  createApp().listen(port, "0.0.0.0", () => {
    console.log(`API listening on http://0.0.0.0:${port}`);
  });
}

module.exports = { createApp, prisma };
