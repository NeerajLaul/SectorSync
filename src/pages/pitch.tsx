import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Factory,
  BarChart3,
  Target,
  Globe,
  CheckCircle2,
  TrendingUp,
  Building2,
  Activity,
  ArrowRight,
  Play
} from "lucide-react";
import { ScoringResult } from "../utils/scoringEngine";

/* ---- Video Mapping ---- */
const METHOD_VIDEOS: Record<string, string> = {
  Scrum: "pcsLLgUb7_A",
  SAFe: "aW2m-BtCJyE",
  "Disciplined Agile": "Giu5wIdCaLI",
  Agile: "Z9QbYZh1YXY",
  Hybrid: "bLZ9MNwV2vE",
  "Lean Continuous Delivery": "tQMrrNo16jo",
  "Lean Six Sigma": "wfsRAZUnonI",
  Waterfall: "W4lE6ozdjls",
  PRINCE2: "bsIvbr0we8w",
};

/* ==================================================================================
   BENCHMARK DATA
   ================================================================================== */

// The 6 fixed pillars
const PILLARS = ["Flow", "Quality", "Predictability", "Value", "Customer", "Waste"];

// Scores (0-100) for each framework
const FRAMEWORK_PROFILES: Record<string, Record<string, number>> = {
  Scrum: { Flow: 85, Quality: 70, Predictability: 75, Value: 80, Customer: 90, Waste: 60 },
  SAFe: { Flow: 65, Quality: 85, Predictability: 90, Value: 70, Customer: 60, Waste: 50 },
  Waterfall: { Flow: 40, Quality: 80, Predictability: 95, Value: 50, Customer: 40, Waste: 30 },
  PRINCE2: { Flow: 35, Quality: 85, Predictability: 95, Value: 50, Customer: 40, Waste: 40 },
  "Lean Six Sigma": { Flow: 60, Quality: 95, Predictability: 85, Value: 60, Customer: 50, Waste: 95 },
  "Disciplined Agile": { Flow: 80, Quality: 75, Predictability: 70, Value: 85, Customer: 80, Waste: 70 },
  Hybrid: { Flow: 70, Quality: 75, Predictability: 80, Value: 75, Customer: 70, Waste: 60 },
  "Lean Continuous Delivery": { Flow: 95, Quality: 80, Predictability: 70, Value: 90, Customer: 85, Waste: 80 },
};

const INDUSTRY_AVERAGE: Record<string, number> = {
  Flow: 60, Quality: 65, Predictability: 70, Value: 60, Customer: 65, Waste: 50,
};

const EXEMPLAR_DATA: Record<string, { companies: string[]; metrics: string[] }> = {
  Scrum: {
    companies: ["Spotify", "Google", "Netflix", "Salesforce"],
    metrics: ["Sprint Velocity", "Cycle Time", "Team Happiness"],
  },
  SAFe: {
    companies: ["FedEx", "Chevron", "American Express", "Lockheed Martin"],
    metrics: ["Program Predictability", "Feature Cycle Time", "Defect Density"],
  },
  "Disciplined Agile": {
    companies: ["Panera Bread", "Franklin Templeton", "Barclays", "OpenText"],
    metrics: ["Time to Market", "Stakeholder Satisfaction", "Quality of Service"],
  },
  Hybrid: {
    companies: ["IBM", "NASA (JPL)", "Honeywell", "General Motors"],
    metrics: ["Milestone Hit Rate", "Requirement Stability", "Change Frequency"],
  },
  Waterfall: {
    companies: ["Toyota (Traditional)", "Construction Firms", "Govt. Defense Projects"],
    metrics: ["Budget Variance", "Schedule Performance Index (SPI)", "Requirements Coverage"],
  },
  PRINCE2: {
    companies: ["UK Government", "United Nations", "Siemens", "Vodafone"],
    metrics: ["Business Case Validity", "Stage Boundary Checks", "Risk Exposure"],
  },
  "Lean Six Sigma": {
    companies: ["General Electric", "Motorola", "Amazon (Ops)", "3M"],
    metrics: ["Defects Per Million (DPMO)", "Process Cycle Efficiency", "Cost of Poor Quality"],
  },
  "Lean Continuous Delivery": {
    companies: ["Etsy", "Amazon", "Facebook", "Tesla"],
    metrics: ["Deployment Frequency", "Mean Time to Recovery (MTTR)", "Change Failure Rate"],
  },
};

/* ==================================================================================
   COMPONENT
   ================================================================================== */

interface PitchPageProps {
  results: ScoringResult;
  onExit: () => void;
}

