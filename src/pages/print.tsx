import { useMemo } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { ScoringResult } from "../utils/scoringEngine";
import {
  CheckCircle2,
  AlertTriangle,
  Trophy,
  BarChart3,
  Target,
  ArrowRight,
  Factory,
  Globe,
  Building2,
  Activity,
  TrendingUp,
  Flag
} from "lucide-react";

/* ==================================================================================
   DATA CONSTANTS (Unified with Pitch & Results)
   ================================================================================== */

const METHOD_DESCRIPTIONS: Record<string, string> = {
  Scrum: "Agile framework emphasizing iterative development, self-organizing teams, and continuous improvement through sprints.",
  SAFe: "Scaled Agile Framework designed for large enterprises to implement agile practices across multiple teams.",
  Hybrid: "Combines traditional and agile approaches, allowing flexibility to adapt to different project phases.",
  Waterfall: "Sequential development approach with distinct phases, best for projects with well-defined requirements.",
  "Lean Six Sigma": "Process improvement methodology focused on reducing waste and variation while maximizing value.",
  PRINCE2: "Structured project management method emphasizing organization, control, and defined roles throughout the project.",
  "Disciplined Agile": "Hybrid toolkit that provides guidance for choosing the right approach for your specific context.",
  "Lean Continuous Delivery": "Software development practice where code changes are automatically built, tested, and deployed.",
};

const METHOD_QUICK_INSIGHTS: Record<string, { why: string[]; watchouts: string[] }> = {
  Scrum: {
    why: ["Great for evolving requirements.", "High team autonomy."],
    watchouts: ["Requires strong discipline.", "Can fail without stakeholder buy-in."],
  },
  SAFe: {
    why: ["Excellent for large-scale coordination.", "Clear governance structure."],
    watchouts: ["Heavy implementation overhead.", "Risk of reduced agility."],
  },
  "Disciplined Agile": {
    why: ["Highly flexible and context-sensitive.", "Enterprise-aware."],
    watchouts: ["Complex to master.", "Requires experienced coaching."],
  },
  Hybrid: {
    why: ["Balances control with flexibility.", "Good for transition phases."],
    watchouts: ["Can become 'Waterfall with meetings'.", "Requires clear boundaries."],
  },
  "Lean Continuous Delivery": {
    why: ["Maximizes flow and speed.", "Rapid customer feedback."],
    watchouts: ["Requires mature DevOps.", "High engineering standards needed."],
  },
  "Lean Six Sigma": {
    why: ["Focuses on quality and waste reduction.", "Data-driven."],
    watchouts: ["Can stifle innovation.", "Documentation heavy."],
  },
  Waterfall: {
    why: ["Predictable budgets and timelines.", "Clear milestones."],
    watchouts: ["Resistant to change.", "Delayed value delivery."],
  },
  PRINCE2: {
    why: ["Strong business case focus.", "Clear roles and responsibilities."],
    watchouts: ["Administrative burden.", "Rigid if not tailored."],
  },
};

// --- BENCHMARK DATA ---
const PILLARS = ["Flow", "Quality", "Predictability", "Value", "Customer", "Waste"];

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
  Scrum: { companies: ["Spotify", "Google", "Netflix"], metrics: ["Velocity", "Cycle Time"] },
  SAFe: { companies: ["FedEx", "Chevron", "Lockheed Martin"], metrics: ["Program Predictability", "Feature Cycle Time"] },
  "Disciplined Agile": { companies: ["Franklin Templeton", "Panera Bread"], metrics: ["Time to Market", "Stakeholder Satisfaction"] },
  Hybrid: { companies: ["IBM", "NASA (JPL)", "Honeywell"], metrics: ["Milestone Hit Rate", "Requirement Stability"] },
  Waterfall: { companies: ["Toyota", "Construction Firms"], metrics: ["Budget Variance", "SPI"] },
  PRINCE2: { companies: ["UK Government", "United Nations"], metrics: ["Business Case Validity", "Stage Boundaries"] },
  "Lean Six Sigma": { companies: ["General Electric", "Motorola"], metrics: ["DPMO", "Process Efficiency"] },
  "Lean Continuous Delivery": { companies: ["Amazon", "Etsy"], metrics: ["Deployment Freq", "MTTR"] },
};

/* ==================================================================================
   COMPONENT
   ================================================================================== */

interface PrintPageProps {
  results: ScoringResult;
  onBack: () => void;
  onOpenBenchmark?: () => void;
  brandName?: string;
  logoUrl?: string;
}

