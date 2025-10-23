// Scoring engine based on the Python backend logic v3.0
// Maps user choices to normalized values and calculates methodology scores

export interface FactorOptions {
  [key: string]: { [option: string]: number };
}

export interface MethodSensitivities {
  [methodology: string]: { [factor: string]: number };
}

export interface UserAnswers {
  [factor: string]: string;
}

export interface Contribution {
  factor: string;
  normValue: number;
  sensitivity: number;
  delta: number;
}

export interface MethodScore {
  method: string;
  score: number;
  contributions: Contribution[];
}

export interface ScoringResult {
  inputsNormalized: { [factor: string]: number };
  ranking: MethodScore[];
  rulesApplied: any[];
  engineVersion: string;
}

// Factor options (exact labels mapped to 0 / 0.5 / 1)
export const FACTOR_OPTIONS: FactorOptions = {
  project_size: { "Small": 0.0, "Medium": 0.5, "Large": 1.0 },
  planning: { "Iterative": 0.0, "Continuous Flow": 0.5, "Up-front": 1.0 },
  sourcing: { "Internal Sourcing": 0.0, "Mixed Internal/External": 0.5, "Heavily Outsourced": 1.0 },
  goals: { "Speed": 0.0, "Predictable": 0.5, "Innovation": 1.0 },
  customer_size: { "Small": 0.0, "Medium": 0.5, "Large": 1.0 },
  customer_communication: {
    "Continuous Feedback Loops": 0.0,
    "Milestone Reviews": 0.5,
    "Performance Metrics": 1.0
  },
  payment_method: {
    "Time & Materials": 0.0,
    "Milestone Payments": 0.5,
    "Firm Fixed Price": 1.0,
    "Upfront Purchase": 1.0
  },
  design: {
    "Emergent": 0.0,
    "Partial / Iterative Design": 0.5,
    "Upfront/Complete Design": 1.0
  },
  teams: {
    "Cross-functional": 0.0,
    "Specialist": 0.5,
    "Structured Silo Teams": 1.0
  },
  development: { "Iterative": 0.0, "Incremental": 0.5, "Linear": 1.0 },
  integration_testing: { "Continuous": 0.0, "When possible": 0.5, "End Phase": 1.0 },
  closing: { "Team Acceptance": 0.0, "Customer Acceptance": 0.5, "3rd Party Acceptance": 1.0 },
};

// Method sensitivities (−1..+1)
export const METHOD_SENSITIVITIES: MethodSensitivities = {
  "Scrum": {
    project_size: -0.3, planning: -0.5, sourcing: -0.6, goals: 0.6,
    customer_size: -0.2, customer_communication: -0.5, payment_method: -0.6,
    design: -0.6, teams: -0.3, development: 0.6, integration_testing: -0.4, closing: -0.5,
  },
  "SAFe": {
    project_size: 0.7, planning: 0.3, sourcing: 0.6, goals: 0.3,
    customer_size: 0.6, customer_communication: 0.5, payment_method: 0.4,
    design: 0.3, teams: 0.7, development: 0.6, integration_testing: 0.6, closing: 0.5,
  },
  "Hybrid": {
    project_size: 0.5, planning: 0.6, sourcing: 0.5, goals: 0.2,
    customer_size: 0.4, customer_communication: 0.6, payment_method: 0.6,
    design: 0.6, teams: 0.4, development: 0.3, integration_testing: 0.5, closing: 0.6,
  },
  "Waterfall": {
    project_size: 0.3, planning: 0.9, sourcing: 0.9, goals: -0.5,
    customer_size: 0.5, customer_communication: 0.9, payment_method: 0.9,
    design: 0.9, teams: 0.8, development: 0.8, integration_testing: 0.8, closing: 0.9,
  },
  "Lean Six Sigma": {
    project_size: 0.6, planning: 0.8, sourcing: 0.5, goals: 1.0,
    customer_size: 0.6, customer_communication: 0.9, payment_method: 0.5,
    design: 0.8, teams: 0.4, development: 0.6, integration_testing: 0.8, closing: 0.9,
  },
  "PRINCE2": {
    project_size: 0.8, planning: 0.9, sourcing: 0.8, goals: 0.4,
    customer_size: 0.9, customer_communication: 0.8, payment_method: 0.8,
    design: 0.7, teams: 0.7, development: 0.5, integration_testing: 0.7, closing: 0.9,
  },
  "Disciplined Agile": {
    project_size: 0.4, planning: 0.2, sourcing: 0.3, goals: 0.8,
    customer_size: 0.5, customer_communication: 0.4, payment_method: 0.3,
    design: 0.3, teams: 0.6, development: 0.8, integration_testing: 0.6, closing: 0.4,
  },
  "Continuous Delivery": {
    project_size: -0.2, planning: -0.4, sourcing: -0.3, goals: 0.9,
    customer_size: -0.2, customer_communication: -0.5, payment_method: -0.4,
    design: -0.3, teams: 0.5, development: 1.0, integration_testing: 1.0, closing: -0.5,
  },
};

