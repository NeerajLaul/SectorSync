import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle2, RotateCcw, Award, Medal, TrendingUp, Copy } from 'lucide-react';
import { methodologies } from '../utils/Methods';

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

interface ResultsCardProps {
  results: MethodologyResult[];
  onRestart: () => void;
  submissionId?: string;
}

export function ResultsCard({ results, onRestart, submissionId }: ResultsCardProps) {
  const [first, second, third] = results;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Award className="w-5 h-5" />;
      case 2:
        return <Medal className="w-5 h-5" />;
      case 3:
        return <TrendingUp className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-[#F5A623] to-[#F8C545]';
      case 2:
        return 'from-[#9BB5C3] to-[#5A7A8A]';
      case 3:
        return 'from-[#B8856A] to-[#8B4513]';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto space-y-6"
    >
      {/* Top Result - Featured */}
      <Card className="p-8 border-2 border-[#F5A623]/30 bg-gradient-to-br from-[#FFF5E6] to-white dark:from-[#2C4F5E] dark:to-[#1A2A33]">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-4 inline-block relative"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F5A623] via-[#F8C545] to-[#2C4F5E] p-1">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-5xl">
                {first.icon}
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-[#F5A623] to-[#F8C545] flex items-center justify-center text-white shadow-lg">
              <Award className="w-5 h-5" />
            </div>
          </motion.div>
          <Badge variant="secondary" className="mb-2 bg-gradient-to-r from-[#F5A623] to-[#F8C545] text-white border-0">
            Best Match • {first.score} points
          </Badge>
          <h1 className="mb-2">{first.name}</h1>
          <p className="text-muted-foreground">{first.description}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#F5A623]" />
              Best For
            </h3>
            <div className="flex flex-wrap gap-2">
              {first.bestFor.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Badge variant="secondary">{item}</Badge>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3">Key Principles</h3>
            <ul className="space-y-2">
              {first.keyPrinciples.map((principle, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-[#F5A623] mt-1">•</span>
                  <span>{principle}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Other Top Matches */}
      <div>
        <h2 className="mb-4 text-center text-muted-foreground">Other Strong Matches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[second, third].map((methodology, index) => {
            const rank = index + 2;
            return (
              <motion.div
                key={methodology.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRankColor(rank)} p-0.5`}>
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-3xl">
                          {methodology.icon}
                        </div>
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br ${getRankColor(rank)} flex items-center justify-center text-white shadow`}>
                        {getRankIcon(rank)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3>{methodology.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {methodology.score} pts
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{methodology.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="mb-2 text-muted-foreground">Best for:</p>
                      <div className="flex flex-wrap gap-1">
                        {methodology.bestFor.slice(0, 3).map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <Button
          onClick={onRestart}
          className="bg-gradient-to-r from-[#F5A623] to-[#F8C545] hover:from-[#E09615] hover:to-[#E6B637] text-white border-0"
          size="lg"
        >
          <RotateCcw className="mr-2 w-4 h-4" />
          Take Quiz Again
        </Button>
        {submissionId && (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
            <span className="font-medium">Your response ID:</span>
            <div className="flex items-center bg-muted px-2 py-1 rounded-md">
              <code className="text-xs">{submissionId}</code>
              <button
                onClick={() => navigator.clipboard.writeText(submissionId)}
                className="ml-2 text-[#F5A623] hover:text-[#E09615]"
                title="Copy ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
