import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ArrowRight, CheckCircle2, Lightbulb, Target, Users, Zap } from 'lucide-react';

interface HomePageProps {
  onStartQuiz: () => void;
  onViewGuide: () => void;
}

export function HomePage({ onStartQuiz, onViewGuide }: HomePageProps) {
  const features = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Smart Matching',
      description: 'Answer simple questions to find your perfect methodology',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Tailored Results',
      description: 'Get personalized recommendations based on your team and project',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team-Focused',
      description: 'Considers team size, structure, and working preferences',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Insights',
      description: 'Receive detailed methodology guidance in seconds',
    },
  ];

  const methodologies = [
    { name: 'Scrum', icon: '🏉', color: 'bg-[#E8F1F5] dark:bg-[#2C4F5E]' },
    { name: 'SAFe', icon: '🌐', color: 'bg-[#FFF5E6] dark:bg-[#8B4513]' },
    { name: 'Hybrid', icon: '⚖️', color: 'bg-[#E8F1F5] dark:bg-[#2C4F5E]' },
    { name: 'Waterfall', icon: '💧', color: 'bg-[#E8F1F5] dark:bg-[#2C4F5E]' },
    { name: 'Lean Six Sigma', icon: '📊', color: 'bg-[#FFF5E6] dark:bg-[#F5A623]' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-6 inline-block"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#F5A623] via-[#F8C545] to-[#2C4F5E] p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <Target className="w-16 h-16 text-primary" />
            </div>
          </div>
        </motion.div>
        <h1 className="mb-6">Find Your Perfect Project Framework</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Stop guessing which project management approach is right for you. Our intelligent quiz analyzes your team, project requirements, and goals to recommend the ideal framework.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={onStartQuiz} className="gap-2 bg-gradient-to-r from-[#F5A623] to-[#F8C545] hover:from-[#E09615] hover:to-[#E6B637] text-white border-0">
            Take the Quiz
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={onViewGuide} className="border-primary/30 hover:bg-secondary">
            How It Works
          </Button>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-center mb-8">Why Use Our Tool?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                <div className="flex gap-4">
                  <div className="text-primary flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Methodologies Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-center mb-4">Frameworks We Cover</h2>
        <p className="text-center text-muted-foreground mb-8">
          Our quiz evaluates 5 proven project management frameworks
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {methodologies.map((methodology, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.05 }}
            >
              <Card className={`p-4 text-center ${methodology.color} border-0`}>
                <div className="text-4xl mb-2">{methodology.icon}</div>
                <p>{methodology.name}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <Card className="p-8 bg-gradient-to-br from-[#2C4F5E] to-[#1A3A47] text-white border-0 shadow-xl">
          <h2 className="mb-4 text-white">Ready to Get Started?</h2>
          <p className="mb-6 opacity-90">
            Take our comprehensive 12-question quiz and discover which framework will help your team succeed
          </p>
          <Button 
            size="lg" 
            onClick={onStartQuiz} 
            className="gap-2 bg-gradient-to-r from-[#F5A623] to-[#F8C545] hover:from-[#E09615] hover:to-[#E6B637] text-white border-0"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
