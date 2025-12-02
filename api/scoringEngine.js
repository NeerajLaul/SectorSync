// api/scoringEngine.js
import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

const methodsPath = path.join(process.cwd(), "data/methods.json");
// The methods file is an ARRAY, so we load it as one.
const methods = JSON.parse(fs.readFileSync(methodsPath, "utf8"));

// Answers that should be treated as "no information" and ignored
const UNKNOWN_TOKENS = [
  "unknown",
  "undetermined",
  "not sure",
  "unsure",
  "n/a",
  "na",
  "none",
  "prefer not to say"
];

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
  // Get the list of valid scoring factors from the first method
  // This prevents non-scoring answers (like "q1762380000245")
  // from being included in the average.
  const factorKeys = Object.keys(methods[0].attributes);

  // Normalize *only* the relevant, meaningful answers
  const normalized = {};

  for (const key of factorKeys) {
    const raw = userAnswers[key];
    if (raw === undefined || raw === null) continue;

    const value = String(raw).trim();
    if (!value) continue;

    const lower = value.toLowerCase();

    // Skip "unknown/undetermined/not sure" style answers entirely:
    // they provide no signal and should not affect scores
    if (UNKNOWN_TOKENS.includes(lower)) continue;

    normalized[key] = lower;
  }

  // If no relevant factors were answered, return empty
  if (Object.keys(normalized).length === 0) {
    return { ranking: [], engineVersion: "4.0.4-fuzzy-unknown-skip" };
  }

  const allScores = [];

  // Loop over 'methods' as an ARRAY
  for (const methodObj of methods) {
    const methodName = methodObj.name;
    const methodAttrs = methodObj.attributes;
    let total = 0;
    const contributions = [];

    // Inner loop iterates over normalized, relevant answers
    for (const [factor, userVal] of Object.entries(normalized)) {
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

    // Denominator = number of relevant answers actually used
    const avgScore = total / Object.keys(normalized).length;

    allScores.push({ method: methodName, score: avgScore, contributions });
  }

  allScores.sort((a, b) => b.score - a.score);

  // Bumped version number to show unknown-handling is active
  return { ranking: allScores, engineVersion: "4.0.4-fuzzy-unknown-skip" };
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

export { scoreMethodologies };
export default router;
