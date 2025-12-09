import express from "express";
import Answer from "../models/Answer.js";
import User from "../models/User.js"; // 1. Ensure User is imported
import jwt from "jsonwebtoken"; // 2. Ensure JWT is imported

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret";

function shortId() {
  return Math.random().toString(36).slice(2, 8);
}

// SAVE A RESULT
router.post("/", async (req, res) => {
  try {
    const { answers, results, projectName, projectDescription } = req.body || {};

    if (!answers || !results || !Array.isArray(results)) {
      return res.status(400).json({ error: "Missing answers or results[]" });
    }

    const id = shortId();

    // 1. Save the Answer to the Database
    await Answer.create({
      recordId: id,
      records: {
        projectName, 
        projectDescription,
        answers,
        results: results.map((r) => ({
          method: r.name || r.method,
          score: r.score,
        })),
      },
    });
    
    console.log(`✅ Saved Answer Record: ${id}`);

    // 2. CRITICAL FIX: Link to User if logged in
    const token = req.cookies?.token;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.userId) {
          // This is the line that makes persistence work:
          await User.findByIdAndUpdate(decoded.userId, {
            $push: { assessments: id }
          });
          console.log(`🔗 SUCCESS: Linked result ${id} to User ${decoded.userId}`);
        }
      } catch (e) {
        console.log("⚠️ Token invalid - Result saved as Anonymous");
      }
    } else {
        console.log("ℹ️ No token found - Result saved as Anonymous");
    }

    res.json({ success: true, id });
  } catch (err) {
    console.error("❌ Error saving answers:", err);
    res.status(500).json({ error: "Failed to save answers" });
  }
});

// LOAD A RESULT
router.get("/:id", async (req, res) => {
  try {
    const rec = await Answer.findOne({ recordId: req.params.id });
    if (!rec) return res.status(404).json({ error: "Not found" });
    res.json(rec.records);
  } catch (err) {
    res.status(500).json({ error: "Failed to read answers" });
  }
});

export default router;