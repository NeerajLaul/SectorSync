import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Shield, 
  Zap,
  BarChart3,
  Users,
  Lightbulb,
  CheckCircle
} from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Brain,
    title: "Intelligent Scoring Algorithm",
    description: "Advanced AI engine analyzes 12 key factors with nuanced sensitivity weights and contextual rules.",
  },
  {
    icon: BarChart3,
    title: "8 Methodologies Evaluated",
    description: "Compare Scrum, SAFe, Waterfall, PRINCE2, Lean Six Sigma, Hybrid, Disciplined Agile, and Continuous Delivery.",
  },
  {
    icon: TrendingUp,
    title: "Detailed Score Breakdown",
    description: "See exactly how each factor contributes to every methodology's score with transparent calculations.",
  },
  {
    icon: Target,
    title: "Context-Aware Recommendations",
    description: "Gate rules and nudge algorithms ensure recommendations fit your specific organizational context.",
  },
  {
    icon: Shield,
    title: "Evidence-Based Approach",
    description: "Built on research-backed compatibility models and real-world implementation data.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive recommendations in seconds after completing the 12-question assessment.",
  },
  {
    icon: Lightbulb,
    title: "Factor Contribution Analysis",
    description: "Understand which aspects of your project drive each methodology recommendation.",
  },
  {
    icon: Users,
    title: "Team-Focused Insights",
    description: "Recommendations account for team structure, size, and collaboration patterns.",
  },
  {
    icon: CheckCircle,
    title: "100% Free Assessment",
    description: "No credit card required. Get professional methodology recommendations at no cost.",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
    
    // Add subtle 3D tilt effect
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = (e.clientY - centerY) / 30;
    const rotateY = (centerX - e.clientX) / 30;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    
    card.style.transform = '';
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="glass-card border-white/20 dark:border-white/10 glass-hover group cursor-spotlight">
        <CardHeader>
          <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="w-6 h-6 text-primary dark:text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">{feature.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            {feature.description}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl">
            Powerful Features for Precise Recommendations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intelligent assessment tool uses advanced algorithms and evidence-based scoring 
            to match you with the perfect project management methodology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
