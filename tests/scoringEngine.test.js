import { scoreMethodologies } from '../api/scoringengine.js';

// helper to assert the winner by name
function expectTopMethod(user, expected) {
  const { ranking } = scoreMethodologies(user);
  expect(ranking.length).toBeGreaterThan(0);
  const top = ranking[0].method;
  // if multiple tie, allow expected to be among top scorers
  const bestScore = ranking[0].score;
  const leaders = ranking.filter(r => r.score === bestScore).map(r => r.method);
  expect(leaders).toContain(expected);
}

// 1) Scrum
test('Scrum wins: small, iterative, internal, speed, continuous feedback', () => {
  expectTopMethod(
    {
      project_size: 'small',
      planning: 'iterative',
      sourcing: 'internal sourcing',
      goals: 'speed',
      customer_size: 'small',
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

// 2) SAFe
test('SAFe wins: large, iterative, mixed, predictable, milestone reviews', () => {
  expectTopMethod(
    {
      project_size: 'large',
      planning: 'iterative',
      sourcing: 'mixed internal/external',
      goals: 'predictable',
      customer_size: 'large',
      customer_communication: 'milestone reviews',
      payment_method: 'milestone payments',
      design: 'partial / iterative design',
      teams: 'cross-functional',
      development: 'incremental',
      integration_testing: 'continuous',
      closing: 'customer acceptance',
    },
    'SAFe'
  );
});

// 3) Hybrid (Iterative + Waterfall)
test('Hybrid wins: large, iterative + up-front mixed, both feedback & milestones', () => {
  expectTopMethod(
    {
      project_size: 'large',
      planning: 'iterative, up-front',
      sourcing: 'mixed internal/external',
      goals: 'speed, predictability',
      customer_size: 'large',
      customer_communication: 'continuous feedback loops, milestone reviews',
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

// 4) Waterfall
test('Waterfall wins: large, up-front, heavily outsourced, predictable, end phase', () => {
  expectTopMethod(
    {
      project_size: 'large',
      planning: 'up-front',
      sourcing: 'heavily outsourced',
      goals: 'predictable',
      customer_size: 'large',
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

// 5) Lean Six Sigma
test('Lean Six Sigma wins: continuous flow, internal, innovation, performance metrics', () => {
  expectTopMethod(
    {
      project_size: 'medium',
      planning: 'continuous flow',
      sourcing: 'internal',
      goals: 'innovation',
      customer_size: 'any',
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

// 6) Lean Continuous Delivery Model
test('Lean Continuous Delivery Model wins: continuous flow, automated pipeline, subscription', () => {
  expectTopMethod(
    {
      project_size: 'large',
      planning: 'continuous flow',
      sourcing: 'internal sourcing team',
      goals: 'innovation, optimization',
      customer_size: 'very large',
      customer_communication: 'performance metrics',
      payment_method: 'subscription, time & materials',
      design: 'modular, emergent design',
      teams: 'cross-functional teams',
      development: 'automated, incremental',
      integration_testing: 'continuous',
      closing: 'customer acceptance',
    },
    'Lean Continuous Delivery Model'
  );
});

// 7) Disciplined Agile
test('Disciplined Agile wins: enterprise scale, iterative+incremental, mixed team', () => {
  expectTopMethod(
    {
      project_size: 'enterprise',
      planning: 'iterative, incremental',
      sourcing: 'mixed internal/external team',
      goals: 'speed, predictability',
      customer_size: 'enterprise',
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

// 8) PRINCE2
test('PRINCE2 wins: stage-based, milestone payments, end-phase integration, external acceptance', () => {
  expectTopMethod(
    {
      project_size: 'large',
      planning: 'stage-based',
      sourcing: 'mixed',
      goals: 'predictable',
      customer_size: 'large',
      customer_communication: 'milestone reviews',
      payment_method: 'milestone payments',
      design: 'upfront design',
      teams: 'functional teams, problem-solving teams',
      development: 'linear, incremental',
      integration_testing: 'end phase',
      closing: '3rd party acceptance, customer acceptance',
    },
    'PRINCE2'
  );
});