export function PitchPage({ results, onExit }: PitchPageProps) {
  const ranking = results.ranking;
  const top = ranking[0];
  const [idx, setIdx] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [idx]);

  const total = 5;

  const next = () => setIdx((i) => Math.min(total - 1, i + 1));
  const prev = () => setIdx((i) => Math.max(0, i - 1));

  // --- YouTube Embed Helper ---
  const VideoSlide = () => {
    const vidId = METHOD_VIDEOS[top.method];
    if (!vidId) return (
      <div className="aspect-video w-full rounded-xl bg-muted flex items-center justify-center border border-white/10">
        <div className="text-center">
          <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
          <span className="text-muted-foreground">Video unavailable</span>
        </div>
      </div>
    );
    return (
      <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border border-white/10">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${vidId}?rel=0&modestbranding=1&autoplay=1&mute=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  // --- Prepare Data (Safe Lookups) ---
  const frameworkData = useMemo(() => {
    // 1. Find profile by matching keys (case-insensitive)
    const matchKey = Object.keys(FRAMEWORK_PROFILES).find(
      k => k.toLowerCase() === top.method.toLowerCase()
    ) || "Hybrid";

    // 2. Get profile and context data
    const profile = FRAMEWORK_PROFILES[matchKey];
    const context = EXEMPLAR_DATA[matchKey] || EXEMPLAR_DATA["Hybrid"];

    // 3. Map pillars for the chart/bars
    const benchmarkStats = PILLARS.map((pillar) => {
      const baseScore = profile[pillar] || 50;
      const industryScore = INDUSTRY_AVERAGE[pillar] || 50;

      // Calculate weighted score
      const userValue = Math.min(100, Math.round(baseScore * (0.8 + 0.2 * top.score)));

      return {
        subject: pillar,
        User: userValue,
        Industry: industryScore,
      };
    });

    return { benchmarkStats, context };
  }, [top.method, top.score]);

  /* ---------------- Slides ---------------- */

  const slides = [
    // 1. COVER
    <div key="slide1" className="flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in duration-500">
      <div className="p-8 bg-primary/10 rounded-full border border-primary/20">
        <Factory className="h-24 w-24 text-primary" />
      </div>
      <div className="space-y-6">
        <Badge variant="outline" className="px-4 py-1 text-base uppercase tracking-widest border-primary/30">
          Executive Report
        </Badge>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter">
          Strategic<br />Alignment
        </h1>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
          Methodology assessment based on your organizational profile.
        </p>
      </div>
      <Button size="lg" onClick={next} className="rounded-full px-12 py-8 text-xl mt-8 shadow-2xl hover:scale-105 transition-transform">
        Begin <ChevronRight className="ml-3 h-6 w-6" />
      </Button>
    </div>,

    // 2. THE REVEAL
    <div key="slide2" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full px-4 animate-in slide-in-from-right duration-500">
      <div className="space-y-10">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <span className="text-lg font-bold uppercase tracking-widest text-muted-foreground">Top Recommendation</span>
          </div>
          <h2 className="text-7xl font-extrabold text-primary mb-8 leading-tight">{top.method}</h2>
          <p className="text-3xl text-muted-foreground font-light leading-relaxed">
            Optimal fit for your organization, balancing innovation needs with required control structures.
          </p>
        </div>

        <div className="flex gap-12 border-t border-border/50 pt-8">
          <div>
            <div className="text-sm text-muted-foreground uppercase font-bold mb-2 tracking-wider">Match Score</div>
            <div className="text-6xl font-mono font-bold text-foreground">{(top.score * 100).toFixed(0)}%</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground uppercase font-bold mb-2 tracking-wider">Confidence</div>
            <div className="text-6xl font-mono font-bold text-green-500">High</div>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute -inset-1 bg-gradient-to-tr from-primary/40 to-purple-500/40 rounded-2xl blur-3xl opacity-40"></div>
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-background">
          <VideoSlide />
        </div>
      </div>
    </div>,

    // 3. BENCHMARK (DATA BARS - NO RADAR)
    <div key="slide3" className="flex flex-col h-full animate-in slide-in-from-right duration-500">
      <div className="mb-8 border-b border-border/50 pb-6">
        <h2 className="text-5xl font-bold flex items-center gap-4">
          <BarChart3 className="h-12 w-12 text-primary" />
          Capability Analysis
        </h2>
        <p className="text-2xl text-muted-foreground mt-2 font-light">
          Your projected capabilities vs. Industry Average.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 h-full">
        <div className="space-y-8">
          {frameworkData.benchmarkStats.map((item, i) => (
            <div key={item.subject} className="space-y-2">
              <div className="flex justify-between text-lg font-medium">
                <span>{item.subject}</span>
                <span className="text-primary">{item.User}%</span>
              </div>
              <div className="relative pt-1">
                {/* Industry Marker */}
                <div
                  className="absolute top-0 w-1 h-4 bg-muted-foreground/50 z-10 -mt-1"
                  style={{ left: `${item.Industry}%` }}
                  title={`Industry Avg: ${item.Industry}%`}
                />
                <Progress value={item.User} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span className="pl-4">Industry Avg: {item.Industry}%</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Insights Panel */}
        <div className="space-y-8">
          <Card className="p-8 bg-primary/5 border-primary/10 shadow-sm">
            <h4 className="font-bold text-2xl flex items-center gap-3 mb-4 text-primary">
              <Target className="h-8 w-8" /> Key Strength
            </h4>
            <p className="text-xl text-muted-foreground leading-relaxed">
              This framework demonstrates exceptional performance in <strong>Predictability</strong> and <strong>Quality Control</strong>, ensuring stable delivery cycles.
            </p>
          </Card>

          <Card className="p-8 shadow-sm">
            <h4 className="font-bold text-2xl flex items-center gap-3 mb-4 text-green-500">
              <TrendingUp className="h-8 w-8" /> Performance Lift
            </h4>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Adoption aligns with a projected <strong>15-20% reduction</strong> in process waste compared to the industry baseline.
            </p>
          </Card>
        </div>
      </div>
    </div>,

    // 4. REAL WORLD CONTEXT (Clean List)
    <div key="slide4" className="flex flex-col h-full animate-in slide-in-from-right duration-500">
      <div className="mb-12 border-b border-border/50 pb-6">
        <h2 className="text-5xl font-bold flex items-center gap-4">
          <Globe className="h-12 w-12 text-blue-500" />
          In the Real World
        </h2>
        <p className="text-2xl text-muted-foreground mt-2 font-light">
          Industry leaders utilizing <strong>{top.method}</strong> and success metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 h-full">

        {/* Companies List */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold">Adopted By</h3>
          </div>
          <ul className="space-y-6">
            {frameworkData.context.companies.map((company, i) => (
              <li key={i} className="flex items-center gap-4 text-2xl font-light border-b border-border/30 pb-4">
                <CheckCircle2 className="h-6 w-6 text-blue-500" />
                {company}
              </li>
            ))}
          </ul>
        </div>

        {/* Metrics List */}
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold">Success Metrics</h3>
          </div>
          <ul className="space-y-6">
            {frameworkData.context.metrics.map((metric, i) => (
              <li key={i} className="flex items-center gap-4 text-2xl font-light border-b border-border/30 pb-4">
                <ArrowRight className="h-6 w-6 text-purple-500" />
                {metric}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,

    // 5. CLOSING
    <div key="slide5" className="flex flex-col items-center justify-center text-center space-y-12 animate-in zoom-in duration-500">
      <div className="p-8 bg-green-500/10 rounded-full border border-green-500/20">
        <CheckCircle2 className="h-24 w-24 text-green-500" />
      </div>
      <div className="space-y-6">
        <h2 className="text-6xl font-bold">Recommended Path Forward</h2>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
          Based on this assessment, we recommend initiating a <strong>Pilot Phase</strong> using {top.method} on a single value stream before broader rollout.
        </p>
      </div>

      <div className="flex gap-8 w-full max-w-xl justify-center pt-8">
        <Button size="lg" variant="outline" onClick={onExit} className="text-xl h-16 px-10 border-2">
          Back to Dashboard
        </Button>
        <Button size="lg" onClick={() => window.print()} className="text-xl h-16 px-10 shadow-xl hover:scale-105 transition-transform">
          Download PDF Report
        </Button>
      </div>
    </div>
  ];

  /* ---------------- Render ---------------- */

  return (
    <div className="fixed inset-0 z-50 bg-background text-foreground flex flex-col font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1 border-primary/30 text-primary">Pitch Mode</Badge>
          <span className="text-lg text-muted-foreground font-medium">
            Slide {idx + 1} of {total}
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onExit}
          className="hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="h-6 w-6 mr-2" /> Exit Presentation
        </Button>
      </div>

      {/* Slide Viewport */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center p-8 md:p-24">
          <div className="w-full max-w-7xl h-full flex flex-col justify-center">
            {slides[idx]}
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="px-8 py-8 border-t border-border/40 flex justify-between items-center bg-muted/10">
        <Button
          variant="outline"
          onClick={prev}
          disabled={idx === 0}
          className="w-40 h-12 text-lg border-2"
        >
          <ChevronLeft className="h-5 w-5 mr-2" /> Previous
        </Button>

        <div className="flex gap-4">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-3 rounded-full transition-all duration-500 ${i === idx ? "w-16 bg-primary" : "w-3 bg-primary/20"
                }`}
            />
          ))}
        </div>

        <Button
          onClick={idx === total - 1 ? onExit : next}
          className="w-40 h-12 text-lg shadow-md"
        >
          {idx === total - 1 ? "Finish" : "Next"} <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}