// api/scoringEngine.js
import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

const methodsPath = path.join(process.cwd(), "data/methods.json");
const methods = JSON.parse(fs.readFileSync(methodsPath, "utf8"));

function fuzzyMatch(userVal, methodVal) {
  if (!methodVal) return 0;
  const u = userVal.toLowerCase();
  const m = methodVal.toLowerCase();
  if (u === m) return 1.0;
  if (m.includes(u) || u.includes(m)) return 0.8;
  if (u.split(" ").some((word) => m.includes(word))) return 0.6;
  return 0.3;
}

function scoreMethodologies(userAnswers) {
  const normalized = {};
  for (const key in userAnswers)
    normalized[key] = String(userAnswers[key]).toLowerCase();

  const allScores = [];
  for (const [method, attrs] of Object.entries(methods)) {
    let total = 0;
    const contributions = [];
    for (const [factor, userVal] of Object.entries(normalized)) {
      const methodVal = attrs[factor];
      const score = fuzzyMatch(userVal, methodVal);
      total += score;
      contributions.push({
        factor,
        normValue: 1,
        sensitivity: 0,
        delta: Math.round(score * 10000) / 10000,
      });
    }
    const avgScore = total / Object.keys(normalized).length;
    allScores.push({ method, score: avgScore, contributions });
  }
  allScores.sort((a, b) => b.score - a.score);
  return { ranking: allScores, engineVersion: "4.0.2-fuzzy-stable" };
}

router.post("/", (req, res) => {
  try {
    const result = scoreMethodologies(req.body);
    result.answers = req.body;
    res.json(result);
  } catch (err) {
    console.error("Error scoring:", err);
    res.status(500).json({ error: "Scoring failed" });
  }
});

export default router;
