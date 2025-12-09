import { Card } from "../components/ui/card";
import { CheckCircle, ArrowRight, Lightbulb, BarChart3, FileText, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { useRef } from "react";
import { AssessmentDemo } from "../components/AssessmentDemo";

interface GuidePageProps {
  onStartAssessment: () => void;
}

function InteractiveCard({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
    >
      <Card className={className}>
        {children}
      </Card>
    </div>
  );
}

export function GuidePage({ onStartAssessment }: GuidePageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30"></div>
      
      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      
      <div className="container mx-auto max-w-6xl px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl mb-4">Tool Guide</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know to get the most out of your methodology assessment
          </p>
        </div>

        {/* Demo Video Section */}
        <section className="mb-16">
          <Card className="glass-card p-8 border-white/20 dark:border-white/10">
            <h2 className="text-3xl mb-6 text-center">Watch How It Works</h2>
            <p className="text-center text-muted-foreground mb-6 max-w-2xl mx-auto">
              Interactive demo of the 10-question assessment and sample results
            </p>
            {/* Embedded Interactive Demo */}
            <AssessmentDemo onStartRealAssessment={onStartAssessment} />
          </Card>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <InteractiveCard className="glass-card p-6 border-white/20 dark:border-white/10 glass-hover group">
              <div className="glass-subtle w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 border border-white/20 dark:border-white/10 transition-all duration-300 group-hover:scale-110">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl mb-3">1. Answer Questions</h3>
              <p className="text-muted-foreground">
                Complete 10 carefully crafted questions about your project context, team structure, 
                planning approach, and business goals. Each question helps us understand your unique needs.
              </p>
            </InteractiveCard>

            <InteractiveCard className="glass-card p-6 border-white/20 dark:border-white/10 glass-hover group">
              <div className="glass-subtle w-12 h-12 rounded-full flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 border border-white/20 dark:border-white/10 transition-all duration-300 group-hover:scale-110">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl mb-3">2. Algorithmic Analysis</h3>
              <p className="text-muted-foreground">
                Our advanced fuzzy matching engine analyzes your responses by comparing them against 
                natural language profiles for each methodology to calculate compatibility scores.
              </p>
            </InteractiveCard>

            <InteractiveCard className="glass-card p-6 border-white/20 dark:border-white/10 glass-hover group">
              <div className="glass-subtle w-12 h-12 rounded-full flex items-center justify-center mb-4 text-green-600 dark:text-green-400 border border-white/20 dark:border-white/10 transition-all duration-300 group-hover:scale-110">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h3 className="text-xl mb-3">3. Get Recommendations</h3>
              <p className="text-muted-foreground">
                Receive a ranked list of methodologies with detailed scoring breakdowns, 
                factor contributions, and actionable insights to guide your implementation.
              </p>
            </InteractiveCard>
          </div>
        </section>

        {/* Question Categories */}
        <section className="mb-16">
          <Card className="p-8">
            <h2 className="text-3xl mb-6">What We Ask About</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Project & Team Context
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Project size and scope</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Team structure and organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Resource sourcing model</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Customer organization size</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Process & Delivery
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Planning and design approach</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Development methodology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Testing and integration cadence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Customer communication patterns</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* Methodologies Covered */}
        <section className="mb-16">
          <Card className="p-8">
            <h2 className="text-3xl mb-6">Methodologies We Evaluate</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Scrum", description: "Iterative agile framework" },
                { name: "SAFe", description: "Scaled agile for enterprises" },
                { name: "Waterfall", description: "Sequential development" },
                { name: "PRINCE2", description: "Structured governance" },
                { name: "Lean Six Sigma", description: "Process optimization" },
                { name: "Hybrid", description: "Mixed approach flexibility" },
                { name: "Disciplined Agile", description: "Context-driven toolkit" },
                { name: "Continuous Delivery", description: "Automated deployment" }
              ].map((method) => (
                <div key={method.name} className="p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <h4 className="mb-1">{method.name}</h4>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Tips */}
        <section className="mb-16">
          <Card className="glass-card p-8 border-white/20 dark:border-white/10">
            <div className="flex items-start gap-4">
              <Lightbulb className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <div>
                <h2 className="text-2xl mb-4">Tips for Best Results</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Answer based on your <strong>typical</strong> or <strong>most common</strong> project scenarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Be honest about your current state, not your aspirational state</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Consider your organization's constraints and culture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Review the detailed analysis to understand why each methodology was scored</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button onClick={onStartAssessment} size="lg" className="px-8 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            Start Your Assessment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
