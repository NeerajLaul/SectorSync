import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface Option {
  id: string;
  text: string;
  icon: string;
  scores: { [key: string]: number };
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  onSelect: (option: Option) => void;
}

export function QuestionCard({ question, options, onSelect }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <h2 className="mb-10 text-center">{question}</h2>
      <div className="grid grid-cols-1 gap-5">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card
              className="p-8 cursor-pointer hover:border-[#F5A623] hover:shadow-lg hover:shadow-[#F5A623]/20 transition-all duration-300 group hover:bg-accent/50"
              onClick={() => onSelect(option)}
            >
              <div className="flex items-center gap-6">
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <p className="text-lg">{option.text}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
