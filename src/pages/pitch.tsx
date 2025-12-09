// src/pages/pitch.tsx
import {
  useEffect,
  useMemo,
  useState,
  useCallback,
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
  Play,
  Factory,
  Building2,
} from "lucide-react";
import { ScoringResult } from "../utils/scoringEngine";

/* ---- Charts ---- */
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart as ReBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";

/* ---- Video & copy (aligned with ResultsPage / Print Deck) ---- */
const METHOD_VIDEOS: Record<string, string> = {
  Scrum: "pcsLLgUb7_A", // https://www.youtube.com/watch?v=pcsLLgUb7_A
  SAFe: "aW2m-BtCJyE", // https://www.youtube.com/watch?v=pcsLLgUb7_A
  "Disciplined Agile": "Giu5wIdCaLI", // https://www.youtube.com/watch?v=Giu5wIdCaLI
  Agile: "Z9QbYZh1YXY", // https://www.youtube.com/watch?v=Z9QbYZh1YXY&t=524s
  Hybrid: "bLZ9MNwV2vE", // https://www.youtube.com/watch?v=bLZ9MNwV2vE
  "Lean Continuous Delivery": "tQMrrNo16jo",
  "Continuous Delivery": "tQMrrNo16jo", // alias for consistency
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

/* --- Framework-specific Quick Insights (same as ResultsPage / Print Deck) --- */
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

/* ---- Privacy-friendly responsive YouTube embed ---- */
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

/* ---------------- Benchmark helpers (inline, no external page required) ---------------- */

const RADAR_AXES = [
  { key: "cadence", label: "Cadence" },
  { key: "governance", label: "Governance" },
  { key: "alignment", label: "Alignment" },
  { key: "automation", label: "Automation" },
  { key: "outsourcing", label: "Outsourcing" },
  { key: "documentation", label: "Docs" },
] as const;
type AxisKey = (typeof RADAR_AXES)[number]["key"];

type PeerRecord = {
  peerSet: "All" | "Enterprise" | "Scale-up" | "Startup";
  industry: "All" | "SaaS" | "FinTech" | "Healthcare" | "Gov";
  cadence: number;
  governance: number;
  alignment: number;
  automation: number;
  outsourcing: number;
  documentation: number;
  releasePerWeek: number;
  hotfixMedianHrs: number;
};

// Lightweight mocked peers (replace with your live aggregates when ready)
const PEER_BENCHMARK: PeerRecord[] = [
  {
    peerSet: "All",
    industry: "All",
    cadence: 62,
    governance: 58,
    alignment: 60,
    automation: 66,
    outsourcing: 40,
    documentation: 55,
    releasePerWeek: 3.1,
    hotfixMedianHrs: 16,
  },
  {
    peerSet: "Enterprise",
    industry: "All",
    cadence: 55,
    governance: 72,
    alignment: 64,
    automation: 61,
    outsourcing: 52,
    documentation: 68,
    releasePerWeek: 1.2,
    hotfixMedianHrs: 26,
  },
  {
    peerSet: "Scale-up",
    industry: "All",
    cadence: 67,
    governance: 54,
    alignment: 62,
    automation: 70,
    outsourcing: 38,
    documentation: 52,
    releasePerWeek: 4.5,
    hotfixMedianHrs: 14,
  },
  {
    peerSet: "Startup",
    industry: "All",
    cadence: 74,
    governance: 40,
    alignment: 56,
    automation: 63,
    outsourcing: 22,
    documentation: 35,
    releasePerWeek: 6.7,
    hotfixMedianHrs: 9,
  },

  {
    peerSet: "All",
    industry: "SaaS",
    cadence: 68,
    governance: 56,
    alignment: 63,
    automation: 73,
    outsourcing: 33,
    documentation: 50,
    releasePerWeek: 5.2,
    hotfixMedianHrs: 12,
  },
  {
    peerSet: "All",
    industry: "FinTech",
    cadence: 58,
    governance: 70,
    alignment: 66,
    automation: 64,
    outsourcing: 42,
    documentation: 69,
    releasePerWeek: 2.0,
    hotfixMedianHrs: 19,
  },
  {
    peerSet: "All",
    industry: "Healthcare",
    cadence: 52,
    governance: 74,
    alignment: 61,
    automation: 58,
    outsourcing: 46,
    documentation: 72,
    releasePerWeek: 1.5,
    hotfixMedianHrs: 28,
  },
  {
    peerSet: "All",
    industry: "Gov",
    cadence: 41,
    governance: 80,
    alignment: 57,
    automation: 44,
    outsourcing: 55,
    documentation: 78,
    releasePerWeek: 0.6,
    hotfixMedianHrs: 45,
  },
];

// Derive a company profile vector from top-method contributions (placeholder heuristic)
function deriveCompanyVector(result: ScoringResult) {
  const seed: Record<AxisKey, number> = {
    cadence: 50,
    governance: 50,
    alignment: 50,
    automation: 50,
    outsourcing: 50,
    documentation: 50,
  };

  const map: Partial<Record<string, AxisKey>> = {
    release_cadence: "cadence",
    governance_rigor: "governance",
    stakeholder_alignment: "alignment",
    ci_cd_maturity: "automation",
    vendor_outsourcing: "outsourcing",
    documentation_depth: "documentation",
  };

  result.ranking[0]?.contributions.forEach((c) => {
    const axis = map[c.factor];
    if (!axis) return;
    seed[axis] = Math.min(
      100,
      Math.max(0, seed[axis] + c.delta * 20),
    ); // scale factor
  });

  const releasePerWeek = Math.max(
    0.2,
    (seed.cadence / 100) * 7,
  );
  const hotfixMedianHrs = Math.max(
    4,
    48 - (seed.automation / 100) * 40,
  );

  return { axes: seed, releasePerWeek, hotfixMedianHrs };
}

/* --- score meta (aligned with ResultsPage / Print Deck) --- */
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

/* -------------------------------- Component -------------------------------- */

interface PitchPageProps {
  results: ScoringResult;
  onExit: () => void;
  autoAdvanceMs?: number; // optional auto-advance interval in ms
}

export function PitchPage({
  results,
  onExit,
  autoAdvanceMs,
}: PitchPageProps) {
  const ranking = results.ranking ?? [];
  const top = ranking[0];
  const [idx, setIdx] = useState(0);

  if (!top) return null;

  const { normalize, percentile, confidence } = getScoresMeta(ranking);

  // Choose a default peer view for pitch (simple & neutral)
  const peer =
    PEER_BENCHMARK.find(
      (r) => r.peerSet === "All" && r.industry === "All",
    ) ?? PEER_BENCHMARK[0];
  const ours = useMemo(
    () => deriveCompanyVector(results),
    [results],
  );

  const radarData = useMemo(
    () =>
      RADAR_AXES.map(({ key, label }) => ({
        axis: label,
        You: ours.axes[key],
        Peers: peer[key],
      })),
    [ours, peer],
  );

  const cadenceBars = useMemo(
    () => [
      {
        name: "Releases / week",
        You: Number(ours.releasePerWeek.toFixed(2)),
        Peers: peer.releasePerWeek,
      },
      {
        name: "Hotfix median (hrs)",
        You: Number(ours.hotfixMedianHrs.toFixed(1)),
        Peers: peer.hotfixMedianHrs,
      },
    ],
    [ours, peer],
  );

  const slides = useMemo(() => {
    if (!top) return [];

    const sec = [ranking[1], ranking[2]].filter(
      Boolean,
    ) as typeof ranking;

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
      // Slide 0: Hero (now also shows score/percentile/confidence like ResultsPage)
      <div
        key="hero"
        className="flex flex-col items-center justify-center h-full text-center"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-flex items-center rounded-xl bg-yellow-400/90 p-3">
            <Trophy className="h-8 w-8 text-yellow-900" />
          </span>
          <Badge className="bg-green-600">Top Match</Badge>
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold mb-4">
          {top.method}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-6">
          {METHOD_DESCRIPTIONS[top.method] ?? ""}
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-xl w-full text-sm">
          <div className="rounded-xl border border-white/30 p-3">
            <div className="text-xs opacity-70 mb-1">Top score</div>
            <div className="text-lg font-semibold">
              {top.score.toFixed(2)}
            </div>
          </div>
          <div className="rounded-xl border border-white/30 p-3">
            <div className="text-xs opacity-70 mb-1">Percentile</div>
            <div className="text-lg font-semibold">
              {percentile(top.score)}%
            </div>
            <Progress
              className="mt-2 h-2"
              value={percentile(top.score)}
            />
          </div>
          <div className="rounded-xl border border-white/30 p-3">
            <div className="text-xs opacity-70 mb-1">Confidence</div>
            <div className="text-lg font-semibold">
              {confidence}%
            </div>
            <Progress className="mt-2 h-2" value={confidence} />
          </div>
        </div>
      </div>,

      // Slide 1: Video
      <div key="video" className="max-w-5xl mx-auto w-full">
        {METHOD_VIDEOS[top.method] ? (
          <YouTubeEmbed
            videoId={METHOD_VIDEOS[top.method]}
            title={`${top.method} overview`}
          />
        ) : (
          <Card className="p-8 text-center">
            No video configured for {top.method}.
          </Card>
        )}
      </div>,

      // Slide 2: Quick insights (now uses METHOD_QUICK_INSIGHTS like Results/Print Deck)
      <div
        key="insights"
        className="grid md:grid-cols-2 gap-8 max-w-6xl w-full"
      >
        <Card className="p-8">
          <h3 className="text-2xl font-semibold mb-3">
            Why it fits
          </h3>
          <ul className="list-disc list-inside text-lg text-muted-foreground space-y-2">
            {methodInsights.why.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-8">
          <h3 className="text-2xl font-semibold mb-3">
            Watch outs
          </h3>
          <ul className="list-disc list-inside text-lg text-muted-foreground space-y-2">
            {methodInsights.watchouts.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </Card>
      </div>,

      // Slide 3: #2 / #3 (aligned with ResultsPage relative match logic)
      <div key="alts" className="max-w-6xl w-full">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Secondary Options
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {sec.map((opt, i) => (
            <Card key={opt.method} className="p-8">
              <div className="flex items-start justify-between">
                <h4 className="text-2xl font-semibold">
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
              <p className="text-muted-foreground mt-3">
                {METHOD_DESCRIPTIONS[opt.method] ?? ""}
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                  <span>Relative match</span>
                  <span>{percentile(opt.score)}%</span>
                </div>
                <Progress
                  value={normalize(opt.score)}
                  className="h-2"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>,

      // Slide 4: Benchmark — Radar + Bars (inline)
      <div key="bench-charts" className="max-w-6xl w-full">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Industry Benchmark
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Factory className="h-5 w-5" />
              <h4 className="text-lg font-semibold">
                Operating Profile
              </h4>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="axis" />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                  />
                  <Radar
                    name="You"
                    dataKey="You"
                    stroke="#60a5fa"
                    fill="#60a5fa"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="Peers"
                    dataKey="Peers"
                    stroke="#34d399"
                    fill="#34d399"
                    fillOpacity={0.3}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5" />
              <h4 className="text-lg font-semibold">
                Delivery Cadence
              </h4>
            </div>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={cadenceBars}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="You" />
                  <Bar dataKey="Peers" />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>,

      // Slide 5: Benchmark — Comparison Grid (inline)
      <div key="bench-cards" className="max-w-6xl w-full">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          At a Glance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-base">
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">
              Governance
            </div>
            <div className="font-medium">
              You: {Math.round(ours.axes.governance)} / 100
            </div>
            <div className="text-muted-foreground">
              Peers: {peer.governance} / 100
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">
              Automation
            </div>
            <div className="font-medium">
              You: {Math.round(ours.axes.automation)} / 100
            </div>
            <div className="text-muted-foreground">
              Peers: {peer.automation} / 100
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">
              Outsourcing
            </div>
            <div className="font-medium">
              You: {Math.round(ours.axes.outsourcing)} / 100
            </div>
            <div className="text-muted-foreground">
              Peers: {peer.outsourcing} / 100
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">
              Alignment
            </div>
            <div className="font-medium">
              You: {Math.round(ours.axes.alignment)} / 100
            </div>
            <div className="text-muted-foreground">
              Peers: {peer.alignment} / 100
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">
              Documentation
            </div>
            <div className="font-medium">
              You: {Math.round(ours.axes.documentation)} / 100
            </div>
            <div className="text-muted-foreground">
              Peers: {peer.documentation} / 100
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-xs text-muted-foreground mb-1">
              Cadence
            </div>
            <div className="font-medium">
              Releases/wk: {ours.releasePerWeek.toFixed(1)}{" "}
              (You)
            </div>
            <div className="text-muted-foreground">
              Peers: {peer.releasePerWeek.toFixed(1)}
            </div>
          </Card>
        </div>
      </div>,
    ];
  }, [ranking, top, percentile, confidence, normalize, radarData, cadenceBars, ours, peer]);

  const total = slides.length;

  // Slide navigation
  const next = useCallback(
    () => setIdx((i) => Math.min(i + 1, total - 1)),
    [total],
  );
  const prev = useCallback(
    () => setIdx((i) => Math.max(i - 1, 0)),
    [],
  );

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
      if (e.key === "ArrowRight" || e.code === "Space") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onExit]);

  // Optional auto-advance
  useEffect(() => {
    if (!autoAdvanceMs) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % total),
      autoAdvanceMs,
    );
    return () => clearInterval(t);
  }, [autoAdvanceMs, total]);

  // Best-effort fullscreen on mount
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen)
      el.requestFullscreen().catch(() => {});
    return () => {
      if (
        document.fullscreenElement &&
        document.exitFullscreen
      ) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3">
        <div className="text-sm opacity-80">Pitch Mode</div>
        <div className="flex items-center gap-2">
          <div className="text-xs opacity-70">
            {idx + 1} / {total}
          </div>
          <Button
            size="sm"
            variant="outline"
            className="text-white border-white/30"
            onClick={onExit}
          >
            <X className="h-4 w-4 mr-1" /> Exit
          </Button>
        </div>
      </div>

      {/* Slide viewport */}
      <div className="h-full w-full flex items-center justify-center px-6 md:px-12">
        <div className="w-full" style={{ maxWidth: 1280 }}>
          {slides[idx]}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3">
        <Button
          variant="outline"
          className="text-white border-white/30"
          onClick={prev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          className="bg-white text-black hover:bg-white/90"
          onClick={next}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        {idx === 1 &&
          (METHOD_VIDEOS[ranking[0].method] ?? false) && (
            <span className="inline-flex items-center gap-2 text-xs opacity-80">
              <Play className="h-4 w-4" /> Space / → to advance
            </span>
          )}
      </div>
    </div>
  );
}
