// api/admin.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// File paths
const methodsFile = path.join(process.cwd(), "data/methods.json");
const questionsFile = path.join(process.cwd(), "data/questions.json");
const answersFile = path.join(process.cwd(), "data/answers.json");

// --- Utility functions ---
function readFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf-8").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --- Routes ---

// Get a summary of all data files
router.get("/summary", (req, res) => {
  try {
    const methods = Object.keys(readFile(methodsFile)).length;
    const questions = readFile(questionsFile).length;
    const answers = Object.keys(readFile(answersFile)).length;
    res.json({
      success: true,
      summary: {
        methods_count: methods,
        questions_count: questions,
        answers_count: answers,
      },
    });
  } catch (err) {
    console.error("Error reading summary:", err);
    res.status(500).json({ error: "Failed to read summary" });
  }
});

// Full export (for backup/admin view)
router.get("/export", (req, res) => {
  try {
    const methods = readFile(methodsFile);
    const questions = readFile(questionsFile);
    const answers = readFile(answersFile);
    res.json({ methods, questions, answers });
  } catch (err) {
    console.error("Error exporting data:", err);
    res.status(500).json({ error: "Failed to export data" });
  }
});

// Replace any file entirely (admin overwrite)
router.post("/replace/:type", (req, res) => {
  try {
    const type = req.params.type;
    const payload = req.body;
    if (!["methods", "questions", "answers"].includes(type)) {
      return res.status(400).json({ error: "Invalid file type" });
    }
    if (!payload) {
      return res.status(400).json({ error: "Missing data payload" });
    }

    const fileMap = {
      methods: methodsFile,
      questions: questionsFile,
      answers: answersFile,
    };

    writeFile(fileMap[type], payload);
    res.json({ success: true, message: `${type}.json replaced successfully` });
  } catch (err) {
    console.error("Error replacing data file:", err);
    res.status(500).json({ error: "Failed to replace data file" });
  }
});

// Delete all answers (reset)
router.delete("/reset/answers", (req, res) => {
  try {
    writeFile(answersFile, {});
    res.json({ success: true, message: "All answers cleared" });
  } catch (err) {
    console.error("Error resetting answers:", err);
    res.status(500).json({ error: "Failed to reset answers" });
  }
});

// Display all answers
router.get("/answers", (req, res) => {
  if (!fs.existsSync(answersFile)) return res.json({ success: true, answers: [] });

  try {
    const raw = fs.readFileSync(answersFile, "utf8").trim();
    if (!raw) return res.json({ success: true, answers: [] });

    const data = JSON.parse(raw);
    const array = Array.isArray(data) ? data : Object.values(data);
    res.json({ success: true, answers: array });
  } catch (err) {
    console.error("Error reading answers:", err);
    res.status(500).json({ success: false, error: "Failed to read answers" });
  }
});



export default router;
