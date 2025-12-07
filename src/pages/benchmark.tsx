import { useMemo } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ScoringResult } from "../utils/scoringEngine";
import {
  ArrowLeft,
  BarChart3,
  Link as LinkIcon,
  Sparkles,
} from "lucide-react";

/** ====== Types ====== */
export interface CompanyProfile {
  name?: string;
  industry?: string; // e.g., "E-commerce/Retail"
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

type Pillar =
  | "Flow"
  | "Quality"
  | "Predictability"
  | "Value"
  | "Customer"
  | "Waste";

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
  {
    key: "cycle_time",
    name: "Cycle Time",
    description: "Start → finish time per item (P50).",
    category: "Flow",
    idealTrend: "down",
    units: "days",
    relevance: {
      Scrum: 1,
      SAFe: 1,
      Waterfall: 0.4,
      PRINCE2: 0.5,
      "Lean Six Sigma": 1,
      "Disciplined Agile": 1,
      Hybrid: 0.8,
      "Continuous Delivery": 1,
    },
  },
  {
    key: "lead_time",
    name: "Lead Time",
    description: "Request → release time (P50).",
    category: "Flow",
    idealTrend: "down",
    units: "days",
    relevance: {
      Scrum: 1,
      SAFe: 1,
      Waterfall: 0.7,
      PRINCE2: 0.8,
      "Lean Six Sigma": 1,
      "Disciplined Agile": 1,
      Hybrid: 0.9,
      "Continuous Delivery": 1,
    },
  },
  {
    key: "throughput",
    name: "Throughput",
    description: "Items finished per period.",
    category: "Flow",
    idealTrend: "up",
    relevance: {
      Scrum: 1,
      SAFe: 0.9,
      Waterfall: 0.5,
      PRINCE2: 0.6,
      "Lean Six Sigma": 0.9,
      "Disciplined Agile": 1,
      Hybrid: 0.8,
      "Continuous Delivery": 1,
    },
  },
  {
    key: "flow_eff",
    name: "Flow Efficiency",
    description: "Active time ÷ total time.",
    category: "Flow",
    idealTrend: "up",
    units: "%",
    relevance: {
      Scrum: 0.8,
      SAFe: 0.9,
      Waterfall: 0.4,
      PRINCE2: 0.5,
      "Lean Six Sigma": 1,
      "Disciplined Agile": 0.9,
      Hybrid: 0.8,
      "Continuous Delivery": 0.9,
    },
  },

  // Quality
  {
    key: "escapes",
    name: "Escapes to Prod",
    description: "Defects discovered after release.",
    category: "Quality",
    idealTrend: "down",
    relevance: {
      Scrum: 1,
      SAFe: 1,
      Waterfall: 1,
      PRINCE2: 1,
      "Lean Six Sigma": 1,
      "Disciplined Agile": 1,
      Hybrid: 1,
      "Continuous Delivery": 1,
    },
  },
  {
    key: "rework",
    name: "Rework %",
    description: "Items reopened or reworked.",
    category: "Quality",
    idealTrend: "down",
    units: "%",
    relevance: {
      Scrum: 1,
      SAFe: 1,
      Waterfall: 1,
      PRINCE2: 1,
      "Lean Six Sigma": 1,
      "Disciplined Agile": 1,
      Hybrid: 1,
      "Continuous Delivery": 1,
    },
  },
  {
    key: "first_pass",
    name: "First Pass Yield",
    description: "Done without rework.",
    category: "Quality",
    idealTrend: "up",
    units: "%",
    relevance: {
      Scrum: 0.6,
      SAFe: 0.8,
      Waterfall: 0.9,
      PRINCE2: 0.9,
      "Lean Six Sigma": 1,
      "Disciplined Agile": 0.8,
      Hybrid: 0.9,
      "Continuous Delivery": 0.7,
    },
  },

  // Predictability
  {
    key: "plan_rel",
    name: "Plan Reliability",
    description: "Committed vs completed per interval.",
    category: "Predictability",
    idealTrend: "up",
    units: "%",
    relevance: {
      Scrum: 1,
      SAFe: 0.9,
      Waterfall: 0.9,
      PRINCE2: 0.95,
      "Lean Six Sigma": 0.6,
      "Disciplined Agile": 0.9,
      Hybrid: 0.9,
      "Continuous Delivery": 0.7,
    },
  },
  {
    key: "spi",
    name: "SPI",
    description: "Schedule Performance Index (EV/PV).",
    category: "Predictability",
    idealTrend: "up",
    relevance: {
      Scrum: 0.3,
      SAFe: 0.5,
      Waterfall: 1,
      PRINCE2: 1,
      "Lean Six Sigma": 0.5,
      "Disciplined Agile": 0.6,
      Hybrid: 0.8,
      "Continuous Delivery": 0.3,
    },
  },
  {
    key: "cpi",
    name: "CPI",
    description: "Cost Performance Index (EV/AC).",
    category: "Predictability",
    idealTrend: "up",
    relevance: {
      Scrum: 0.2,
      SAFe: 0.5,
      Waterfall: 1,
      PRINCE2: 1,
      "Lean Six Sigma": 0.7,
      "Disciplined Agile": 0.5,
      Hybrid: 0.8,
      "Continuous Delivery": 0.2,
    },
  },