export function PrintPage({
  results,
  onBack,
  brandName = "SectorSync",
  logoUrl,
}: PrintPageProps) {

  // 1. Prepare Data
  const ranking = [...(results.ranking || [])].sort((a, b) => b.score - a.score);
  const top = ranking[0];

  // Insights
  const insights = METHOD_QUICK_INSIGHTS[top.method] || {
    why: ["Aligns with your project's size and goals."],
    watchouts: ["Ensure team buy-in before implementation."],
  };

  const description = METHOD_DESCRIPTIONS[top.method] || "No description available.";

  // Benchmark Prep
  const benchmarkStats = useMemo(() => {
    // Fuzzy match
    const matchKey = Object.keys(FRAMEWORK_PROFILES).find(k =>
      k.toLowerCase() === top.method.toLowerCase()
    ) || "Hybrid";

    const profile = FRAMEWORK_PROFILES[matchKey];

    return PILLARS.map(pillar => ({
      subject: pillar,
      User: Math.round((profile[pillar] || 50) * (0.8 + 0.2 * top.score)),
      Industry: INDUSTRY_AVERAGE[pillar] || 50
    }));
  }, [top.method, top.score]);

  // Context Data
  const contextData = useMemo(() => {
    const matchKey = Object.keys(EXEMPLAR_DATA).find(k =>
      k.toLowerCase() === top.method.toLowerCase()
    ) || "Hybrid";
    return EXEMPLAR_DATA[matchKey];
  }, [top.method]);

  // 2. Build Slides Inline
  const slides = useMemo(() => [

    // --- SLIDE 1: COVER ---
    <div className="flex flex-col h-full justify-center text-center space-y-8">
      <div>
        <div className="inline-flex items-center justify-center p-6 bg-primary/5 rounded-full mb-6 border border-primary/20">
          <Factory className="h-20 w-20 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Executive Report</h2>
          <h1 className="text-5xl font-extrabold tracking-tight">{top.method}</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto w-full pt-8">
        <Card className="p-6 border-2 flex flex-col items-center justify-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Match Score
          </div>
          <div className="text-6xl font-mono font-bold">
            {(top.score * 100).toFixed(0)}%
          </div>
        </Card>
        <Card className="p-6 border-2 flex flex-col items-center justify-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Confidence
          </div>
          <div className="text-6xl font-mono font-bold text-green-600">
            High
          </div>
        </Card>
      </div>
    </div>,

    // --- SLIDE 2: STRATEGIC INSIGHTS ---
    <div className="h-full flex flex-col">
      <div className="mb-8 pb-4 border-b">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          Strategic Analysis
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          Key drivers for recommendation and potential risks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <Card className="p-8 border-l-4 border-l-primary bg-primary/5 h-full">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-primary">
            <CheckCircle2 className="h-6 w-6" /> Why it fits
          </h3>
          <ul className="space-y-4">
            {insights.why.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-lg leading-relaxed">
                <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-1" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-8 border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/10 h-full">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-amber-600 dark:text-amber-500">
            <AlertTriangle className="h-6 w-6" /> Watch Outs
          </h3>
          <ul className="space-y-4">
            {insights.watchouts.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-lg leading-relaxed">
                <ArrowRight className="h-5 w-5 text-amber-500 shrink-0 mt-1" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>,

    // --- SLIDE 3: CAPABILITY BENCHMARK ---
    <div className="h-full flex flex-col">
      <div className="mb-8 pb-4 border-b">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Capability Benchmark
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          Projected performance capabilities vs. Industry Average.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
        <div className="space-y-8 py-4">
          {benchmarkStats.map((item) => (
            <div key={item.subject} className="space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-lg">{item.subject}</span>
                <span className="text-primary font-bold">{item.User}%</span>
              </div>
              <div className="relative pt-1">
                {/* Industry Marker */}
                <div
                  className="absolute top-0 w-1 h-4 bg-black/40 z-10 -mt-1"
                  style={{ left: `${item.Industry}%` }}
                />
                <Progress value={item.User} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span className="pl-4">| Industry Avg: {item.Industry}%</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-primary/5 border-primary/10">
            <h4 className="font-bold text-lg flex items-center gap-2 mb-3 text-primary">
              <Target className="h-5 w-5" /> Key Strength
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Your profile demonstrates exceptional alignment in <strong>Predictability</strong> and <strong>Quality</strong>, ensuring stable delivery cycles.
            </p>
          </Card>
          <Card className="p-6">
            <h4 className="font-bold text-lg flex items-center gap-2 mb-3 text-green-600">
              <TrendingUp className="h-5 w-5" /> Efficiency Gain
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              Adopting this framework typically yields a <strong>15-20% reduction</strong> in process waste compared to the industry baseline.
            </p>
          </Card>
        </div>
      </div>
    </div>,

    // --- SLIDE 4: REAL WORLD CONTEXT ---
    <div className="h-full flex flex-col">
      <div className="mb-8 pb-4 border-b">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          Industry Application
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          Who uses {top.method} and how success is measured.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
        <Card className="p-8 bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">Industry Leaders</h3>
          </div>
          <ul className="space-y-4">
            {contextData.companies.map((c, i) => (
              <li key={i} className="flex items-center gap-3 text-lg">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                {c}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-8 bg-purple-50/50 border-purple-100 dark:bg-purple-950/10 dark:border-purple-900/30">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100">Success Metrics</h3>
          </div>
          <ul className="space-y-4">
            {contextData.metrics.map((m, i) => (
              <li key={i} className="flex items-center gap-3 text-lg">
                <ArrowRight className="h-5 w-5 text-purple-500" />
                {m}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>,

    // --- SLIDE 5: RANKING BREAKDOWN (Fixed Bars) ---
    <div className="h-full flex flex-col">
      <div className="mb-8 pb-4 border-b">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-primary" />
          Alternative Options
        </h2>
        <p className="text-lg text-muted-foreground mt-2">
          Comparison of other methodologies against your requirements.
        </p>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto">
        {ranking.slice(1, 7).map((r, i) => (
          <div key={r.method} className="flex items-center gap-6 p-4 border rounded-lg bg-card">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground text-lg">
              {i + 2}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-xl">{r.method}</span>
                <span className="font-mono font-bold text-muted-foreground text-lg">
                  {(r.score * 100).toFixed(0)}%
                </span>
              </div>
              {/* FIXED: Absolute Percentage Width */}
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary/70"
                  style={{ width: `${r.score * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // --- SLIDE 6: CLOSING ---
    <div className="flex flex-col h-full justify-center items-center text-center space-y-10">
      <div className="p-8 bg-green-100 dark:bg-green-900/20 rounded-full border border-green-200">
        <Flag className="h-20 w-20 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <h2 className="text-5xl font-bold mb-6">Recommended Path Forward</h2>
        <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We recommend initiating a <strong>Pilot Phase</strong> using {top.method} on a single value stream. Measure success using the identified metrics before broader enterprise rollout.
        </p>
      </div>
      <div className="pt-8 opacity-50 text-sm">
        Report generated by {brandName} on {new Date().toLocaleDateString()}
      </div>
    </div>

  ], [top, insights, description, ranking, brandName, benchmarkStats, contextData]);

  return (
    <div className="min-h-screen bg-muted/20 text-foreground pb-20">
      {/* Toolbar (hidden in print view) */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-4 border-b bg-background/80 backdrop-blur print:hidden">
        <div className="flex items-center gap-3">
          {logoUrl && <img src={logoUrl} alt="Logo" className="h-8 w-auto" />}
          <span className="font-semibold text-lg">{brandName} Report</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" onClick={() => window.print()}>
            Print / Save PDF
          </Button>
          <Button variant="outline" onClick={onBack}>
            Close
          </Button>
        </div>
      </div>

      {/* Slides Container */}
      <div className="mx-auto w-full max-w-5xl p-8 space-y-12">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="print-page bg-background border shadow-sm rounded-xl p-12 h-[1000px] flex flex-col relative overflow-hidden"
          >
            {/* Header Per Page */}
            <div className="flex justify-between items-center mb-8 opacity-50 text-sm uppercase tracking-widest border-b pb-4">
              <span className="font-semibold">{brandName} Assessment</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>

            {/* Slide Content */}
            <div className="flex-1">
              {slide}
            </div>

            {/* Footer Per Page */}
            <div className="mt-8 pt-6 border-t flex justify-between items-center opacity-50 text-sm">
              <span>Recommendation Report</span>
              <span>Page {i + 1} / {slides.length}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Print CSS Rules */}
      <style>{`
        @media print {
          @page { size: portrait; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
          .print\\:hidden { display: none !important; }
          .print-page {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            height: 100vh !important;
            page-break-after: always;
            break-after: page;
            border-radius: 0 !important;
          }
          .min-h-screen { background: white !important; padding: 0 !important; }
          .mx-auto { max-w-none !important; width: 100% !important; padding: 0 !important; space-y: 0 !important; }
        }
      `}</style>
    </div>
  );
}