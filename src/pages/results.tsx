import { useMemo, useRef, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Trophy,
  Download,
  RefreshCw,
  BarChart3,
  Presentation,
  Printer,
} from "lucide-react";

interface ScoringResult {
  ranking: { method: string; score: number; contributions: any[] }[];
  engineVersion: string;
  answers?: Record<string, string>;
  restored?: boolean;
}

/* --- privacy-friendly responsive YouTube embed --- */
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
      className="relative w-full overflow-hidden rounded-xl"
      style={{ paddingBottom: "56.25%" }}
    >
      <iframe
        className="absolute left-0 top-0 h-full w-full rounded-xl"
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

/* map method -> video id */
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

/* --- Framework-specific Quick Insights --- */
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

interface ResultsPageProps {
  results: ScoringResult;
  onRestart: () => void;
  onOpenBenchmark?: () => void;
  onTweakAnswers?: () => void;
  onOpenPitch?: () => void;
  onOpenPrint?: () => void;
  resultId?: string | null;
  setResultId?: (id: string) => void;
  // ⬇️ ADDED THESE
  projectName?: string;
  projectDescription?: string;
}

/* --- lightweight meta for percentile & confidence --- */
const useScoresMeta = (ranking: ScoringResult["ranking"]) => {
  const scores = ranking.map((r) => r.score);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = Math.max(1e-9, max - min);

  const normalize = (s: number) => ((s - min) / range) * 100;

  // confidence = separation of #1 vs #2 relative to overall spread
  const sorted = [...scores].sort((a, b) => b - a);
  const sep = sorted.length > 1 ? sorted[0] - sorted[1] : 0;

  const confidence = Math.round(
    Math.min(100, Math.max(0, (sep / range) * 100)),
  );

  const percentile = (s: number) => Math.round(normalize(s));

  return { normalize, percentile, confidence };
};

function InteractiveCard({
  children,
  className = "",
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

    card.style.setProperty("--mouse-x", `${x}%`);
    card.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove}>
      <Card className={className}>{children}</Card>
    </div>
  );
}