  // Value
  {
    key: "ttv",
    name: "Time-to-Value",
    description: "Start → first measurable outcome.",
    category: "Value",
    idealTrend: "down",
    units: "days",
    relevance: {
      Scrum: 1,
      SAFe: 0.9,
      Waterfall: 0.8,
      PRINCE2: 0.8,
      "Lean Six Sigma": 0.8,
      "Disciplined Agile": 1,
      Hybrid: 1,
      "Continuous Delivery": 1,
    },
  },
  {
    key: "bv",
    name: "Business Value",
    description: "Value delivered per period (relative).",
    category: "Value",
    idealTrend: "up",
    relevance: {
      Scrum: 1,
      SAFe: 1,
      Waterfall: 0.9,
      PRINCE2: 0.9,
      "Lean Six Sigma": 0.7,
      "Disciplined Agile": 1,
      Hybrid: 1,
      "Continuous Delivery": 1,
    },
  },

  // Customer
  {
    key: "nps",
    name: "NPS/CSAT",
    description: "Customer satisfaction/sentiment.",
    category: "Customer",
    idealTrend: "up",
    relevance: {
      Scrum: 0.8,
      SAFe: 0.8,
      Waterfall: 0.8,
      PRINCE2: 0.9,
      "Lean Six Sigma": 0.8,
      "Disciplined Agile": 0.8,
      Hybrid: 0.8,
      "Continuous Delivery": 0.8,
    },
  },
  {
    key: "sla",
    name: "SLA/SLO Adherence",
    description: "Reliability against promises.",
    category: "Customer",
    idealTrend: "up",
    units: "%",
    relevance: {
      Scrum: 0.8,
      SAFe: 0.9,
      Waterfall: 0.9,
      PRINCE2: 0.9,
      "Lean Six Sigma": 0.9,
      "Disciplined Agile": 0.8,
      Hybrid: 0.9,
      "Continuous Delivery": 0.9,
    },
  },

  // Waste
  {
    key: "queue_ratio",
    name: "Queue/Wait Ratio",
    description: "Wait ÷ active time.",
    category: "Waste",
    idealTrend: "down",
    relevance: {
      Scrum: 0.9,
      SAFe: 1,
      Waterfall: 0.7,
      PRINCE2: 0.8,
      "Lean Six Sigma": 1,
      "Disciplined Agile": 0.9,
      Hybrid: 1,
      "Continuous Delivery": 0.9,
    },
  },
  {
    key: "batch_size",
    name: "Batch Size",
    description: "Avg. items per release.",
    category: "Waste",
    idealTrend: "down",
    relevance: {
      Scrum: 0.9,
      SAFe: 1,
      Waterfall: 0.7,
      PRINCE2: 0.8,
      "Lean Six Sigma": 1,
      "Disciplined Agile": 0.9,
      Hybrid: 1,
      "Continuous Delivery": 1,
    },
  },
];

/** ====== Exemplar Companies per methodology (with source notes) ====== */
interface Exemplar {
  company: string;
  methodology: Methodology;
  notes: string;
  sourceUrl?: string;
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
    sourceUrl:
      "https://www.scruminc.com/agile-unleashed-scale-john-deere-case-study/",
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
    sourceUrl:
      "https://global.toyota/en/company/vision-and-philosophy/production-system/",
  },

  // Disciplined Agile
  {
    company: "TD Bank (example adopter)",
    methodology: "Disciplined Agile",
    notes:
      "Large enterprises have reported DA(D)/Disciplined Agile adoption; limited public metrics.",
    sourceUrl: "https://www.pmi.org/disciplined-agile",
  },

  // Hybrid
  {
    company: "Nike, Inc.",
    methodology: "Hybrid",
    notes:
      "Digital retail blends Agile trains + governed release windows; internal blogs discuss transformation.",
    sourceUrl: "https://medium.com/nikeengineering/",
  },

  // Continuous Delivery
  {
    company: "Amazon",
    methodology: "Continuous Delivery",
    notes:
      "High deploy cadence, short lead times; frequent CD/DevOps case studies.",
    sourceUrl: "https://aws.amazon.com/blogs/devops/",
  },
];

/** ====== Methodology families (just for light context) ====== */
type ApproachFamily = "Agile" | "Predictive" | "Lean";