// Bias adjustment (adds a small constant to scores)
export const METHOD_BIAS: { [method: string]: number } = {
  "Scrum": 0.05,
  "SAFe": 0.03,
  "Hybrid": 0.02,
  "Waterfall": 0.00,
  "Lean Six Sigma": 0.01,
  "PRINCE2": 0.02,
  "Disciplined Agile": 0.04,
  "Continuous Delivery": 0.03,
};

// --- GATES ---
function gateHeavyPlanClose(inputs: { [key: string]: number }): [boolean, string[], string] {
  if ((inputs.planning || 0) >= 0.75 && (inputs.closing || 0) >= 0.75) {
    return [
      true,
      ["Scrum"],
      "High upfront planning + formal closing conflict with lightweight Scrum. Consider PRINCE2 or Waterfall."
    ];
  }
  return [false, [], ""];
}

function gateCdVsUpfront(inputs: { [key: string]: number }): [boolean, string[], string] {
  if (
    (inputs.planning || 0) <= 0.25 &&
    (inputs.integration_testing || 0) >= 0.8 &&
    (inputs.development || 0) >= 0.8
  ) {
    return [
      true,
      ["Waterfall", "PRINCE2"],
      "Signals point to Continuous Delivery (high CI/CD, low upfront planning), which conflicts with plan-heavy predictive methods."
    ];
  }
  return [false, [], ""];
}

const GATES = [gateHeavyPlanClose, gateCdVsUpfront];

// --- NUDGES ---
function nudgeLargeStructured(inputs: { [key: string]: number }): { [method: string]: number } {
  const deltas: { [method: string]: number } = {};
  if ((inputs.project_size || 0) >= 0.75 && (inputs.teams || 0) >= 0.75) {
    deltas["SAFe"] = 0.15;
    deltas["Hybrid"] = 0.10;
    deltas["PRINCE2"] = 0.08;
  }
  return deltas;
}

function nudgeGovernanceHeavy(inputs: { [key: string]: number }): { [method: string]: number } {
  const deltas: { [method: string]: number } = {};
  if ((inputs.planning || 0) >= 0.75 && (inputs.closing || 0) >= 0.75) {
    deltas["PRINCE2"] = 0.15;
    deltas["Waterfall"] = 0.10;
  }
  return deltas;
}

function nudgeCdPattern(inputs: { [key: string]: number }): { [method: string]: number } {
  const deltas: { [method: string]: number } = {};
  if (
    (inputs.integration_testing || 0) >= 0.8 &&
    (inputs.development || 0) >= 0.8 &&
    (inputs.planning || 0) <= 0.5
  ) {
    deltas["Continuous Delivery"] = 0.18;
    deltas["Scrum"] = 0.05;
    deltas["SAFe"] = 0.03;
  }
  return deltas;
}

