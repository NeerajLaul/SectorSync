// === FUZZY PROJECT MANAGEMENT (PM) SCORING ENGINE ===
// Fully aligned with App.tsx and ResultsCard — stable version

// --- Helper: fuzzy text comparison ---
function fuzzyMatch(userVal, methodVal) {
  if (!methodVal) return 0;
  const u = userVal.toLowerCase();
  const m = methodVal.toLowerCase();

  if (u === m) return 1.0;
  if (m.includes(u) || u.includes(m)) return 0.8;
  if (u.split(' ').some(word => m.includes(word))) return 0.6;
  return 0.3;
}

// --- Fuzzy scoring computation ---
export function scoreMethodologies(userAnswers) {
  // Normalize user inputs
  const normalized = {};
  for (const key in userAnswers) normalized[key] = userAnswers[key].toLowerCase();

  // === METHODS DATABASE (names must match App.tsx) ===
  const methods = {
    "Scrum": {
      project_size: "small or medium",
      planning: "iterative",
      sourcing: "internal sourcing",
      goals: "speed",
      customer_size: "small or medium",
      customer_communication: "continuous feedback loops",
      payment_method: "time & materials",
      design: "emergent",
      teams: "cross-functional",
      development: "iterative",
      integration_testing: "continuous",
      closing: "team acceptance",
    },
    "SAFe": {
      project_size: "large",
      planning: "iterative",
      sourcing: "mixed internal/external",
      goals: "predictable",
      customer_size: "large",
      customer_communication: "milestone reviews",
      payment_method: "milestone payments",
      design: "partial / iterative design",
      teams: "cross-functional",
      development: "incremental",
      integration_testing: "continuous",
      closing: "customer acceptance",
    },
    "Hybrid": {
      project_size: "small medium large",
      planning: "iterative",
      sourcing: "mixed internal/external",
      goals: "predictable",
      customer_size: "medium large",
      customer_communication: "milestone reviews",
      payment_method: "milestone payments",
      design: "partial / iterative design",
      teams: "structured silo teams",
      development: "incremental",
      integration_testing: "end phase",
      closing: "customer acceptance",
    },
    "Waterfall": {
      project_size: "medium or large",
      planning: "up-front",
      sourcing: "heavily outsourced",
      goals: "predictable",
      customer_size: "large",
      customer_communication: "milestone reviews",
      payment_method: "firm fixed price milestone payments",
      design: "upfront / complete design",
      teams: "specialist",
      development: "linear",
      integration_testing: "end phase",
      closing: "customer acceptance",
    },
    "Lean Six Sigma": {
      project_size: "small to enterprise",
      planning: "continuous flow",
      sourcing: "internal",
      goals: "innovation",
      customer_size: "any",
      customer_communication: "performance metrics",
      payment_method: "time & materials",
      design: "process improvement design",
      teams: "cross-functional",
      development: "incremental",
      integration_testing: "continuous",
      closing: "customer acceptance",
    },
    "PRINCE2": {
      size: "medium, large",
      industry: "government, software, infrastructure, public sector",
      planning: "stage-based",
      sourcing: "mixed",
      goals: "predictable",
      customer_size: "large",
      customer_comm: "milestone reviews",
      payment: "milestone payments",
      design: "upfront",
      teams: "structured silo teams",
      development: "linear",
      integration: "end phase",
      closing: "customer acceptance"
    },
  };

  // === COMPUTE SCORES ===
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

    const answeredCount = Object.keys(normalized).length || 1;
    const avgScore = total / answeredCount;

    allScores.push({
      method,
      score: Math.round(avgScore * 10000) / 10000,
      contributions,
    });
  }

  allScores.sort((a, b) => b.score - a.score);

  // === RETURN FORMAT (unchanged) ===
  return {
    inputsNormalized: normalized,
    ranking: allScores,
    rulesApplied: [],
    engineVersion: "4.0.2-fuzzy-stable",
  };
}
