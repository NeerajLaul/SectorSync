// api/answers.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const answersFile = path.join(process.cwd(), "data/answers.json");

function shortId() {
  return Math.random().toString(36).slice(2, 8);
}

function readAnswersFile() {
  if (!fs.existsSync(answersFile)) return {};
  const raw = fs.readFileSync(answersFile, "utf-8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeAnswersFile(obj) {
  fs.writeFileSync(answersFile, JSON.stringify(obj, null, 2));
}

// Save a result
router.post("/", (req, res) => {
  try {
    const { answers, results } = req.body || {};
    if (!answers || !results || !Array.isArray(results)) {
      return res.status(400).json({ error: "Missing answers or results[]" });
    }

    const data = readAnswersFile();
    const id = shortId();

    data[id] = {
      answers,
      results: results.map((r) => ({
        method: r.name || r.method,
        score: r.score,
      })),
      timestamp: new Date().toISOString(),
    };

    writeAnswersFile(data);
    res.json({ success: true, id });
  } catch (err) {
    console.error("Error saving answers:", err);
    res.status(500).json({ error: "Failed to save answers" });
  }
});

// Retrieve by ID
router.get("/:id", (req, res) => {
  try {
    const data = readAnswersFile();
    const rec = data[req.params.id];
    if (!rec) return res.status(404).json({ error: "Not found" });
    res.json(rec);
  } catch (err) {
    console.error("Error reading answers:", err);
    res.status(500).json({ error: "Failed to read answers" });
  }
});

export default router;
