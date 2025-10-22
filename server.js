// server.js
import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { scoreMethodologies } from "./api/scoringEngine.js";
import answersRouter from "./api/answers.js";

const app = express();
app.use(express.json());

// Questions CRUD
const filePath = path.join(process.cwd(), "questions.json");

app.get("/api/data", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ error: "Failed to read data" });
    res.json(JSON.parse(data));
  });
});

app.post("/api/data", (req, res) => {
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).json({ error: "Failed to save data" });
    res.json({ success: true });
  });
});

// Scoring
app.post("/api/scoring", (req, res) => {
  try {
    const result = scoreMethodologies(req.body);
    res.json(result);
  } catch {
    res.status(500).json({ error: "Failed to score methodologies" });
  }
});

// Answers router
app.use("/api/answers", answersRouter);

// Serve built frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));

// Catch-all for non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(buildPath, "index.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

