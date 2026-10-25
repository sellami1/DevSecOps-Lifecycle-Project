require("dotenv").config();
const express = require("express");
const cors = require("cors");

const profile = require("./data/profile");
const projects = require("./data/projects");
const skills = require("./data/skills");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

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

app.use((_req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`API listening on http://0.0.0.0:${PORT}`);
});
