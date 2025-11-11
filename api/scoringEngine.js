import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();

// ---------- Load Methods Data ----------
const methodsPath = path.join(process.cwd(), "data/methods.json");
const raw = fs.readFileSync(methodsPath, "utf8");
const methodsArray = JSON.parse(raw);

// Convert array → keyed object for scoring
const methods = {};
for (const m of methodsArray) {
  methods[m.name] = {
    id: m.id,
    name: m.name,
    description: m.description,
    ...m.attributes,
  };
}

// ---------- Entropy-Based Weights (sum = 1.00) ----------
const FACTOR_WEIGHTS = {
  design: 0.094,
  sourcing: 0.092,
  customer_size_or_interactions: 0.086,
  project_size: 0.085,
  payment_method: 0.082,
  planning: 0.080,
  goals: 0.077,
  customer_communication: 0.075,
  integration_testing: 0.068,
  teams: 0.067,
  closing_extra: 0.067, // for future compatibility
  closing: 0.064,
  development: 0.063,
};

// ---------- Fuzzy Utilities ----------
function splitMulti(methodVal) {
  return String(methodVal)
    .split(/[,/;]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function baseFuzzy(userVal, methodVal) {
  if (!methodVal) return 0;
  const u = String(userVal).toLowerCase().trim();
  const m = String(methodVal).toLowerCase().trim();
  if (!u || !m) return 0;
  if (u === m) return 1.0;
  if (m.includes(u) || u.includes(m)) return 0.8;
  const uWords = u.split(/\s+/).filter(Boolean);
  if (uWords.some((w) => m.includes(w))) return 0.6;
  return 0.3;
}

function fuzzyMatch(userVal, methodVal) {
  if (!methodVal) return 0;
  const parts = splitMulti(methodVal);
  if (parts.length === 0) return baseFuzzy(userVal, methodVal);
  let best = 0;
  for (const p of parts) best = Math.max(best, baseFuzzy(userVal, p));
  return best;
}

// ---------- Weight Normalization ----------
function selectAndRenormalizeWeights(userAnswers) {
  const present = Object.keys(userAnswers);
  let total = 0;
  const used = {};
  for (const f of present) {
    if (FACTOR_WEIGHTS[f] != null) {
      total += FACTOR_WEIGHTS[f];
      used[f] = FACTOR_WEIGHTS[f];
    }
  }

  // fallback: equal weights
  if (total <= 0 && present.length > 0) {
    const w = 1 / present.length;
    for (const f of present) used[f] = w;
    return { usedWeights: used };
  }

  // normalize to sum = 1
  for (const f of Object.keys(used)) used[f] = used[f] / total;
  return { usedWeights: used };
}

// ---------- Scoring Logic ----------
export function scoreMethodologies(userAnswers) {
  const normalized = {};
  for (const key in userAnswers) normalized[key] = String(userAnswers[key]);

  const { usedWeights } = selectAndRenormalizeWeights(normalized);
  const allScores = [];

  for (const [methodName, attrs] of Object.entries(methods)) {
    let total = 0;
    const contributions = [];

    for (const [factor, userVal] of Object.entries(normalized)) {
      const w = usedWeights[factor];
      if (w == null) continue;
      const methodVal = attrs[factor];
      const fuzzy = fuzzyMatch(userVal, methodVal);
      const weighted = w * fuzzy;
      total += weighted;

      contributions.push({
        factor,
        weight: Math.round(w * 10000) / 10000,
        match: Math.round(fuzzy * 10000) / 10000,
        delta: Math.round(weighted * 10000) / 10000,
        user: userVal,
        methodValue: methodVal ?? null,
      });
    }

    allScores.push({
      method: methodName,
      id: attrs.id,
      score: Math.round(total * 10000) / 10000,
      contributions,
    });
  }

  // Add id + description back
  for (const row of allScores) {
    const meta = methodsArray.find((m) => m.name === row.method);
    if (meta) {
      row.id = meta.id;
      row.description = meta.description;
    }
  }

  allScores.sort((a, b) => b.score - a.score);

  return {
    inputsNormalized: normalized,
    ranking: allScores,
    rulesApplied: [],
    engineVersion: "4.3.0-entropy-weighted-fuzzy",
  };
}

// ---------- Express Route ----------
router.post("/", (req, res) => {
  try {
    const result = scoreMethodologies(req.body || {});
    result.answers = req.body || {};
    res.json(result);
  } catch (err) {
    console.error("Error scoring:", err);
    res.status(500).json({ error: "Scoring failed" });
  }
});

export default router;
