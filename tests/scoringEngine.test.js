import { scoreMethodologies } from '../api/scoringengine.js';

// Utility: assert winner (ties allowed if expected is among top scorers)
function expectTopMethod(user, expected) {
  const { ranking } = scoreMethodologies(user);
  expect(ranking.length).toBeGreaterThan(0);
  const best = ranking[0].score;
  const leaders = ranking.filter(r => r.score === best).map(r => r.method);
  // Debug if needed:
  // console.log({ expected, leaders, top3: ranking.slice(0,3) });
  expect(leaders).toContain(expected);
}

/**
 * Notes:
 * - Uses professor guidance:
 *   Team size: Small(1–10), Medium(10–50), Large(50–200), Enterprise(200+)
 *   CD/Lean bias internal + continuous; PRINCE2/Waterfall infrequent milestone;
 *   SAFe structured reviews, external specialists; Hybrid fits Medium/Enterprise and behaves like Waterfall on comms;
 *   Payment: T&M = Scrum/SAFe/CD/LSS; Performance-based = Agile/Lean; Fixed Price & Milestones = Predictive(+ Lean).
 * - If you renamed Q5 to customer_interaction in your engine, replace `customer_size` with `customer_interaction`.
 */

// 1) Scrum — small, iterative, internal, speed/innovation, continuous feedback, T&M
test('Scrum wins (Small, iterative, internal, speed/innovation, continuous, T&M)', () => {
  expectTopMethod(
    {
      project_size: 'small',
      planning: 'iterative',
      sourcing: 'internal sourcing',
      goals: 'speed, innovation, optimization',
      customer_size: 'high engagement',
      customer_communication: 'continuous feedback loops',
      payment_method: 'time & materials',
      design: 'emergent',
      teams: 'cross-functional',
      development: 'iterative',
      integration_testing: 'continuous',
      closing: 'team acceptance',
    },
    'Scrum'
  );
});

// 2) SAFe — large, iterative, mixed/external specialists, predictable, structured reviews, T&M
test('SAFe wins (Large, iterative, mixed/external, predictable, structured, T&M)', () => {
  expectTopMethod(
    {
      project_size: 'large, enterprise',
      planning: 'iterative',
      sourcing: 'mixed internal/external',
      goals: 'predictable',
      customer_size: 'moderate engagement',
      customer_communication: 'milestone reviews', // structured program reviews
      payment_method: 'time & materials',
      design: 'partial / iterative design',
      teams: 'cross-functional',
      development: 'incremental',
      integration_testing: 'continuous',
      closing: 'customer acceptance',
    },
    'SAFe'
  );
});

// 3) Hybrid — enterprise, mixed planning, mixed sourcing, limited feedback, fixed/milestones
test('Hybrid wins (Enterprise, iterative + up-front, mixed, limited feedback, fixed/milestones)', () => {
  expectTopMethod(
    {
      project_size: 'enterprise',
      planning: 'iterative, up-front',
      sourcing: 'mixed internal/external',
      goals: 'speed, predictability',
      customer_size: 'low engagement',
      customer_communication: 'milestone reviews',
      payment_method: 'fixed price, milestone payments',
      design: 'iterative, emergent design',
      teams: 'cross-functional teams',
      development: 'linear, iterative',
      integration_testing: 'continuous, end phase',
      closing: 'team acceptance, customer acceptance',
    },
    'Hybrid'
  );
});

// 4) Waterfall — large, upfront, outsourced, predictive, milestone committee, fixed/milestones
test('Waterfall wins (Large, up-front, outsourced, predictable, milestone committee, FP/milestones)', () => {
  expectTopMethod(
    {
      project_size: 'large',
      planning: 'up-front',
      sourcing: 'heavily outsourced',
      goals: 'predictable',
      customer_size: 'low engagement',
      customer_communication: 'milestone reviews',
      payment_method: 'firm fixed price milestone payments',
      design: 'upfront / complete design',
      teams: 'specialist',
      development: 'linear',
      integration_testing: 'end phase',
      closing: 'customer acceptance',
    },
    'Waterfall'
  );
});

// 5) Lean Six Sigma — medium, continuous flow, internal, innovation/optimization, metrics, T&M
test('Lean Six Sigma wins (Medium, continuous flow, internal, innovation/optimization, metrics, T&M)', () => {
  expectTopMethod(
    {
      project_size: 'medium',
      planning: 'continuous flow',
      sourcing: 'internal',
      goals: 'innovation, optimization',
      customer_size: 'high engagement',
      customer_communication: 'performance metrics',
      payment_method: 'time & materials',
      design: 'process improvement design',
      teams: 'cross-functional',
      development: 'incremental',
      integration_testing: 'continuous',
      closing: 'customer acceptance',
    },
    'Lean Six Sigma'
  );
});

// 6) Lean Continuous Delivery Model — medium, internal bias, subscription, automated pipeline, continuous
test('Lean Continuous Delivery Model wins (Medium, internal bias, subscription, automated pipeline, continuous)', () => {
  expectTopMethod(
    {
      project_size: 'medium',
      planning: 'continuous flow',
      sourcing: 'internal sourcing team',
      goals: 'innovation, optimization',
      customer_size: 'high engagement',
      customer_communication: 'continuous feedback loops, performance metrics',
      payment_method: 'subscription, time & materials',
      design: 'modular, emergent design',
      teams: 'cross-functional teams',
      development: 'automated, incremental',
      integration_testing: 'continuous',
      closing: 'team acceptance',
    },
    'Lean Continuous Delivery Model'
  );
});

// 7) Disciplined Agile — large, iterative+incremental, mixed team, value-based, flexible comms
test('Disciplined Agile wins (Large, iterative+incremental, mixed, value-based, flexible comms)', () => {
  expectTopMethod(
    {
      project_size: 'large',
      planning: 'iterative, incremental',
      sourcing: 'mixed internal/external team',
      goals: 'speed, predictability',
      customer_size: 'moderate engagement',
      customer_communication: 'continuous feedback loops',
      payment_method: 'value-based, incremental',
      design: 'iterative, emergent design',
      teams: 'cross-functional, functional teams',
      development: 'iterative, incremental',
      integration_testing: 'continuous',
      closing: 'team acceptance',
    },
    'Disciplined Agile'
  );
});

// 8) PRINCE2 — enterprise, stage-based, mixed, predictive, milestone committee, end-phase, milestones
test('PRINCE2 wins (Enterprise, stage-based, mixed, predictive, milestone committee, end-phase, milestones)', () => {
  expectTopMethod(
    {
      project_size: 'enterprise',
      planning: 'stage-based',
      sourcing: 'mixed',
      goals: 'predictable',
      customer_size: 'low engagement',
      customer_communication: 'milestone reviews',
      payment_method: 'milestone payments',
      design: 'upfront design',
      teams: 'functional teams, problem-solving teams',
      development: 'linear, incremental',
      integration_testing: 'end phase',
      closing: 'customer acceptance, 3rd party acceptance',
    },
    'PRINCE2'
  );
});
