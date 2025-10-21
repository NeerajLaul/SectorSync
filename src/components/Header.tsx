import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Home, BookOpen, Target } from 'lucide-react';
import logo from 'figma:asset/7109126d49ba4b4ede26f7b6b7f7b480de990d92.png';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-border bg-white dark:bg-[#1A2A33] sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="SectorSync" className="h-10" />
          </button>
          
          <nav className="flex gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('home')}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant={currentPage === 'guide' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('guide')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              How It Works
            </Button>
            <Button
              variant={currentPage === 'quiz' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onNavigate('quiz')}
            >
              <Target className="w-4 h-4 mr-2" />
              Take Quiz
            </Button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
