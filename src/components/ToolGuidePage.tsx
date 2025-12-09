// 1. Change import from 'motion/react' to 'framer-motion' for stability
import { motion } from 'framer-motion'; 
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight, CheckCircle2, HelpCircle, Lightbulb, Target } from 'lucide-react';

interface ToolGuidePageProps {
  onStartQuiz: () => void;
}

export function ToolGuidePage({ onStartQuiz }: ToolGuidePageProps) {
  const steps = [
    {
      number: 1,
      title: 'Answer 12 Comprehensive Questions',
      description: 'We ask about your project size, planning approach, sourcing, goals, customer factors, team structure, and more.',
      icon: <HelpCircle className="w-6 h-6" />,
      details: [
        'Clear, straightforward questions',
        'Takes only 3-5 minutes',
        'Each question has 3 clear options',
      ],
    },
    {
      number: 2,
      title: 'We Analyze Your Answers',
      description: 'Our sophisticated scoring engine evaluates your responses using sensitivity analysis, gates, and nudges to find the best fit.',
      icon: <Target className="w-6 h-6" />,
      details: [
        'Advanced sensitivity-based scoring',
        'Rule-based exclusions and boosts',
        'Normalized scoring for fairness',
      ],
    },
    {
      number: 3,
      title: 'Get Your Perfect Match',
      description: 'Receive a detailed recommendation with key principles, best use cases, and implementation guidance.',
      icon: <Lightbulb className="w-6 h-6" />,
      details: [
        'Comprehensive methodology overview',
        'Specific use cases and benefits',
        'Actionable principles to follow',
      ],
    },
  ];

  const methodologyDetails = [
    {
      name: 'Scrum',
      description: 'Iterative agile framework using short sprints and feedback loops.',
      bestFor: 'Small, adaptive teams',
    },
    {
      name: 'SAFe',
      description: 'Scaled agile system coordinating multiple enterprise teams.',
      bestFor: 'Large organizations',
    },
    {
      name: 'Disciplined Agile',
      description: 'Toolkit blending agile methods with context-driven flexibility.',
      bestFor: 'Adaptive mixed teams',
    },
    {
      name: 'Hybrid (Iterative Waterfall)',
      description: 'Combines structured planning with iterative execution.',
      bestFor: 'Medium to large projects',
    },
    {
      name: 'Continuous Delivery Model',
      description: 'Focuses on frequent, automated software releases.',
      bestFor: 'DevOps and tech projects',
    },
    {
      name: 'Six Sigma',
      description: 'Data-driven framework for reducing defects and variation.',
      bestFor: 'Quality-focused industries',
    },
    {
      name: 'Waterfall',
      description: 'Sequential model with clear, phase-based progression.',
      bestFor: 'Fixed, well-defined projects',
    },
    {
      name: 'PRINCE2',
      description: 'Governance-based, stage-driven project framework.',
      bestFor: 'Formal or regulated environments',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <div className="text-6xl mb-6">📖</div>
        <h1 className="mb-4">How It Works</h1>
        <p className="text-muted-foreground">
          Discover the perfect project management methodology for your team in three simple steps
        </p>
      </motion.div>

      {/* Steps Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                    {step.number}
                  </div>
                  <div className="text-primary">{step.icon}</div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <div className="space-y-2">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Questions Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-center mb-4">What We Ask</h2>
        <p className="text-center text-muted-foreground mb-8">
          Our quiz covers these key areas to find your perfect match
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            '📦 Project Size',
            '📋 Planning Approach',
            '🤝 Sourcing',
            '🎯 Primary Goals',
            '👥 Customer Size',
            '💬 Customer Communication',
            '💰 Payment Method',
            '📐 Design Approach',
            '👥 Team Structure',
            '🔄 Development Approach',
            '✅ Integration & Testing',
            '🤝 Project Closing',
          ].map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <Card className="p-4 text-center bg-secondary/50">
                <p>{topic}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Methodologies Reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-center mb-4">Frameworks Evaluated</h2>
        <p className="text-center text-muted-foreground mb-8">
          We compare your answers against these 8 proven frameworks using advanced scoring
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {methodologyDetails.map((methodology, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4>{methodology.name}</h4>
                  <Badge variant="secondary">{methodology.bestFor}</Badge>
                </div>
                <p className="text-muted-foreground">{methodology.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-[#2C4F5E] to-[#1A3A47] text-white border-0 shadow-xl">
          <h2 className="mb-4 text-white">Ready to Find Your Match?</h2>
          <p className="mb-6 opacity-90">
            Now that you know how it works, take the quiz and get your personalized recommendation
          </p>
          <Button 
            size="lg" 
            onClick={onStartQuiz} 
            className="gap-2 bg-gradient-to-r from-[#F5A623] to-[#F8C545] hover:from-[#E09615] hover:to-[#E6B637] text-white border-0"
          >
            Take the Quiz Now
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
