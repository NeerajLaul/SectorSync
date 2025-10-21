import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Lightbulb, Target, Users, Zap } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const features = [
    { icon: <Lightbulb className="w-5 h-5" />, text: 'Find your ideal methodology' },
    { icon: <Target className="w-5 h-5" />, text: 'Match your team style' },
    { icon: <Users className="w-5 h-5" />, text: 'Optimize collaboration' },
    { icon: <Zap className="w-5 h-5" />, text: 'Get instant results' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        className="mb-8"
      >
        <div className="mb-6 inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F5A623] via-[#F8C545] to-[#2C4F5E] p-1">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <Target className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
        <h1 className="mb-4">Project Framework Finder</h1>
        <p className="text-muted-foreground">
          Discover the perfect project management approach for your team in just a few clicks
        </p>
      </motion.div>

      <Card className="p-8 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className="text-primary">{feature.icon}</div>
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button 
          onClick={onStart} 
          size="lg" 
          className="px-8 bg-gradient-to-r from-[#F5A623] to-[#F8C545] hover:from-[#E09615] hover:to-[#E6B637] text-white border-0"
        >
          Start Quiz
        </Button>
      </motion.div>
    </motion.div>
  );
}
