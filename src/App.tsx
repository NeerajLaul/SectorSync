import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ToolGuidePage } from './components/ToolGuidePage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionCard } from './components/QuestionCard';
import { ResultsCard } from './components/ResultsCard';
import { ProgressBar } from './components/ProgressBar';
import { scoreMethodologies, FACTOR_OPTIONS, type UserAnswers } from './utils/scoringEngine';

interface Option {
  id: string;
  text: string;
  icon: string;
  factorValue: string;
}

interface Question {
  id: number;
  question: string;
  factor: string;
  options: Option[];
}

interface Methodology {
  name: string;
  icon: string;
  description: string;
  bestFor: string[];
  keyPrinciples: string[];
}

interface MethodologyResult extends Methodology {
  score: number;
  key: string;
}

// Questions mapped to the 12 factors from the backend
const questions: Question[] = [
  {
    id: 1,
    question: "What is your project size?",
    factor: "project_size",
    options: [
      { id: 'q1-a', text: 'Small', icon: '📦', factorValue: 'Small' },
      { id: 'q1-b', text: 'Medium', icon: '📋', factorValue: 'Medium' },
      { id: 'q1-c', text: 'Large', icon: '🏢', factorValue: 'Large' },
    ],
  },
  {
    id: 2,
    question: "What is your planning approach?",
    factor: "planning",
    options: [
      { id: 'q2-a', text: 'Iterative - plan as we go', icon: '🔄', factorValue: 'Iterative' },
      { id: 'q2-b', text: 'Continuous Flow - minimal upfront planning', icon: '🌊', factorValue: 'Continuous Flow' },
      { id: 'q2-c', text: 'Up-front - comprehensive planning before execution', icon: '📋', factorValue: 'Up-front' },
    ],
  },
  {
    id: 3,
    question: "How is your project sourced?",
    factor: "sourcing",
    options: [
      { id: 'q3-a', text: 'Internal Sourcing - all in-house team', icon: '🏠', factorValue: 'Internal Sourcing' },
      { id: 'q3-b', text: 'Mixed Internal/External', icon: '🤝', factorValue: 'Mixed Internal/External' },
      { id: 'q3-c', text: 'Heavily Outsourced', icon: '🌐', factorValue: 'Heavily Outsourced' },
    ],
  },
  {
    id: 4,
    question: "What is your primary project goal?",
    factor: "goals",
    options: [
      { id: 'q4-a', text: 'Speed - get to market fast', icon: '🚀', factorValue: 'Speed' },
      { id: 'q4-b', text: 'Predictable - minimize risk and uncertainty', icon: '📊', factorValue: 'Predictable' },
      { id: 'q4-c', text: 'Innovation - explore new solutions', icon: '💡', factorValue: 'Innovation' },
    ],
  },
  {
    id: 5,
    question: "What is your customer size?",
    factor: "customer_size",
    options: [
      { id: 'q5-a', text: 'Small', icon: '👤', factorValue: 'Small' },
      { id: 'q5-b', text: 'Medium', icon: '👥', factorValue: 'Medium' },
      { id: 'q5-c', text: 'Large', icon: '🏢', factorValue: 'Large' },
    ],
  },
  {
    id: 6,
    question: "How do you communicate with customers?",
    factor: "customer_communication",
    options: [
      { id: 'q6-a', text: 'Continuous Feedback Loops', icon: '🔁', factorValue: 'Continuous Feedback Loops' },
      { id: 'q6-b', text: 'Milestone Reviews', icon: '🎯', factorValue: 'Milestone Reviews' },
      { id: 'q6-c', text: 'Performance Metrics', icon: '📈', factorValue: 'Performance Metrics' },
    ],
  },
  {
    id: 7,
    question: "What is your payment method?",
    factor: "payment_method",
    options: [
      { id: 'q7-a', text: 'Time & Materials', icon: '⏱️', factorValue: 'Time & Materials' },
      { id: 'q7-b', text: 'Milestone Payments', icon: '🎯', factorValue: 'Milestone Payments' },
      { id: 'q7-c', text: 'Firm Fixed Price', icon: '💰', factorValue: 'Firm Fixed Price' },
    ],
  },
  {
    id: 8,
    question: "What is your design approach?",
    factor: "design",
    options: [
      { id: 'q8-a', text: 'Emergent - design evolves', icon: '🌱', factorValue: 'Emergent' },
      { id: 'q8-b', text: 'Partial / Iterative Design', icon: '🔄', factorValue: 'Partial / Iterative Design' },
      { id: 'q8-c', text: 'Upfront/Complete Design', icon: '📐', factorValue: 'Upfront/Complete Design' },
    ],
  },
  {
    id: 9,
    question: "What is your team structure?",
    factor: "teams",
    options: [
      { id: 'q9-a', text: 'Cross-functional teams', icon: '🤝', factorValue: 'Cross-functional' },
      { id: 'q9-b', text: 'Specialist teams', icon: '🎯', factorValue: 'Specialist' },
      { id: 'q9-c', text: 'Structured Silo Teams', icon: '🏢', factorValue: 'Structured Silo Teams' },
    ],
  },
  {
    id: 10,
    question: "What is your development approach?",
    factor: "development",
    options: [
      { id: 'q10-a', text: 'Iterative - short cycles with feedback', icon: '🔁', factorValue: 'Iterative' },
      { id: 'q10-b', text: 'Incremental - build up features gradually', icon: '📈', factorValue: 'Incremental' },
      { id: 'q10-c', text: 'Linear - sequential phases', icon: '➡️', factorValue: 'Linear' },
    ],
  },
  {
    id: 11,
    question: "How do you approach integration and testing?",
    factor: "integration_testing",
    options: [
      { id: 'q11-a', text: 'Continuous integration and testing', icon: '🔄', factorValue: 'Continuous' },
      { id: 'q11-b', text: 'When possible throughout development', icon: '⚡', factorValue: 'When possible' },
      { id: 'q11-c', text: 'End Phase - testing at the end', icon: '🎯', factorValue: 'End Phase' },
    ],
  },
  {
    id: 12,
    question: "How do you close/accept projects?",
    factor: "closing",
    options: [
      { id: 'q12-a', text: 'Team Acceptance - internal approval', icon: '👥', factorValue: 'Team Acceptance' },
      { id: 'q12-b', text: 'Customer Acceptance', icon: '🤝', factorValue: 'Customer Acceptance' },
      { id: 'q12-c', text: '3rd Party Acceptance - formal external review', icon: '✅', factorValue: '3rd Party Acceptance' },
    ],
  },
];

