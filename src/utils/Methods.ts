export const methodologies = {
      "Scrum": {
    name: 'Scrum',
    icon: '🏉',
    description: 'Scrum is a lightweight agile framework that organizes work into time-boxed sprints with defined roles, ceremonies, and artifacts. Ideal for small to medium teams that want iterative development with regular deliveries and continuous feedback.',
    bestFor: ['Small teams (5-9 people)', 'Evolving requirements', 'Fast feedback cycles', 'Internal projects'],
    keyPrinciples: [
      'Work in fixed-length sprints (1-4 weeks)',
      'Daily stand-ups for team synchronization',
      'Sprint planning, review, and retrospectives',
      'Self-organizing cross-functional teams',
    ],
  },
  "SAFe": {
    name: 'SAFe',
    icon: '🌐',
    description: 'Scaled Agile Framework (SAFe) is an enterprise-scale agile framework that coordinates multiple teams through Program Increments and alignment ceremonies. Perfect for large organizations implementing agile at scale with structured coordination.',
    bestFor: ['Large organizations (50+ people)', 'Multiple coordinated teams', 'Enterprise portfolio management', 'Outsourced or mixed teams'],
    keyPrinciples: [
      'Organize around value streams',
      'Program Increments (PI) for alignment',
      'Continuous delivery pipeline',
      'Lean-Agile leadership at all levels',
    ],
  },
  "Hybrid": {
    name: 'Hybrid',
    icon: '⚖️',
    description: 'Hybrid combines elements from multiple methodologies to fit your unique context. Balances upfront planning with iterative execution, offering flexibility for medium to large projects with mixed stakeholder needs.',
    bestFor: ['Medium to large projects', 'Mixed internal/external teams', 'Milestone-based delivery', 'Balanced documentation needs'],
    keyPrinciples: [
      'Combine best practices from multiple methods',
      'Tailor to project and organizational context',
      'Balance structure with flexibility',
      'Incremental delivery with gates',
    ],
  },
  "Waterfall": {
    name: 'Waterfall',
    icon: '💧',
    description: 'Waterfall is a linear, sequential approach where each phase must be completed before the next begins. Best for projects with well-defined, stable requirements, heavy outsourcing, and strong governance needs.',
    bestFor: ['Fixed scope projects', 'Heavily outsourced work', 'Regulated industries', 'Comprehensive documentation needs'],
    keyPrinciples: [
      'Sequential phases with clear gates',
      'Comprehensive upfront planning and design',
      'Extensive documentation at each phase',
      'Formal change control processes',
    ],
  },
  "Lean Six Sigma": {
    name: 'Lean Six Sigma',
    icon: '📊',
    description: 'Lean Six Sigma combines Lean manufacturing principles with Six Sigma quality methodologies. Focuses on eliminating waste, reducing variation, and driving continuous improvement through data-driven analysis.',
    bestFor: ['Quality improvement initiatives', 'Process optimization', 'Performance metrics focus', 'Continuous improvement culture'],
    keyPrinciples: [
      'Define, Measure, Analyze, Improve, Control (DMAIC)',
      'Data-driven decision making',
      'Eliminate waste and reduce variation',
      'Focus on customer value and satisfaction',
    ],
  },
  "PRINCE2": {
    name: 'PRINCE2',
    icon: '👑',
    description: 'PRINCE2 (Projects IN Controlled Environments) is a process-based project management method that emphasizes governance, defined roles, and stage-based delivery. It’s best suited for projects requiring formal oversight, documentation, and stakeholder control within structured environments.',
    bestFor: [
      'Government and public sector projects',
      'Large organizations with defined hierarchies',
      'Projects requiring strict compliance and documentation',
      'Formal stage-based reviews and governance'
    ],
    keyPrinciples: [
      'Defined roles and responsibilities for all participants',
      'Stage-based planning with controlled transitions',
      'Focus on business justification throughout the project',
      'Manage by exception — clear thresholds for authority',
      'Regular reporting and documentation for accountability'
    ],
  },

}