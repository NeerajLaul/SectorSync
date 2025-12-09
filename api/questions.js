// api/questions.js
import express from "express";
import Question from "../models/Question.js";

const router = express.Router();

/**
 * ----------------------------------------------------
 * GET ALL QUESTIONS
 * ----------------------------------------------------
 * Returns documents EXACTLY as stored in MongoDB.
 */
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find().lean();
    res.json(questions);
  } catch (err) {
    console.error("❌ Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

/**
 * ----------------------------------------------------
 * ADD NEW QUESTION (Admin)
 * ----------------------------------------------------
 * MUST follow the exact DB schema:
 * {
 *   id,
 *   question,
 *   description,
 *   options: [
 *     { id, text, description, factorValue }
 *   ]
 * }
 */
router.post("/", async (req, res) => {
  try {
    const { id, question, description, options } = req.body;

    if (!id || !question || !Array.isArray(options)) {
      return res.status(400).json({ error: "Invalid question data" });
    }

    const exists = await Question.findOne({ id });
    if (exists) {
      return res.status(400).json({ error: "Question ID already exists" });
    }

    // Insert EXACT schema shape — no renaming
    const newQuestion = await Question.create({
      id,
      question,
      description,
      options: options.map((opt) => ({
        id: opt.id,
        text: opt.text,
        description: opt.description || "",
        factorValue: opt.factorValue || "",
      })),
    });

    res.json({ success: true, id: newQuestion.id });
  } catch (err) {
    console.error("❌ Error adding question:", err);
    res.status(500).json({ error: "Failed to add question" });
  }
});

/**
 * ----------------------------------------------------
 * UPDATE QUESTION
 * ----------------------------------------------------
 */
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;

    const updated = await Question.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });

    res.json({ success: true, updated });
  } catch (err) {
    console.error("❌ Error updating question:", err);
    res.status(500).json({ error: "Failed to update question" });
  }
});

/**
 * ----------------------------------------------------
 * DELETE QUESTION
 * ----------------------------------------------------
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Question.findOneAndDelete({ id: req.params.id });

    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting question:", err);
    res.status(500).json({ error: "Failed to delete question" });
  }
});

export default router;
