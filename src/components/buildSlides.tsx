// components/buildSlides.tsx
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Trophy, BarChart3 } from "lucide-react";
import { ScoringResult } from "../utils/scoringEngine";

/* --- Video Embed (same behavior as ResultsPage) --- */
const YouTubeEmbed = ({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) => {
  if (!videoId) return null;
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        className="absolute left-0 top-0 h-full w-full rounded-2xl"
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

/* --- Method data (mirrors ResultsPage, with CD naming compatibility) --- */
const METHOD_VIDEOS: Record<string, string> = {
  Scrum: "pcsLLgUb7_A", // https://www.youtube.com/watch?v=pcsLLgUb7_A
  SAFe: "aW2m-BtCJyE", // https://www.youtube.com/watch?v=aW2m-BtCJyE
  "Disciplined Agile": "Giu5wIdCaLI", // https://www.youtube.com/watch?v=Giu5wIdCaLI
  Agile: "Z9QbYZh1YXY", // https://www.youtube.com/watch?v=Z9QbYZh1YXY&t=524s
  Hybrid: "bLZ9MNwV2vE", // https://www.youtube.com/watch?v=bLZ9MNwV2vE
  "Lean Continuous Delivery": "tQMrrNo16jo",
  "Continuous Delivery": "tQMrrNo16jo", // alias for compatibility with BenchmarkPage
  "Lean Six Sigma": "wfsRAZUnonI", // https://www.youtube.com/watch?v=wfsRAZUnonI
  Waterfall: "W4lE6ozdjls", // https://www.youtube.com/watch?v=W4lE6ozdjls
  PRINCE2: "bsIvbr0we8w", // https://www.youtube.com/watch?v=bsIvbr0we8w&t=57s
};

const METHOD_DESCRIPTIONS: Record<string, string> = {
  Scrum:
    "Agile framework emphasizing iterative development, self-organizing teams, and continuous improvement through sprints.",
  SAFe:
    "Scaled Agile Framework designed for large enterprises to implement agile practices across multiple teams.",
  Hybrid:
    "Combines traditional and agile approaches, allowing flexibility to adapt to different project phases.",
  Waterfall:
    "Sequential development approach with distinct phases, best for projects with well-defined requirements.",
  "Lean Six Sigma":
    "Process improvement methodology focused on reducing waste and variation while maximizing value.",
  PRINCE2:
    "Structured project management method emphasizing organization, control, and defined roles throughout the project.",
  "Disciplined Agile":
    "Hybrid toolkit that provides guidance for choosing the right approach for your specific context.",
  "Lean Continuous Delivery":
    "Software development practice where code changes are automatically built, tested, and deployed.",
  "Continuous Delivery":
    "Software development practice where code changes are automatically built, tested, and deployed.", // alias
};

/* --- Framework-specific Quick Insights (same as ResultsPage, with CD alias) --- */
const METHOD_QUICK_INSIGHTS: Record<
  string,
  { why: string[]; watchouts: string[] }
> = {
  Scrum: {
    why: [
      "Works well when requirements evolve and you need fast feedback cycles.",
      "Highly effective for small to medium teams that benefit from continuous collaboration and iterative delivery.",
    ],
    watchouts: [
      "Requires strong team discipline and consistent stakeholder availability.",
      "Can struggle in environments with rigid governance or low customer involvement.",
    ],
  },
  SAFe: {
    why: [
      "Ideal for large, complex, multi-team initiatives requiring alignment across an organization.",
      "Provides structured planning, governance, and coordination while retaining Agile adaptability.",
    ],
    watchouts: [
      "Implementation can be heavy and resource-intensive.",
      "Requires significant training, cultural change, and leadership support to work effectively.",
    ],
  },
  "Disciplined Agile": {
    why: [
      "Offers flexibility for teams that need to tailor practices across Agile, Lean, and traditional methods.",
      "Fits organizations seeking guided decision-making while retaining team autonomy.",
    ],
    watchouts: [
      "Can overwhelm inexperienced teams due to its wide range of options.",
      "Requires strong coaching to prevent inconsistent or poorly integrated practices.",
    ],
  },
  Hybrid: {
    why: [
      "Works when you need upfront structure but still want iterative refinement in development phases.",
      "Fits organizations transitioning from predictive models to more agile or iterative ways of working.",
    ],
    watchouts: [
      "At risk of becoming 'waterfall with extra steps' if iterations aren’t meaningful.",
      "Requires clear boundaries to avoid confusion between iterative and sequential phases.",
    ],
  },
  "Lean Continuous Delivery": {
    why: [
      "Excellent for teams that prioritize rapid releases, automation, and continuous customer value delivery.",
      "Works best when integration, testing, and deployment pipelines are mature.",
    ],
    watchouts: [
      "Requires strong DevOps culture and robust engineering automation.",
      "Can overwhelm teams without stable environments or dedicated infrastructure support.",
    ],
  },
  "Continuous Delivery": {
    why: [
      "Excellent for teams that prioritize rapid releases, automation, and continuous customer value delivery.",
      "Works best when integration, testing, and deployment pipelines are mature.",
    ],
    watchouts: [
      "Requires strong DevOps culture and robust engineering automation.",
      "Can overwhelm teams without stable environments or dedicated infrastructure support.",
    ],
  },
  "Lean Six Sigma": {
    why: [
      "Effective for projects that require precision, quality control, and reduction of process variation.",
      "Works well in highly regulated or data-driven environments where defects have major impact.",
    ],
    watchouts: [
      "Can be slow and documentation-heavy for fast-moving or exploratory work.",
      "Not suited for high-uncertainty environments requiring creativity or rapid adaptation.",
    ],
  },
  Waterfall: {
    why: [
      "Best when requirements are fixed, stable, and well-understood from the beginning.",
      "Strong fit for projects requiring extensive upfront documentation and formal approvals.",
    ],
    watchouts: [
      "Difficult to adapt if requirements change mid-project.",
      "Limited customer feedback early on increases the risk of late-stage surprises.",
    ],
  },
  PRINCE2: {
    why: [
      "Ideal for organizations needing strong governance, roles, and stage-based control.",
      "Works well for large projects with significant oversight and documentation requirements.",
    ],
    watchouts: [
      "Can be overly rigid for teams needing creative or iterative delivery.",
      "Requires trained project roles and disciplined adherence to governance events.",
    ],
  },
};

/* --- score meta (same logic as useScoresMeta, but non-hook for slides) --- */
function getScoresMeta(ranking: ScoringResult["ranking"]) {
  const scores = ranking.map((r) => r.score);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = Math.max(1e-9, max - min);

  const normalize = (s: number) => ((s - min) / range) * 100;

  const sorted = [...scores].sort((a, b) => b - a);
  const sep = sorted.length > 1 ? sorted[0] - sorted[1] : 0;

  const confidence = Math.round(
    Math.min(100, Math.max(0, (sep / range) * 100)),
  );

  const percentile = (s: number) => Math.round(normalize(s));

  return { normalize, percentile, confidence };
}

/* --- Slides builder: mirror ResultsPage content --- */
export function buildSlides(
  results: ScoringResult,
  opts?: { onOpenBenchmark?: () => void },
) {
  const ranking = results.ranking ?? [];
  const top = ranking[0];
  if (!top) return [];

  const { normalize, percentile, confidence } = getScoresMeta(ranking);

  const secondary = [ranking[1], ranking[2]].filter(Boolean) as {
    method: string;
    score: number;
  }[];

  const methodInsights =
    METHOD_QUICK_INSIGHTS[top.method] ?? {
      why: [
        "This framework aligns well with your project's size, goals, and governance needs.",
      ],
      watchouts: [
        "Be mindful of the cultural and tooling changes needed to apply this framework effectively.",
      ],
    };

  return [
    // Slide 1 — Hero / Top Match (matches top banner of ResultsPage)
    <div key="hero" className="py-12">
      <Card className="p-10 md:p-12">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex flex-col items-center md:items-start gap-3">
            <span className="bg-yellow-400 p-3 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-900" />
            </span>
            <Badge className="bg-green-600">Top Match</Badge>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">
                {top.method}
              </h1>
              <p className="mt-3 text-muted-foreground max-w-3xl">
                {METHOD_DESCRIPTIONS[top.method] ?? "No description available."}
              </p>
            </div>

            {/* At a glance: score, percentile, confidence */}
            <div className="mt-4 grid md:grid-cols-3 gap-4 max-w-3xl">
              <div className="rounded-xl border border-border/50 p-3">
                <div className="text-xs text-muted-foreground">Top score</div>
                <div className="text-lg font-semibold">
                  {top.score.toFixed(2)}
                </div>
              </div>
              <div className="rounded-xl border border-border/50 p-3">
                <div className="text-xs text-muted-foreground">Percentile</div>
                <div className="text-lg font-semibold">
                  {percentile(top.score)}%
                </div>
                <Progress className="mt-2 h-2" value={percentile(top.score)} />
              </div>
              <div className="rounded-xl border border-border/50 p-3">
                <div className="text-xs text-muted-foreground">Confidence</div>
                <div className="text-lg font-semibold">{confidence}%</div>
                <Progress className="mt-2 h-2" value={confidence} />
              </div>
            </div>

            <p className="pt-4 text-xs text-muted-foreground">
              Engine Version: {results.engineVersion} · Recommendations are
              guidance — apply judgment for your context.
            </p>
          </div>
        </div>
      </Card>
    </div>,

    // Slide 2 — Overview Video + Quick Insights (matches middle row)
    <div key="video-insights" className="py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Overview Video */}
        <Card className="p-6 h-full flex flex-col">
          <h3 className="text-lg font-medium mb-3">Overview Video</h3>
          {METHOD_VIDEOS[top.method] ? (
            <YouTubeEmbed
              videoId={METHOD_VIDEOS[top.method]}
              title={`${top.method} overview`}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              No video configured for {top.method}.
            </div>
          )}
        </Card>

        {/* Quick Insights */}
        <Card className="p-6 h-full flex flex-col">
          <h3 className="text-lg font-medium mb-3">Quick Insights</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Why it fits</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {methodInsights.why.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Watch outs</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {methodInsights.watchouts.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>,

    // Slide 3 — Secondary Options (matches Secondary Options section)
    <div key="alts" className="py-10">
      <h3 className="text-2xl font-semibold mb-4 text-center">
        Secondary Options
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {secondary.map((opt, i) => (
          <Card key={opt.method} className="p-8">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-2xl font-semibold">{opt.method}</h4>
              <div className="flex items-center gap-2">
                {Math.abs(
                  percentile(opt.score) - percentile(top.score),
                ) <= 3 && <Badge variant="outline">Very close</Badge>}
                <Badge variant="secondary">Alt #{i + 2}</Badge>
              </div>
            </div>
            <p className="text-muted-foreground mt-3">
              {METHOD_DESCRIPTIONS[opt.method] ?? "No description available."}
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                <span>Relative match</span>
                <span>{percentile(opt.score)}%</span>
              </div>
              <Progress className="h-2" value={normalize(opt.score)} />
            </div>
          </Card>
        ))}
      </div>
    </div>,

    // Slide 4 — Framework KPI Benchmark (matches bottom-left tile + Benchmark intent)
    <div key="bench" className="py-10">
      <Card className="p-10 text-center max-w-xl mx-auto">
        <h3 className="text-3xl font-semibold mb-3">
          Framework KPI Benchmark
        </h3>
        <p className="text-muted-foreground mb-6">
          Explore how this framework is used across key industries, the metrics
          that matter most, and the organizations that exemplify it in
          real-world delivery. Use the Benchmark view to drill into pillars,
          example KPIs, and who else works this way.
        </p>
        <Button
          size="lg"
          onClick={opts?.onOpenBenchmark}
          disabled={!opts?.onOpenBenchmark}
        >
          <BarChart3 className="h-5 w-5 mr-2" />
          View Benchmark
        </Button>
      </Card>
    </div>,
  ];
}
