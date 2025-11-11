import { useMemo, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ScoringResult } from "../utils/scoringEngine";
import { Info, ArrowLeft, BarChart3, Sparkles, Link as LinkIcon } from "lucide-react";
import {
  BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

/** ====== Types you already have or can adapt ====== */
export interface CompanyProfile {
  name?: string;
  industry?: string;        // e.g., "E-commerce/Retail"
  employeeCount?: number;
  logoUrl?: string;
}

interface BenchmarkPageProps {
  results: ScoringResult;
  onBack: () => void;
  company?: CompanyProfile;
}

/** ====== Methodology & Pillars ====== */
type Methodology =
  | "Scrum"
  | "SAFe"
  | "Waterfall"
  | "PRINCE2"
  | "Lean Six Sigma"
  | "Disciplined Agile"
  | "Hybrid"
  | "Continuous Delivery";

type Pillar = "Flow" | "Quality" | "Predictability" | "Value" | "Customer" | "Waste";

/** ====== Metric Catalog (unified, methodology-aware) ====== */
interface Metric {
  key: string;
  name: string;
  description: string;
  category: Pillar;
  units?: string;
  idealTrend: "up" | "down";
  relevance: Record<Methodology, number>; // 0..1
}

const METRICS: Metric[] = [
  // Flow
  { key: "cycle_time", name: "Cycle Time", description: "Start → finish time per item (P50).",
    category: "Flow", idealTrend: "down", units: "days",
    relevance: { Scrum:1, SAFe:1, Waterfall:0.4, PRINCE2:0.5, "Lean Six Sigma":1, "Disciplined Agile":1, Hybrid:0.8, "Continuous Delivery":1 } },
  { key: "lead_time", name: "Lead Time", description: "Request → release time (P50).",
    category: "Flow", idealTrend: "down", units: "days",
    relevance: { Scrum:1, SAFe:1, Waterfall:0.7, PRINCE2:0.8, "Lean Six Sigma":1, "Disciplined Agile":1, Hybrid:0.9, "Continuous Delivery":1 } },
  { key: "throughput", name: "Throughput", description: "Items finished per period.",
    category: "Flow", idealTrend: "up",
    relevance: { Scrum:1, SAFe:0.9, Waterfall:0.5, PRINCE2:0.6, "Lean Six Sigma":0.9, "Disciplined Agile":1, Hybrid:0.8, "Continuous Delivery":1 } },
  { key: "flow_eff", name: "Flow Efficiency", description: "Active time ÷ total time.",
    category: "Flow", idealTrend: "up", units: "%",
    relevance: { Scrum:0.8, SAFe:0.9, Waterfall:0.4, PRINCE2:0.5, "Lean Six Sigma":1, "Disciplined Agile":0.9, Hybrid:0.8, "Continuous Delivery":0.9 } },

  // Quality
  { key: "escapes", name: "Escapes to Prod", description: "Defects discovered after release.",
    category: "Quality", idealTrend: "down",
    relevance: { Scrum:1, SAFe:1, Waterfall:1, PRINCE2:1, "Lean Six Sigma":1, "Disciplined Agile":1, Hybrid:1, "Continuous Delivery":1 } },
  { key: "rework", name: "Rework %", description: "Items reopened or reworked.",
    category: "Quality", idealTrend: "down", units: "%",
    relevance: { Scrum:1, SAFe:1, Waterfall:1, PRINCE2:1, "Lean Six Sigma":1, "Disciplined Agile":1, Hybrid:1, "Continuous Delivery":1 } },
  { key: "first_pass", name: "First Pass Yield", description: "Done without rework.",
    category: "Quality", idealTrend: "up", units: "%",
    relevance: { Scrum:0.6, SAFe:0.8, Waterfall:0.9, PRINCE2:0.9, "Lean Six Sigma":1, "Disciplined Agile":0.8, Hybrid:0.9, "Continuous Delivery":0.7 } },

  // Predictability
  { key: "plan_rel", name: "Plan Reliability", description: "Committed vs completed per interval.",
    category: "Predictability", idealTrend: "up", units: "%",
    relevance: { Scrum:1, SAFe:0.9, Waterfall:0.9, PRINCE2:0.95, "Lean Six Sigma":0.6, "Disciplined Agile":0.9, Hybrid:0.9, "Continuous Delivery":0.7 } },
  { key: "spi", name: "SPI", description: "Schedule Performance Index (EV/PV).",
    category: "Predictability", idealTrend: "up",
    relevance: { Scrum:0.3, SAFe:0.5, Waterfall:1, PRINCE2:1, "Lean Six Sigma":0.5, "Disciplined Agile":0.6, Hybrid:0.8, "Continuous Delivery":0.3 } },
  { key: "cpi", name: "CPI", description: "Cost Performance Index (EV/AC).",
    category: "Predictability", idealTrend: "up",
    relevance: { Scrum:0.2, SAFe:0.5, Waterfall:1, PRINCE2:1, "Lean Six Sigma":0.7, "Disciplined Agile":0.5, Hybrid:0.8, "Continuous Delivery":0.2 } },

  // Value
  { key: "ttv", name: "Time-to-Value", description: "Start → first measurable outcome.",
    category: "Value", idealTrend: "down", units: "days",
    relevance: { Scrum:1, SAFe:0.9, Waterfall:0.8, PRINCE2:0.8, "Lean Six Sigma":0.8, "Disciplined Agile":1, Hybrid:1, "Continuous Delivery":1 } },
  { key: "bv", name: "Business Value", description: "Value delivered per period (relative).",
    category: "Value", idealTrend: "up",
    relevance: { Scrum:1, SAFe:1, Waterfall:0.9, PRINCE2:0.9, "Lean Six Sigma":0.7, "Disciplined Agile":1, Hybrid:1, "Continuous Delivery":1 } },

  // Customer
  { key: "nps", name: "NPS/CSAT", description: "Customer satisfaction/sentiment.",
    category: "Customer", idealTrend: "up",
    relevance: { Scrum:0.8, SAFe:0.8, Waterfall:0.8, PRINCE2:0.9, "Lean Six Sigma":0.8, "Disciplined Agile":0.8, Hybrid:0.8, "Continuous Delivery":0.8 } },
  { key: "sla", name: "SLA/SLO Adherence", description: "Reliability against promises.",
    category: "Customer", idealTrend: "up", units: "%",
    relevance: { Scrum:0.8, SAFe:0.9, Waterfall:0.9, PRINCE2:0.9, "Lean Six Sigma":0.9, "Disciplined Agile":0.8, Hybrid:0.9, "Continuous Delivery":0.9 } },

  // Waste
  { key: "queue_ratio", name: "Queue/Wait Ratio", description: "Wait ÷ active time.",
    category: "Waste", idealTrend: "down",
    relevance: { Scrum:0.9, SAFe:1, Waterfall:0.7, PRINCE2:0.8, "Lean Six Sigma":1, "Disciplined Agile":0.9, Hybrid:1, "Continuous Delivery":0.9 } },
  { key: "batch_size", name: "Batch Size", description: "Avg. items per release.",
    category: "Waste", idealTrend: "down",
    relevance: { Scrum:0.9, SAFe:1, Waterfall:0.7, PRINCE2:0.8, "Lean Six Sigma":1, "Disciplined Agile":0.9, Hybrid:1, "Continuous Delivery":1 } },
];

/** ====== Industry Peer Averages (editable seeds) ====== */
interface IndustryPeerData {
  industry: string;
  cycle_time_days: number;
  lead_time_days: number;
  escapes: number;
  rework: number; // %
  plan_rel: number; // %
  ttv_days: number;
}

const INDUSTRY_PEERS: IndustryPeerData[] = [
  { industry: "E-commerce/Retail", cycle_time_days: 6.5, lead_time_days: 8, escapes: 6, rework: 9, plan_rel: 82, ttv_days: 6 },
  { industry: "SaaS",                cycle_time_days: 5,   lead_time_days: 6, escapes: 5, rework: 8, plan_rel: 85, ttv_days: 5 },
  { industry: "FinTech",             cycle_time_days: 8,   lead_time_days:10, escapes: 4, rework: 7, plan_rel: 88, ttv_days: 9 },
  { industry: "Healthcare",          cycle_time_days: 9,   lead_time_days:12, escapes: 5, rework: 8, plan_rel: 86, ttv_days:10 },
  { industry: "Manufacturing",       cycle_time_days:10,   lead_time_days:14, escapes: 4, rework: 6, plan_rel: 90, ttv_days:12 },
];

/** ====== Cohorts from answers ====== */
type CohortKey = string;
interface UserContext {
  size: "small" | "medium" | "large";
  planning: "iterative" | "continuous_flow" | "up_front";
  compliance: "low" | "medium" | "high";
  sourcing: "internal" | "mixed" | "outsourced";
  goal: "speed" | "predictable" | "innovation";
}

function mapAnswersToContext(results: ScoringResult): UserContext {
  const a = results.answers || {};
  const planning =
    a.planning === "Up-front" ? "up_front" :
    a.planning === "Continuous Flow" ? "continuous_flow" : "iterative";
  const sourcing =
    a.sourcing === "Heavily Outsourced" ? "outsourced" :
    (a.sourcing === "Mixed" || a.sourcing === "Mixed Internal/External") ? "mixed" : "internal";
  const goal =
    a.goals === "Speed" ? "speed" :
    a.goals === "Innovation" ? "innovation" : "predictable";

  return {
    size: (a.project_size ?? "medium").toLowerCase(),
    planning, sourcing, goal,
    compliance: (a.compliance ?? "medium").toLowerCase(),
  } as UserContext;
}

function toCohortKey(ctx: UserContext): CohortKey {
  return `size:${ctx.size}|plan:${ctx.planning}|comp:${ctx.compliance}|src:${ctx.sourcing}|goal:${ctx.goal}`;
}

interface CohortBenchmark {
  title: string;
  description: string;
  metricValues: Record<string, number>;
}

const DEFAULT_COHORT: CohortBenchmark = {
  title: "Product Teams Optimizing for Speed",
  description: "Cross-functional teams using small batches and continuous testing.",
  metricValues: {
    cycle_time: 6, lead_time: 8, throughput: 25, flow_eff: 28,
    escapes: 5, rework: 8, first_pass: 92,
    plan_rel: 85, spi: 1.0, cpi: 1.0,
    ttv: 7, bv: 100,
    nps: 45, sla: 99,
    queue_ratio: 1.8, batch_size: 5,
  }
};

const COHORT_BENCHMARKS: Record<CohortKey, CohortBenchmark> = {
  "size:large|plan:up_front|comp:high|src:internal|goal:predictable": {
    title: "Large, Regulated, Up-Front Planning",
    description: "Heavier governance with strong predictability and quality controls.",
    metricValues: {
      cycle_time: 12, lead_time: 14, throughput: 12, flow_eff: 18,
      escapes: 3, rework: 7, first_pass: 95,
      plan_rel: 90, spi: 1.02, cpi: 1.01,
      ttv: 14, bv: 120,
      nps: 40, sla: 99.5,
      queue_ratio: 2.5, batch_size: 12,
    }
  },
  "size:medium|plan:iterative|comp:medium|src:mixed|goal:speed": DEFAULT_COHORT,
  "size:small|plan:iterative|comp:low|src:internal|goal:innovation": {
    title: "Startup-like Innovation",
    description: "Rapid prototyping, trunk-based development, feature flags.",
    metricValues: {
      cycle_time: 4, lead_time: 5, throughput: 35, flow_eff: 35,
      escapes: 7, rework: 10, first_pass: 90,
      plan_rel: 80, spi: 0.98, cpi: 0.98,
      ttv: 4, bv: 80,
      nps: 50, sla: 98,
      queue_ratio: 1.2, batch_size: 3,
    }
  },
};

/** ====== Exemplar Companies per methodology (with source notes) ====== */
interface Exemplar {
  company: string;
  methodology: Methodology;
  notes: string;
  sourceUrl?: string;

  // Optional numeric values (only render bars if present)
  cycle_time_days?: number;
  lead_time_days?: number;
  escapes?: number;
  rework?: number;
  plan_rel?: number;
  ttv_days?: number;
}

const EXEMPLARS: Exemplar[] = [
  // Scrum
  {
    company: "Spotify",
    methodology: "Scrum",
    notes: "Squads/tribes model; iterative delivery using Scrum practices.",
    sourceUrl: "https://engineering.atspotify.com/",
  },

  // SAFe
  {
    company: "John Deere",
    methodology: "SAFe",
    notes: "Scaled Agile adoption across IT/operations; case studies on scaling.",
    sourceUrl: "https://www.scruminc.com/agile-unleashed-scale-john-deere-case-study/",
  },

  // Waterfall
  {
    company: "Boeing",
    methodology: "Waterfall",
    notes: "Large systems engineering with gated, compliance-heavy releases.",
    sourceUrl: "https://www.boeing.com/",
  },

  // PRINCE2
  {
    company: "VocaLink (Mastercard)",
    methodology: "PRINCE2",
    notes: "PRINCE2 used for major payment-system projects.",
    sourceUrl: "https://www.whatisprince2.net/case-studies",
  },

  // Lean Six Sigma
  {
    company: "Toyota",
    methodology: "Lean Six Sigma",
    notes: "TPS/Lean heritage; defect reduction, waste elimination.",
    sourceUrl: "https://global.toyota/en/company/vision-and-philosophy/production-system/",
  },

  // Disciplined Agile
  {
    company: "TD Bank (example adopter)",
    methodology: "Disciplined Agile",
    notes: "Large enterprises have reported DA(D)/Disciplined Agile adoption; limited public metrics.",
    sourceUrl: "https://www.pmi.org/disciplined-agile",
  },

  // Hybrid
  {
    company: "Nike, Inc.",
    methodology: "Hybrid",
    notes: "Digital retail blends Agile trains + governed release windows; internal blogs discuss transformation.",
    sourceUrl: "https://medium.com/nikeengineering/",
  },

  // Continuous Delivery
  {
    company: "Amazon",
    methodology: "Continuous Delivery",
    notes: "High deploy cadence, short lead times; frequent CD/DevOps case studies.",
    sourceUrl: "https://aws.amazon.com/blogs/devops/",
  },
];

/** ====== Helpers ====== */
function selectMetricsForMethod(method: Methodology, threshold = 0.55): Metric[] {
  return METRICS.filter(m => (m.relevance[method] ?? 0) >= threshold);
}

/** ====== Component ====== */
export function BenchmarkPage({ results, onBack, company }: BenchmarkPageProps) {
  // Determine user's top methodology (exactly the 8 you support)
  const topMethodology = (results.ranking?.[0]?.method ?? "Scrum") as Methodology;

  // Build cohort from answers
  const userCtx = useMemo(() => mapAnswersToContext(results), [results]);
  const cohortKey = useMemo(() => toCohortKey(userCtx), [userCtx]);
  const cohort = useMemo(() => COHORT_BENCHMARKS[cohortKey] ?? DEFAULT_COHORT, [cohortKey]);

  // Pick metrics for this methodology
  const highlightedMetrics = useMemo(() => selectMetricsForMethod(topMethodology), [topMethodology]);

  // Industry baseline
  const defaultIndustry = company?.industry ?? "E-commerce/Retail";
  const [selectedIndustry, setSelectedIndustry] = useState<string>(defaultIndustry);
  const industryPeer = useMemo(
    () => INDUSTRY_PEERS.find(p => p.industry === selectedIndustry) || INDUSTRY_PEERS[0],
    [selectedIndustry]
  );

  // Exemplar(s) filtered by selected methodology
  const exemplars = useMemo(
    () => EXEMPLARS.filter(ex => ex.methodology === topMethodology),
    [topMethodology]
  );
  const [selectedExemplar, setSelectedExemplar] = useState<string>(exemplars[0]?.company ?? "");
  const exemplar = useMemo(
    () => exemplars.find(e => e.company === selectedExemplar) ?? exemplars[0],
    [exemplars, selectedExemplar]
  );

  /** === Bars: Cohort vs Industry vs Exemplar (numeric shown only if present) === */
  const barRows = useMemo(() => {
    const rows: Array<Record<string, number | string>> = [];

    function pushRow(label: string, keys: { cohort?: string; industry?: keyof IndustryPeerData; exemplar?: keyof Exemplar }) {
      const row: Record<string, number | string> = { metric: label };

      if (keys.cohort && cohort.metricValues[keys.cohort] != null) {
        row["Cohort Avg"] = cohort.metricValues[keys.cohort]!;
      }
      if (keys.industry) {
        const val = industryPeer[keys.industry];
        if (typeof val === "number") row["Industry Avg"] = val;
      }
      if (exemplar && keys.exemplar && exemplar[keys.exemplar] != null) {
        row[exemplar.company] = exemplar[keys.exemplar] as number;
      }
      rows.push(row);
    }

    pushRow("Cycle Time (days)", { cohort: "cycle_time", industry: "cycle_time_days", exemplar: "cycle_time_days" });
    pushRow("Lead Time (days)",  { cohort: "lead_time",  industry: "lead_time_days",  exemplar: "lead_time_days" });
    pushRow("Escapes (per period)", { cohort: "escapes", industry: "escapes", exemplar: "escapes" });
    pushRow("Rework (%)", { cohort: "rework", industry: "rework", exemplar: "rework" });
    pushRow("Plan Reliability (%)", { cohort: "plan_rel", industry: "plan_rel", exemplar: "plan_rel" });
    pushRow("Time-to-Value (days)", { cohort: "ttv", industry: "ttv_days", exemplar: "ttv_days" });

    return rows;
  }, [cohort, industryPeer, exemplar]);

  const seriesKeys = useMemo(() => {
    const s = new Set<string>();
    barRows.forEach(r => Object.keys(r).forEach(k => k !== "metric" && s.add(k)));
    return Array.from(s);
  }, [barRows]);

  /** === Radar: pillar emphasis for selected methodology === */
  const pillarScores = useMemo(() => {
    const buckets: Record<Pillar, number[]> = {
      Flow: [], Quality: [], Predictability: [], Value: [], Customer: [], Waste: []
    };
    highlightedMetrics.forEach(m => buckets[m.category].push(m.relevance[topMethodology]));
    const avg = (arr: number[]) => (arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : 0);
    const toPct = (v: number) => Math.round(v * 100);
    return (Object.keys(buckets) as Pillar[]).map(p => ({ pillar: p, Score: toPct(avg(buckets[p])) }));
  }, [highlightedMetrics, topMethodology]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 py-10 px-4">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl">Methodology-Aware Benchmark</h1>
              <p className="text-muted-foreground">
                Adaptive metrics for <span className="font-medium">{topMethodology}</span> • {company?.name ?? "Your Organization"}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
        </div>

        {/* Cohort Summary */}
        <Card className="glass-card border-white/20 dark:border-white/10 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge>Answer-Driven Cohort</Badge>
                <Badge variant="secondary">{topMethodology}</Badge>
              </div>
              <h2 className="text-2xl">{cohort.title}</h2>
              <p className="text-muted-foreground max-w-2xl">{cohort.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Personalized to your context</span>
            </div>
          </div>
        </Card>

        {/* Controls */}
        <Card className="glass-card border-white/20 dark:border-white/10 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">Compare With</Badge>

            {/* Industry */}
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_PEERS.map(ind => (
                <Button
                  key={ind.industry}
                  variant={selectedIndustry === ind.industry ? "default" : "outline"}
                  onClick={() => setSelectedIndustry(ind.industry)}
                  className="h-8 text-sm"
                >
                  {ind.industry}
                </Button>
              ))}
            </div>

            {/* Exemplars for the selected methodology */}
            <Separator orientation="vertical" className="h-6 mx-1" />
            <div className="flex flex-wrap gap-2">
              {exemplars.length === 0 ? (
                <Badge variant="outline">No public exemplars</Badge>
              ) : (
                exemplars.map(e => (
                  <Button
                    key={e.company}
                    variant={exemplar?.company === e.company ? "default" : "outline"}
                    onClick={() => setSelectedExemplar(e.company)}
                    className="h-8 text-sm"
                  >
                    {e.company}
                  </Button>
                ))
              )}
            </div>
          </div>
          {exemplar && (
            <div className="mt-3 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
              <LinkIcon className="h-3.5 w-3.5" />
              <span>{exemplar.notes}</span>
              {exemplar.sourceUrl && (
                <a className="text-primary underline inline-flex items-center gap-1" href={exemplar.sourceUrl} target="_blank" rel="noreferrer">
                  <LinkIcon className="h-3.5 w-3.5" /> Source
                </a>
              )}
            </div>
          )}
        </Card>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar comparison */}
          <Card className="glass-card p-6 border-white/20 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Cohort vs Industry vs Exemplar</h3>
              <Info className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Benchmarks grounded in your answers; company bars appear when public numbers are available.
            </p>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barRows} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="metric" type="category" width={170} />
                  <Tooltip />
                  <Legend />
                  {seriesKeys.map(k => (
                    <Bar
                      key={k}
                      dataKey={k}
                      fill={
                        k === "Cohort Avg" ? "#3b82f6" :
                        k === "Industry Avg" ? "#22c55e" : "#f97316"
                      }
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Radar: pillar emphasis */}
          <Card className="glass-card p-6 border-white/20 dark:border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Pillar Emphasis for {topMethodology}</h3>
              <Info className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Shows which metric families matter most for this methodology in SectorSync.
            </p>
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={pillarScores}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="pillar" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Emphasis" dataKey="Score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Metric tiles */}
        <Card className="glass-card p-6 border-white/20 dark:border-white/10">
          <h3 className="text-xl mb-4">Key Metrics for {topMethodology}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highlightedMetrics.map(m => (
              <div key={m.key} className="rounded-lg border border-white/20 dark:border-white/10 p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{m.name}</div>
                  <Badge variant="outline">{m.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{m.description}</p>
                <p className="text-xs">
                  Ideal trend: <span className="font-medium">{m.idealTrend === "up" ? "Higher is better" : "Lower is better"}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Tip: Keep batch size small and reduce queue/approval wait time to improve Cycle/Lead Time across all methodologies.
          </p>
        </Card>

        {/* Sources block (shown for the selected methodology) */}
        <Card className="glass-card p-6 border-white/20 dark:border-white/10">
          <h3 className="text-xl mb-3">Sources & Case Studies</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Public case studies and official pages associated with organizations using <span className="font-medium">{topMethodology}</span>.
          </p>
          <ul className="text-sm list-disc pl-5 space-y-2">
            {exemplars.map((e) => (
              <li key={e.company} className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{e.company}:</span>
                <span className="text-muted-foreground">{e.notes}</span>
                {e.sourceUrl && (
                  <a href={e.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline">
                    <LinkIcon className="h-3.5 w-3.5" /> Source
                  </a>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-4">
            Where companies have not published numeric values for specific metrics, SectorSync displays cohort and industry benchmarks and labels company data as partial.
          </p>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            SectorSync adapts metrics to your methodology while benchmarking against cohorts, industry peers, and public exemplars.
          </p>
        </div>
      </div>
    </div>
  );
}