function nudgeDaWhenMixed(inputs: { [key: string]: number }): { [method: string]: number } {
  const deltas: { [method: string]: number } = {};
  
  const predictiveSignals = [
    (inputs.planning || 0) >= 0.65,
    (inputs.closing || 0) >= 0.65,
    (inputs.design || 0) >= 0.65,
  ].filter(Boolean).length;
  
  const agileSignals = [
    (inputs.development || 0) >= 0.65,
    (inputs.integration_testing || 0) >= 0.65,
    (inputs.customer_communication || 0) <= 0.4,
  ].filter(Boolean).length;
  
  if (predictiveSignals >= 1 && agileSignals >= 1) {
    deltas["Disciplined Agile"] = 0.12;
    deltas["Hybrid"] = 0.06;
  }
  return deltas;
}

const NUDGES = [nudgeLargeStructured, nudgeGovernanceHeavy, nudgeCdPattern, nudgeDaWhenMixed];

// Normalize user answers to 0/0.5/1 values
function normalizeAnswers(raw: UserAnswers): { [key: string]: number } {
  const normalized: { [key: string]: number } = {};
  for (const factor in FACTOR_OPTIONS) {
    if (factor in raw && raw[factor]) {
      const options = FACTOR_OPTIONS[factor];
      const userChoice = raw[factor];
      
      if (userChoice in options) {
        normalized[factor] = options[userChoice];
      } else {
        const lower = userChoice.trim().toLowerCase();
        for (const [key, value] of Object.entries(options)) {
          if (key.toLowerCase() === lower) {
            normalized[factor] = value;
            break;
          }
        }
      }
    }
  }
  return normalized;
}

// Apply gate rules
function applyGates(inputs: { [key: string]: number }): [string[], any[]] {
  const excluded: string[] = [];
  const trace: any[] = [];
  
  for (const gate of GATES) {
    const [hit, methods, why] = gate(inputs);
    if (hit) {
      excluded.push(...methods);
      trace.push({ type: "gate", affects: methods, why });
    }
  }
  
  return [Array.from(new Set(excluded)), trace];
}

// Apply nudge rules
function applyNudges(inputs: { [key: string]: number }): [{ [method: string]: number }, any[]] {
  const delta: { [method: string]: number } = {};
  const trace: any[] = [];
  
  for (const nudge of NUDGES) {
    const d = nudge(inputs);
    if (Object.keys(d).length > 0) {
      for (const [method, value] of Object.entries(d)) {
        delta[method] = (delta[method] || 0) + value;
      }
      trace.push({ type: "nudge", delta: d });
    }
  }
  
  return [delta, trace];
}

// Main scoring function
export function scoreMethodologies(userAnswers: UserAnswers): ScoringResult {
  const normalized = normalizeAnswers(userAnswers);
  const [excluded, gateTrace] = applyGates(normalized);
  const [nudgeDelta, nudgeTrace] = applyNudges(normalized);
  
  const allScores: MethodScore[] = [];
  
  for (const [method, sensitivities] of Object.entries(METHOD_SENSITIVITIES)) {
    if (excluded.includes(method)) {
      continue;
    }
    
    let total = METHOD_BIAS[method] || 0.0;
    total += nudgeDelta[method] || 0.0;
    
    const contributions: Contribution[] = [];
    
    for (const [factor, value] of Object.entries(normalized)) {
      if (factor in sensitivities) {
        const sensitivity = sensitivities[factor];
        const delta = sensitivity * value;
        total += delta;
        
        contributions.push({
          factor,
          normValue: value,
          sensitivity,
          delta: Math.round(delta * 10000) / 10000
        });
      }
    }
    
    allScores.push({
      method,
      score: Math.round(total * 10000) / 10000,
      contributions
    });
  }
  
  allScores.sort((a, b) => b.score - a.score);
  
  return {
    inputsNormalized: normalized,
    ranking: allScores,
    rulesApplied: [...gateTrace, ...nudgeTrace],
    engineVersion: "3.0.0"
  };
}