export function ResultsPage({
  results,
  onRestart,
  onOpenBenchmark,
  onTweakAnswers,
  onOpenPitch,
  onOpenPrint,
  resultId,
  setResultId,
  // ⬇️ DESTRUCTURED HERE
  projectName,
  projectDescription,
}: ResultsPageProps) {
  const [copied, setCopied] = useState(false);
  const ranking = [...(results.ranking ?? [])].sort((a, b) => {
    const valA = typeof a.score === 'number' ? a.score : parseFloat(String(a.score || 0));
    const valB = typeof b.score === 'number' ? b.score : parseFloat(String(b.score || 0));
    return (valB || 0) - (valA || 0);
  });

  const top = ranking[0];

  useEffect(() => {
    if (!results || !results.ranking?.length || results.restored) return;

    fetch("https://sectorsync-production.up.railway.app/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: results.answers,
        results: results.ranking,
        // ⬇️ USING DIRECT VARIABLES (NOT props.)
        projectName: projectName,
        projectDescription: projectDescription,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Results saved:", data);
        if (data.id && typeof setResultId === "function") {
          setResultId(data.id);
        }
      })
      .catch((err) => console.error("❌ Save error:", err));
  }, [results, setResultId, projectName, projectDescription]);

  // safety
  if (!top) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="p-8 text-center max-w-lg">
          <h2 className="text-2xl font-semibold mb-2">No results yet</h2>
          <p className="text-muted-foreground mb-6">
            Start an assessment to see your tailored recommendations.
          </p>
          <Button onClick={onRestart}>Start Assessment</Button>
        </Card>
      </div>
    );
  }

  const { normalize, percentile, confidence } = useScoresMeta(ranking);

  // Framework-specific quick insights (fallback is generic)
  const methodInsights =
    METHOD_QUICK_INSIGHTS[top.method] ?? {
      why: [
        "This framework aligns well with your project's size, goals, and governance needs.",
      ],
      watchouts: [
        "Be mindful of the cultural and tooling changes needed to apply this framework effectively.",
      ],
    };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `sectorsync-results-${results.engineVersion}.json`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const rows: string[] = [];
    rows.push(["Method", "Score"].join(","));
    ranking.forEach((m) => {
      rows.push(
        [`"${m.method.replace(/"/g, '""')}"`, m.score.toFixed(4)].join(","),
      );
    });
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `sectorsync-results-${results.engineVersion}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen py-10 px-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30"></div>

      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="mx-auto w-full max-w-6xl space-y-6 relative z-10">
        {/* === TOP FULL-WIDTH BANNER === */}
        <InteractiveCard className="glass-strong p-8 md:p-10 border-white/20 dark:border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.01]">
          <div className="flex items-start gap-4">
            <div className="bg-yellow-400 p-3 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-900" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge className="bg-green-600">Top Match</Badge>
                <h1 className="text-3xl md:text-4xl font-semibold">
                  {top.method}
                </h1>
              </div>
              <p className="text-muted-foreground mt-3 max-w-3xl">
                {METHOD_DESCRIPTIONS[top.method] ?? "No description available."}
              </p>

              {/* At a glance (light data, no clutter) */}
              <div className="mt-5 grid grid-cols-3 gap-4 max-w-3xl">
                <div className="glass-card rounded-xl p-3 border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-xs text-muted-foreground">
                    Top score
                  </div>
                  <div className="text-lg font-semibold">
                    {top.score.toFixed(2)}
                  </div>
                </div>
                <div className="glass-card rounded-xl p-3 border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-xs text-muted-foreground">
                    Percentile
                  </div>
                  <div className="text-lg font-semibold">
                    {percentile(top.score)}%
                  </div>
                  <Progress
                    className="mt-2 h-2"
                    value={percentile(top.score)}
                  />
                </div>
                <div className="glass-card rounded-xl p-3 border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-105">
                  <div className="text-xs text-muted-foreground">
                    Confidence
                  </div>
                  <div className="text-lg font-semibold">{confidence}%</div>
                  <Progress className="mt-2 h-2" value={confidence} />
                </div>
              </div>
            </div>
          </div>
        </InteractiveCard>

        {/* === MIDDLE ROW: VIDEO (LEFT) + QUICK INSIGHTS (RIGHT) === */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Video */}
          <InteractiveCard className="glass-card p-5 md:p-6 border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-[1.01]">
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
          </InteractiveCard>

          {/* Right: Why it fits / Watch outs */}
          <InteractiveCard className="glass-card p-5 md:p-6 border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-[1.01]">
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
          </InteractiveCard>
        </div>

        {/* === SECONDARY OPTIONS: #2 and #3 === */}
        {ranking.length > 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Secondary Options</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[ranking[1], ranking[2]]
                .filter(Boolean)
                .map((opt, i) => (
                  <InteractiveCard
                    key={opt.method}
                    className="glass-card p-5 md:p-6 border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-xl font-semibold">
                        {opt.method}
                      </h4>
                      <div className="flex items-center gap-2">
                        {Math.abs(
                          percentile(opt.score) - percentile(top.score),
                        ) <= 3 && (
                            <Badge variant="outline">Very close</Badge>
                          )}
                        <Badge variant="secondary">Alt #{i + 2}</Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                      {METHOD_DESCRIPTIONS[opt.method] ??
                        "No description available."}
                    </p>

                    {/* tiny relative bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Relative match</span>
                        <span>{percentile(opt.score)}%</span>
                      </div>
                      <Progress
                        className="h-2"
                        value={normalize(opt.score)}
                      />
                    </div>
                  </InteractiveCard>
                ))}
            </div>
          </div>
        )}

        {/* === BOTTOM ROW: TWO TILES === */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Tile 1: Benchmark CTA */}
          <InteractiveCard className="glass-card p-6 flex flex-col justify-between h-full border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-[1.02]">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Framework KPI Benchmark
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Explore how this framework is used across key industries, the
                metrics that matter most, and the organizations that exemplify
                it in real-world delivery.
              </p>
            </div>
            <div>
              <Button
                size="lg"
                onClick={onOpenBenchmark}
                disabled={!onOpenBenchmark}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View Benchmark
              </Button>
            </div>
          </InteractiveCard>

          {/* Tile 2: Share & Export */}
          <InteractiveCard className="glass-card p-6 flex flex-col justify-between h-full border-white/20 dark:border-white/10 transition-all duration-300 hover:scale-[1.02] relative">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Share & Export
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Present, print, or save these results for your team.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 justify-items-stretch">
              {resultId && (
                <Button
                  variant="outline"
                  className="font-mono relative w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(resultId);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  Result ID: {resultId}
                </Button>
              )}

              {onOpenPitch && (
                <Button
                  variant="outline"
                  onClick={onOpenPitch}
                  className="w-full"
                >
                  <Presentation className="h-4 w-4 mr-2" />
                  Pitch Mode
                </Button>
              )}

              {onOpenPrint && (
                <Button
                  variant="outline"
                  onClick={onOpenPrint}
                  className="w-full"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Deck
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>

              <Button
                variant="outline"
                onClick={handleExportJSON}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>

              <Button
                variant="ghost"
                onClick={onRestart}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </InteractiveCard>
        </div>

        {/* Footer (centered across both cards) */}
        <div className="relative w-full mt-8">
          <p className="text-center text-sm text-muted-foreground">
            Engine Version: {results.engineVersion} · Recommendations are
            guidance — apply judgment for your context.
          </p>

          {copied && (
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-lg w-fit mx-auto text-center"
              style={{
                backgroundColor: "rgba(60, 60, 60, 0.9)",
                backdropFilter: "blur(8px)",
              }}
            >
              Result ID copied to clipboard
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
