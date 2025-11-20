import { Card } from "../components/ui/card";
import { Target, Users, Brain, TrendingUp, Award, Rocket } from "lucide-react";
import { Button } from "../components/ui/button";

interface AboutPageProps {
  onStartAssessment: () => void;
}

export function AboutPage({ onStartAssessment }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl mb-4 text-foreground">About SectorSync</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering teams to choose the right project management methodology 
            through data-driven recommendations
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-900/50 border-2">
            <div className="flex items-start gap-6">
              <div className="bg-primary p-4 rounded-full flex-shrink-0">
                <Target className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-3xl mb-4 text-foreground">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  We believe that choosing the right project management methodology shouldn't be 
                  guesswork. Too many teams struggle with methodologies that don't fit their context, 
                  leading to frustration, inefficiency, and project failure.
                </p>
                <p className="text-lg text-muted-foreground">
                  SectorSync was created to solve this problem by providing intelligent, data-driven 
                  recommendations that account for your unique organizational context, team structure, 
                  and project characteristics.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* How We're Different */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8 text-center text-foreground">How SectorSync Is Different</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full w-fit mb-4">
                <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl mb-3 text-foreground">Evidence-Based Algorithm</h3>
              <p className="text-muted-foreground">
                Our scoring engine is built on research-backed sensitivity weights and rules, 
                not just simple questionnaires. We analyze 12 key factors with nuanced weighting.
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-full w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl mb-3 text-foreground">Contextual Intelligence</h3>
              <p className="text-muted-foreground">
                We don't just give you a single answer. Our system applies gate rules and nudge 
                algorithms to exclude poor fits and highlight exceptional matches for your context.
              </p>
            </Card>

            <Card className="p-6">
              <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit mb-4">
                <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl mb-3 text-foreground">Transparent Scoring</h3>
              <p className="text-muted-foreground">
                See exactly how each methodology was scored. We show you factor-by-factor 
                contributions so you understand the reasoning behind every recommendation.
              </p>
            </Card>
          </div>
        </section>

        {/* The Science */}
        <section className="mb-16">
          <Card className="p-8">
            <h2 className="text-3xl mb-6 text-foreground">The Science Behind Our Recommendations</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl mb-2 text-foreground">Multi-Factor Sensitivity Analysis</h3>
                <p className="text-muted-foreground">
                  Each methodology has unique sensitivity scores (-1 to +1) for different factors. 
                  For example, Scrum has high negative sensitivity to upfront planning (-0.5), 
                  while Waterfall has high positive sensitivity (+0.9). These weights reflect 
                  real-world compatibility.
                </p>
              </div>

              <div>
                <h3 className="text-xl mb-2 text-foreground">Gate Rules</h3>
                <p className="text-muted-foreground">
                  Our system applies logical gates to exclude methodologies that fundamentally 
                  conflict with your answers. For instance, if you need heavy upfront planning 
                  and formal closing, Scrum is automatically filtered out.
                </p>
              </div>

              <div>
                <h3 className="text-xl mb-2 text-foreground">Nudge Algorithms</h3>
                <p className="text-muted-foreground">
                  When certain patterns emerge in your answers, we apply "nudges" - score 
                  adjustments that boost methodologies particularly well-suited to those patterns. 
                  This captures synergies that simple linear scoring would miss.
                </p>
              </div>

              <div>
                <h3 className="text-xl mb-2 text-foreground">Version 3.0 Engine</h3>
                <p className="text-muted-foreground">
                  Our current scoring engine (v3.0) represents years of refinement, incorporating 
                  feedback from project managers across industries and continuous calibration against 
                  real-world implementation outcomes.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* Who It's For */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8 text-center text-foreground">Who It's For</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <Users className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-foreground">Project Managers</h3>
              <p className="text-muted-foreground">
                Whether you're starting a new project or reassessing your current approach, 
                get data-driven recommendations tailored to your specific context.
              </p>
            </Card>

            <Card className="p-6">
              <Rocket className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-foreground">Team Leaders</h3>
              <p className="text-muted-foreground">
                Find the methodology that best supports your team's working style, 
                constraints, and delivery goals.
              </p>
            </Card>

            <Card className="p-6">
              <Target className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-foreground">Consultants</h3>
              <p className="text-muted-foreground">
                Use our tool to guide client conversations and provide objective, 
                evidence-based recommendations for methodology selection.
              </p>
            </Card>

            <Card className="p-6">
              <Award className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-xl mb-3 text-foreground">Organizations</h3>
              <p className="text-muted-foreground">
                Standardize methodology selection across your portfolio with a consistent, 
                repeatable assessment process.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-purple-100/50 dark:from-primary/20 dark:to-purple-900/30">
            <h2 className="text-3xl mb-4 text-foreground">Ready to Find Your Perfect Methodology?</h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Take our free 5-minute assessment and get personalized recommendations
            </p>
            <Button onClick={onStartAssessment} size="lg" className="px-8">
              Start Free Assessment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
