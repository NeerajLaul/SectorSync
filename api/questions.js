// api/questions.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const questionsFile = path.join(process.cwd(), "data/questions.json");

// --- Utility functions ---
function readQuestionsFile() {
  if (!fs.existsSync(questionsFile)) return [];
  const raw = fs.readFileSync(questionsFile, "utf-8").trim();
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (err) {

    console.error("CRITICAL: Failed to parse questions.json:", err.message);
    console.error("File content snippet:", raw.substring(0, 50));
    return [];
  }
}

function writeQuestionsFile(obj) {
  fs.writeFileSync(questionsFile, JSON.stringify(obj, null, 2));
}

// --- Routes ---

// Get all questions
router.get("/", (req, res) => {
  try {
    const data = readQuestionsFile();
    res.json(data);
  } catch (err) {
    console.error("Error reading questions:", err);
    res.status(500).json({ error: "Failed to read questions" });
  }
});

// Add a new question (admin use)
router.post("/", (req, res) => {
  try {
    const { id, question, description, options } = req.body || {};
    if (!id || !question || !Array.isArray(options)) {
      return res.status(400).json({ error: "Missing or invalid question data" });
    }

    const data = readQuestionsFile();
    const exists = data.some((q) => q.id === id);
    if (exists) {
      return res.status(400).json({ error: "Question ID already exists" });
    }

    data.push({ id, question, description, options });
    writeQuestionsFile(data);

    res.json({ success: true, message: "Question added", id });
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).json({ error: "Failed to add question" });
  }
});

// Update existing question (admin use)
router.put("/:id", (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body || {};

    const data = readQuestionsFile();
    const index = data.findIndex((q) => q.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Question not found" });
    }

    data[index] = { ...data[index], ...updates };
    writeQuestionsFile(data);

    res.json({ success: true, message: "Question updated", id });
  } catch (err) {
    console.error("Error updating question:", err);
    res.status(500).json({ error: "Failed to update question" });
  }
});

// Delete a question (admin use)
router.delete("/:id", (req, res) => {
  try {
    const id = req.params.id;

    const data = readQuestionsFile();
    const index = data.findIndex((q) => q.id === id);
    if (index === -1) {
      return res.status(404).json({ error: "Question not found" });
    }

    data.splice(index, 1);
    writeQuestionsFile(data);

    res.json({ success: true, message: "Question deleted", id });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ error: "Failed to delete question" });
  }
});

// Bulk send questions
router.post("/bulk", (req, res) => {
  try {
    const questions = req.body;
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: "Expected an array of questions" });
    }
    fs.writeFileSync(questionsFile, JSON.stringify(questions, null, 2));
    res.json({ success: true, message: "All questions saved" });
  } catch (err) {
    console.error("Bulk save error:", err);
    res.status(500).json({ error: "Failed to save questions" });
  }
});


export default router;

