// === FUZZY + WEIGHTED PROJECT MANAGEMENT (PM) SCORING ENGINE ===
// Engine: 4.1.0-fuzzy-weighted-prof

// --- Helper: fuzzy text comparison (unchanged) ---
function fuzzyMatch(userVal, methodVal) {
  if (!methodVal) return 0;
  const u = String(userVal).toLowerCase();
  const m = String(methodVal).toLowerCase();

  if (u === m) return 1.0;
  if (m.includes(u) || u.includes(m)) return 0.8;
  if (u.split(' ').some(word => m.includes(word))) return 0.6;
  return 0.3;
}

// --- Suggested weights (sum ≈ 1.0) ---
// --- weights are decided based on the variation of possible answers. Factors with a higher variation are weighted slightly higher
const WEIGHTS = {
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
  closing_extra: 0.067,
  closing: 0.064,
  development: 0.063, // adjusted by 0.001 to balance total = 1.000
};

// Fallback weight if a factor appears that isn’t in WEIGHTS
const DEFAULT_WEIGHT = 0.05;

// --- Scoring ---
export function scoreMethodologies(userAnswers) {
  // Normalize user inputs
  const normalized = {};
  for (const key in userAnswers) normalized[key] = String(userAnswers[key]).toLowerCase();

  // === METHODS DATABASE (professor-aligned) ===
  // Use comma-separated phrases to expose multiple acceptable cues to the fuzzy matcher.
  const methods = {
    "Scrum": {
      project_size: "small, medium",
      planning: "iterative",
      sourcing: "internal sourcing",
      goals: "speed, innovation, optimization",
      customer_communication: "continuous feedback loops",
      payment_method: "time & materials",
      design: "emergent",
      teams: "cross-functional",
      development: "iterative",
      integration_testing: "continuous",
      closing: "team acceptance",
    },

    "SAFe": {
      project_size: "large, enterprise",
      planning: "iterative",
      sourcing: "mixed internal/external, external specialists",
      goals: "predictable",
      customer_communication: "milestone reviews", // program/PI reviews
      payment_method: "time & materials",
      design: "partial / iterative design",
      teams: "cross-functional",
      development: "incremental",
      integration_testing: "continuous",
      closing: "customer acceptance",
    },

    // Medium–Enterprise; mixed sourcing & planning; milestone cadence; fixed/milestones OK
    "Hybrid": {
      project_size: "medium, enterprise, large",
      planning: "iterative, up-front",
      sourcing: "mixed internal/external",
      goals: "speed, predictability",
      customer_communication: "milestone reviews",
      payment_method: "fixed price, milestone payments",
      design: "iterative, emergent design",
      teams: "cross-functional teams",
      development: "linear, iterative",
      integration_testing: "continuous, end phase",
      closing: "team acceptance, customer acceptance",
    },

    "Waterfall": {
      project_size: "medium, large",
      planning: "up-front",
      sourcing: "heavily outsourced",
      goals: "predictable",
      customer_communication: "milestone reviews",
      payment_method: "firm fixed price milestone payments",
      design: "upfront / complete design",
      teams: "specialist",
      development: "linear",
      integration_testing: "end phase",
      closing: "customer acceptance",
    },

    // Process improvement anywhere; internal bias common
    "Lean Six Sigma": {
      project_size: "small, medium, large",
      planning: "continuous flow",
      sourcing: "internal",
      goals: "innovation, optimization",
      customer_communication: "performance metrics",
      payment_method: "time & materials, performance-based",
      design: "process improvement design",
      teams: "cross-functional",
      development: "incremental",
      integration_testing: "continuous",
      closing: "customer acceptance",
    },

    // Best for Small–Medium (can stretch); internal bias; subscription + automated pipeline
    "Lean Continuous Delivery Model": {
      project_size: "small, medium, (large when feasible)",
      planning: "continuous flow",
      sourcing: "internal sourcing team",
      goals: "innovation, optimization",
      customer_communication: "continuous feedback loops, performance metrics",
      payment_method: "subscription, time & materials",
      design: "modular, emergent design",
      teams: "cross-functional teams",
      development: "automated, incremental",
      integration_testing: "continuous",
      closing: "team acceptance",
    },

    // Medium–Enterprise; flexible governance; value-based funding
    "Disciplined Agile": {
      project_size: "medium, large, enterprise",
      planning: "iterative, incremental",
      sourcing: "mixed internal/external team",
      goals: "speed, predictability",
      customer_communication: "continuous feedback loops",
      payment_method: "value-based, incremental",
      design: "iterative, emergent design",
      teams: "cross-functional, functional teams",
      development: "iterative, incremental",
      integration_testing: "continuous",
      closing: "team acceptance",
    },

    // Large–Enterprise; stage-based; milestone committee; end-phase integration
    "PRINCE2": {
      project_size: "large, enterprise",
      planning: "stage-based",
      sourcing: "mixed",
      goals: "predictable",
      customer_communication: "milestone reviews",
      payment_method: "milestone payments, fixed price",
      design: "upfront design",
      teams: "functional teams, problem-solving teams",
      development: "linear, incremental",
      integration_testing: "end phase",
      closing: "customer acceptance, 3rd party acceptance",
    },
  };

  // === COMPUTE SCORES (weighted average of fuzzy matches) ===
  const allScores = [];

  for (const [method, attrs] of Object.entries(methods)) {
    let total = 0;
    let weightSum = 0;
    const contributions = [];

    for (const [factor, userVal] of Object.entries(normalized)) {
      const methodVal = attrs[factor];
      const score = fuzzyMatch(userVal, methodVal);
      const w = WEIGHTS[factor] ?? DEFAULT_WEIGHT;

      total += score * w;
      weightSum += w;

      contributions.push({
        factor,
        weight: Math.round(w * 1000) / 1000,
        delta: Math.round(score * 10000) / 10000,
        contribution: Math.round(score * w * 10000) / 10000,
      });
    }

    const avgScore = weightSum > 0 ? total / weightSum : 0;

    allScores.push({
      method,
      score: Math.round(avgScore * 10000) / 10000,
      contributions,
    });
  }

  allScores.sort((a, b) => b.score - a.score);

  return {
    inputsNormalized: normalized,
    ranking: allScores,
    rulesApplied: [],
    engineVersion: "4.1.0-fuzzy-weighted-prof",
  };
}