const METHODOLOGY_FAMILY: Record<Methodology, ApproachFamily> = {
  Scrum: "Agile",
  SAFe: "Agile",
  "Disciplined Agile": "Agile",
  Hybrid: "Agile",
  "Continuous Delivery": "Agile",
  "Lean Six Sigma": "Lean",
  Waterfall: "Predictive",
  PRINCE2: "Predictive",
};

const FAMILY_METHODS: Record<ApproachFamily, Methodology[]> = {
  Agile: ["Scrum", "SAFe", "Disciplined Agile", "Hybrid", "Continuous Delivery"],
  Predictive: ["Waterfall", "PRINCE2"],
  Lean: ["Lean Six Sigma"],
};

/** ====== Helpers ====== */
function selectMetricsForMethod(
  method: Methodology,
  threshold = 0.55
): Metric[] {
  return METRICS.filter((m) => (m.relevance[method] ?? 0) >= threshold);
}

function familyLabel(f: ApproachFamily) {
  if (f === "Agile") return "Agile methodologies";
  if (f === "Predictive") return "Predictive methodologies";
  return "Lean methodologies";
}

function trendLabel(ideal: "up" | "down") {
  return ideal === "up" ? "Higher is better" : "Lower is better";
}

/** ====== Component ====== */
export function BenchmarkPage({
  results,
  onBack,
  company,
}: BenchmarkPageProps) {
  // Determine user's top methodology (exactly the 8 you support)
  const topMethodology = (results.ranking?.[0]?.method ?? "Scrum") as Methodology;
  const family = METHODOLOGY_FAMILY[topMethodology];

  // Key metrics for this framework
  const frameworkMetrics = useMemo(
    () => selectMetricsForMethod(topMethodology),
    [topMethodology]
  );

  // Companies using this framework
  const exemplarsForTop = useMemo(
    () => EXEMPLARS.filter((ex) => ex.methodology === topMethodology),
    [topMethodology]
  );

  // Companies using related frameworks in the same family
  const exemplarsForFamily = useMemo(
    () =>
      EXEMPLARS.filter((ex) =>
        FAMILY_METHODS[family].includes(ex.methodology)
      ),
    [family]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 py-10 px-4">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl">Framework KPI Benchmark</h1>
              <p className="text-muted-foreground">
                Recommended framework:{" "}
                <span className="font-semibold">{topMethodology}</span>{" "}
                <span className="text-xs align-middle">
                  ({familyLabel(family)})
                </span>{" "}
                • {company?.name ?? "Your organization"}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
        </div>

        {/* Key metrics for the framework */}
        <Card className="glass-card border-white/20 dark:border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl">Key Metrics for {topMethodology}</h2>
              <p className="text-xs text-muted-foreground">
                Use these as the core KPIs when you stand up dashboards and OKRs
                for this framework.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {frameworkMetrics.map((m) => (
              <div
                key={m.key}
                className="rounded-lg border border-white/20 dark:border-white/10 p-4 bg-white/60 dark:bg-gray-900/60"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium">{m.name}</div>
                  <Badge variant="outline" className="text-[10px]">
                    {m.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {m.description}
                </p>
                <p className="text-[11px]">
                  Ideal trend:{" "}
                  <span className="font-medium">
                    {trendLabel(m.idealTrend)}
                  </span>
                  {m.units && (
                    <>
                      {" "}
                      • <span className="text-muted-foreground">{m.units}</span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Companies using this framework & related ones */}
        <Card className="glass-card border-white/20 dark:border-white/10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">
              How other companies use these frameworks
            </h2>
            <Badge variant="secondary" className="text-[11px]">
              {familyLabel(family)}
            </Badge>
          </div>

          {/* This specific framework */}
          <div>
            <h3 className="text-sm font-semibold mb-2">
              Organizations using {topMethodology}
            </h3>
            {exemplarsForTop.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                We don&apos;t have public case studies for this specific
                framework yet.
              </p>
            ) : (
              <ul className="text-sm list-disc pl-5 space-y-2">
                {exemplarsForTop.map((e) => (
                  <li key={e.company} className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{e.company}:</span>
                    <span className="text-muted-foreground">{e.notes}</span>
                    {e.sourceUrl && (
                      <a
                        href={e.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-primary underline text-xs"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        Case study
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Related frameworks in same family */}
          <div className="pt-4 border-t border-white/10 dark:border-gray-800">
            <h3 className="text-sm font-semibold mb-2">
              Related frameworks in the same family
            </h3>
            <p className="text-xs text-muted-foreground mb-2">
              These organizations use closely related frameworks with similar KPI
              focus areas.
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1">
              {exemplarsForFamily.map((e) => (
                <li key={`${e.company}-${e.methodology}`}>
                  <span className="font-medium">{e.company}</span>{" "}
                  <span className="italic text-xs text-muted-foreground">
                    ({e.methodology})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            SectorSync highlights the KPIs that matter most for your recommended
            framework and shows who else uses similar ways of working.
          </p>
        </div>
      </div>
    </div>
  );
}
