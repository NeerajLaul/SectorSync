import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { CheckCircle, ArrowRight, Lightbulb } from "lucide-react";

interface WelcomeProps {
  onStart: () => void;
}

export function Welcome({ onStart }: WelcomeProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 glass rounded-full mb-6 border border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-110 animate-float">
            <Lightbulb className="h-10 w-10 text-primary dark:text-primary-foreground" />
          </div>
          <h1 className="text-5xl mb-4">Project Methodology Advisor</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find the perfect project management methodology for your team and organization
          </p>
        </div>

        <Card className="glass-strong p-8 mb-8 shadow-2xl border-white/20 dark:border-white/10 transition-all duration-500 hover:scale-[1.01]">
          <h2 className="text-2xl mb-6">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center group">
              <div className="glass-subtle w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600 dark:text-blue-400 border border-white/20 dark:border-white/10 transition-all duration-300 group-hover:scale-110">
                1
              </div>
              <h3 className="mb-2">Answer Questions</h3>
              <p className="text-sm text-muted-foreground">
                12 questions about your project context and preferences
              </p>
            </div>
            
            <div className="text-center group">
              <div className="glass-subtle w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600 dark:text-purple-400 border border-white/20 dark:border-white/10 transition-all duration-300 group-hover:scale-110">
                2
              </div>
              <h3 className="mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Our scoring engine analyzes your responses
              </p>
            </div>
            
            <div className="text-center group">
              <div className="glass-subtle w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 dark:text-green-400 border border-white/20 dark:border-white/10 transition-all duration-300 group-hover:scale-110">
                3
              </div>
              <h3 className="mb-2">Get Results</h3>
              <p className="text-sm text-muted-foreground">
                Receive ranked methodology recommendations
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl mb-8 border border-white/20 dark:border-white/10">
            <h3 className="mb-4">Methodologies We Cover:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Scrum",
                "SAFe (Scaled Agile Framework)",
                "Hybrid Approaches",
                "Waterfall",
                "Lean Six Sigma",
                "PRINCE2",
                "Disciplined Agile",
                "Continuous Delivery"
              ].map((method) => (
                <div key={method} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                  <span className="text-sm">{method}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button onClick={onStart} size="lg" className="px-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Takes approximately 3-5 minutes
            </p>
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          This tool uses advanced scoring algorithms to match your project characteristics with the most suitable methodologies.
        </p>
      </div>
    </div>
  );
}
