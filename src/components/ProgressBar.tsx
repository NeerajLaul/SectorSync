import { motion } from 'motion/react';
import { Progress } from './ui/progress';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 99, 99);

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-muted-foreground">
          Question {current} of {total}
        </span>
        <span className="text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
