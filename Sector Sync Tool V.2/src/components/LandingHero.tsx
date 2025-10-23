import { Button } from "./ui/button";
import { Play, Compass, Sparkles, Target } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LandingHeroProps {
  onStartAssessment: () => void;
  onWatchDemo: () => void;
}

export function LandingHero({ onStartAssessment, onWatchDemo }: LandingHeroProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="inline-flex items-center glass px-4 py-2 rounded-full border border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <Sparkles className="w-4 h-4 mr-2 text-primary dark:text-primary-foreground animate-glow" />
              <span className="text-sm">AI-Powered Methodology Matching</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl tracking-tight">
              Find Your Perfect
              <span className="text-primary"> Project Methodology</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop guessing which project management approach is right for your team. 
              Our intelligent assessment analyzes your unique context and recommends 
              the methodologies that will drive your success.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl" 
              onClick={onStartAssessment}
            >
              <Target className="w-5 h-5 mr-2" />
              Start Free Assessment
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 glass-hover border-white/20 dark:border-white/10" 
              onClick={onWatchDemo}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground flex-wrap gap-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Takes 3-5 minutes
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              100% Free
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Instant results
            </div>
          </div>
        </div>

        <div className="mt-16 relative">
          <div className="glass-card rounded-2xl p-8 transition-all duration-500 hover:scale-[1.01]">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600"
              alt="Team collaboration"
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
          
          <div className="absolute -bottom-6 -left-6 glass-strong rounded-xl shadow-2xl p-5 border border-white/20 dark:border-white/10 hidden lg:block transition-all duration-300 hover:scale-105 animate-float">
            <div className="flex items-center space-x-3">
              <Compass className="w-8 h-8 text-primary dark:text-primary-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Methodologies Covered</div>
                <div className="text-xl">8+</div>
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -right-6 glass-strong rounded-xl shadow-2xl p-5 border border-white/20 dark:border-white/10 hidden lg:block transition-all duration-300 hover:scale-105 animate-float" style={{ animationDelay: '1s' }}>
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-green-600 dark:text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                <div className="text-xl">98%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
