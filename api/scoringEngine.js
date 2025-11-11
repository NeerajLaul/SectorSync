// api/scoringEngine.js
import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

const methodsPath = path.join(process.cwd(), "data/methods.json");
// FIX: The methods file is an ARRAY, so we load it as one.
// This was NOT the bug, but the original loop treated it like an object.
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

// --- REBUILT FUNCTION ---
function scoreMethodologies(userAnswers) {
  // FIX 3: Get the list of valid scoring factors from the first method
  // This prevents non-scoring answers (like "q1762380000245")
  // from being included in the average.
  const factorKeys = Object.keys(methods[0].attributes);

  // FIX 3: Normalize *only* the relevant answers
  const normalized = {};
  for (const key of factorKeys) {
    if (userAnswers[key]) {
      // Only include factors that were actually answered
      normalized[key] = String(userAnswers[key]).toLowerCase();
    }
  }

  // If no relevant factors were answered, return empty
  if (Object.keys(normalized).length === 0) {
    return { ranking: [], engineVersion: "4.0.3-fuzzy-fixed" };
  }

  const allScores = [];

  // FIX 1: Loop over 'methods' as an ARRAY (not Object.entries)
  for (const methodObj of methods) {
    const methodName = methodObj.name;
    const methodAttrs = methodObj.attributes;
    let total = 0;
    const contributions = [];

    // Inner loop now iterates over *normalized, relevant* answers
    for (const [factor, userVal] of Object.entries(normalized)) {
      
      // FIX 2: Access attributes from 'methodAttrs' (methodObj.attributes)
      const methodVal = methodAttrs[factor];
      const score = fuzzyMatch(userVal, methodVal);
      total += score;
      
      contributions.push({
        factor,
        normValue: 1,
        sensitivity: 0,
        delta: Math.round(score * 10000) / 10000,
      });
    }

    // FIX 3: The denominator is now correct (length of relevant answers)
    const avgScore = total / Object.keys(normalized).length;

    // FIX 1: Push the 'methodName' (e.g., "Scrum")
    allScores.push({ method: methodName, score: avgScore, contributions });
  }

  allScores.sort((a, b) => b.score - a.score);
  // Bumped version number to show the fix is active
  return { ranking: allScores, engineVersion: "4.0.3-fuzzy-fixed" };
}
// --- END REBUILT FUNCTION ---

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