const methodologies: { [key: string]: Methodology } = {
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
};

export default function App() {
  const [page, setPage] = useState<'home' | 'guide' | 'quiz'>('home');
  const [stage, setStage] = useState<'welcome' | 'quiz' | 'results'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [results, setResults] = useState<MethodologyResult[]>([]);

  const handleNavigate = (newPage: string) => {
    setPage(newPage as 'home' | 'guide' | 'quiz');
    if (newPage === 'quiz') {
      setStage('welcome');
    }
  };

  const handleStartQuiz = () => {
    setPage('quiz');
    setStage('quiz');
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleStart = () => {
    setStage('quiz');
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleOptionSelect = (option: Option) => {
    const currentFactor = questions[currentQuestion].factor;
    const newAnswers = { ...answers, [currentFactor]: option.factorValue };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results using scoring engine
      const scoringResult = scoreMethodologies(newAnswers);
      
      // Take top 3 and map to our methodology data
      const top3 = scoringResult.ranking.slice(0, 3).map(result => ({
        ...methodologies[result.method],
        score: result.score,
        key: result.method,
      }));
      
      setResults(top3);
      setStage('results');
    }
  };

  const handleRestart = () => {
    setStage('welcome');
    setCurrentQuestion(0);
    setAnswers({});
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={page} onNavigate={handleNavigate} />
      
      <div className="p-4 sm:p-8">
        <div className="max-w-5xl mx-auto py-8">
          <AnimatePresence mode="wait">
            {page === 'home' && (
              <HomePage
                key="home"
                onStartQuiz={handleStartQuiz}
                onViewGuide={() => setPage('guide')}
              />
            )}

            {page === 'guide' && (
              <ToolGuidePage key="guide" onStartQuiz={handleStartQuiz} />
            )}

            {page === 'quiz' && (
              <>
                {stage === 'welcome' && (
                  <WelcomeScreen key="welcome" onStart={handleStart} />
                )}

                {stage === 'quiz' && (
                  <div key="quiz">
                    <ProgressBar current={currentQuestion + 1} total={questions.length} />
                    <AnimatePresence mode="wait">
                      <QuestionCard
                        key={questions[currentQuestion].id}
                        question={questions[currentQuestion].question}
                        options={questions[currentQuestion].options}
                        onSelect={handleOptionSelect}
                      />
                    </AnimatePresence>
                  </div>
                )}

                {stage === 'results' && results.length > 0 && (
                  <ResultsCard
                    key="results"
                    results={results}
                    onRestart={handleRestart}
                  />
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
