// src/components/PitchResults.tsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Trophy,
  BarChart3,
  Play,
} from "lucide-react";
import { ScoringResult } from "../utils/scoringEngine";

/* ---- Swap these with your preferred IDs/descriptions if needed ---- */
const METHOD_VIDEOS: Record<string, string> = {
  Scrum: "9TycLR0TqFA",
  SAFe: "R9EJfYw3n9A",
  Hybrid: "xq4Y87idawk",
  Waterfall: "v3nB2K3r0l4",
  "Lean Six Sigma": "2B1Xp0wwo2U",
  PRINCE2: "oQkT3l8r6OQ",
  "Disciplined Agile": "4y9l0o7i8vA",
  "Continuous Delivery": "v4cQdP4B4Ws",
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
  "Continuous Delivery":
    "Software development practice where code changes are automatically built, tested, and deployed.",
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

export function PitchResults({
  results,
  onExit,
  onOpenBenchmark,
  autoAdvanceMs,
}: {
  results: ScoringResult;
  onExit: () => void;
  onOpenBenchmark?: () => void;
  autoAdvanceMs?: number; // optional auto-advance interval in ms
}) {
  const ranking = results.ranking ?? [];
  const top = ranking[0];
  const [idx, setIdx] = useState(0);

  const slides = useMemo(() => {
    if (!top) return [];
    const positives = [...top.contributions]
      .filter((c) => c.delta > 0)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 3)
      .map((c) => c.factor.replace(/_/g, " "));
    const negatives = [...top.contributions]
      .filter((c) => c.delta < 0)
      .sort((a, b) => a.delta - b.delta)
      .slice(0, 3)
      .map((c) => c.factor.replace(/_/g, " "));
    const sec = [ranking[1], ranking[2]].filter(Boolean) as typeof ranking;

    return [
      // Slide 0: Hero
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
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
          {METHOD_DESCRIPTIONS[top.method] ?? ""}
        </p>
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

      // Slide 2: Quick insights
      <div key="insights" className="grid md:grid-cols-2 gap-8 max-w-6xl w-full">
        <Card className="p-8">
          <h3 className="text-2xl font-semibold mb-3">Why it fits</h3>
          <ul className="list-disc list-inside text-lg text-muted-foreground space-y-2">
            {positives.length ? (
              positives.map((p) => <li key={p}>{p}</li>)
            ) : (
              <li>—</li>
            )}
          </ul>
        </Card>
        <Card className="p-8">
          <h3 className="text-2xl font-semibold mb-3">Watch outs</h3>
          <ul className="list-disc list-inside text-lg text-muted-foreground space-y-2">
            {negatives.length ? (
              negatives.map((n) => <li key={n}>{n}</li>)
            ) : (
              <li>—</li>
            )}
          </ul>
        </Card>
      </div>,

      // Slide 3: #2 / #3
      <div key="alts" className="max-w-6xl w-full">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Secondary Options
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {sec.map((opt, i) => (
            <Card key={opt.method} className="p-8">
              <div className="flex items-start justify-between">
                <h4 className="text-2xl font-semibold">{opt.method}</h4>
                <Badge variant="secondary">Alt #{i + 2}</Badge>
              </div>
              <p className="text-muted-foreground mt-3">
                {METHOD_DESCRIPTIONS[opt.method] ?? ""}
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                  <span>Relative match</span>
                  <span>{opt.score.toFixed(2)}</span>
                </div>
                <Progress
                  value={100 * (opt.score / Math.max(top.score, 1e-9))}
                  className="h-2"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>,

      // Slide 4: Benchmark CTA
      <div key="bench" className="max-w-xl w-full mx-auto">
        <Card className="p-10 text-center">
          <h3 className="text-3xl font-semibold mb-3">Industry Benchmark</h3>
          <p className="text-muted-foreground mb-6">
            Compare your organization to leading peers: cadence, governance,
            sourcing, and delivery patterns.
          </p>
          <Button
            size="lg"
            onClick={onOpenBenchmark}
            disabled={!onOpenBenchmark}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            View Benchmark
          </Button>
        </Card>
      </div>,
    ];
  }, [ranking, onOpenBenchmark]);

  const total = slides.length;

  // Slide navigation
  const next = useCallback(
    () => setIdx((i) => Math.min(i + 1, total - 1)),
    [total]
  );
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

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
    const t = setInterval(() => setIdx((i) => (i + 1) % total), autoAdvanceMs);
    return () => clearInterval(t);
  }, [autoAdvanceMs, total]);

  // Best-effort fullscreen on mount
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  if (!top) return null;

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
        {idx === 1 && METHOD_VIDEOS[ranking[0].method] && (
          <span className="inline-flex items-center gap-2 text-xs opacity-80">
            <Play className="h-4 w-4" /> Space / → to advance
          </span>
        )}
      </div>
    </div>
  );
}
