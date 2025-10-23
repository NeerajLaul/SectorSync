export interface Question {
  id: string;
  question: string;
  description?: string;
  options: string[];
}

export const QUESTIONS: Question[] = [
  {
    id: "project_size",
    question: "What is your typical project size?",
    description: "Consider team size, budget, and scope",
    options: ["Small", "Medium", "Large"]
  },
  {
    id: "planning",
    question: "How do you prefer to approach planning?",
    description: "Think about how you define requirements and deliverables",
    options: ["Iterative", "Continuous Flow", "Up-front"]
  },
  {
    id: "sourcing",
    question: "What is your team sourcing model?",
    description: "How do you typically staff your projects?",
    options: ["Internal Sourcing", "Mixed Internal/External", "Heavily Outsourced"]
  },
  {
    id: "goals",
    question: "What is your primary project goal?",
    description: "Choose the most important outcome for your projects",
    options: ["Speed", "Predictable", "Innovation"]
  },
  {
    id: "customer_size",
    question: "What is your typical customer organization size?",
    description: "Consider the size of companies you work with",
    options: ["Small", "Medium", "Large"]
  },
  {
    id: "customer_communication",
    question: "How do you communicate with customers?",
    description: "Think about your typical customer interaction cadence",
    options: ["Continuous Feedback Loops", "Milestone Reviews", "Performance Metrics"]
  },
  {
    id: "payment_method",
    question: "What is your preferred payment model?",
    description: "How do you typically structure contracts?",
    options: ["Time & Materials", "Milestone Payments", "Firm Fixed Price"]
  },
  {
    id: "design",
    question: "How do you approach design?",
    description: "Think about when and how design happens",
    options: ["Emergent", "Partial / Iterative Design", "Upfront/Complete Design"]
  },
  {
    id: "teams",
    question: "What is your team structure?",
    description: "How are your teams organized?",
    options: ["Cross-functional", "Specialist", "Structured Silo Teams"]
  },
  {
    id: "development",
    question: "What is your development approach?",
    description: "How do you build and deliver features?",
    options: ["Iterative", "Incremental", "Linear"]
  },
  {
    id: "integration_testing",
    question: "When do you integrate and test?",
    description: "Think about your testing and integration cadence",
    options: ["Continuous", "When possible", "End Phase"]
  },
  {
    id: "closing",
    question: "How do you close projects?",
    description: "Who provides final approval?",
    options: ["Team Acceptance", "Customer Acceptance", "3rd Party Acceptance"]
  }
];
