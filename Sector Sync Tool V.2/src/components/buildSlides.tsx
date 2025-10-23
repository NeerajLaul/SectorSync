// components/buildSlides.tsx
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Trophy, BarChart3 } from "lucide-react";
import { ScoringResult } from "../utils/scoringEngine";

/* --- Video Embed --- */
const YouTubeEmbed = ({ videoId, title }: { videoId: string; title: string }) => {
  if (!videoId) return null;
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ paddingBottom: "56.25%" }}>
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

/* --- Method data (reuse your same descriptions/videos) --- */
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
  Scrum: "Agile framework emphasizing iterative development, self-organizing teams, and continuous improvement through sprints.",
  SAFe: "Scaled Agile Framework designed for large enterprises to implement agile practices across multiple teams.",
  Hybrid: "Combines traditional and agile approaches, allowing flexibility to adapt to different project phases.",
  Waterfall: "Sequential development approach with distinct phases, best for projects with well-defined requirements.",
  "Lean Six Sigma": "Process improvement methodology focused on reducing waste and variation while maximizing value.",
  PRINCE2: "Structured project management method emphasizing organization, control, and defined roles throughout the project.",
  "Disciplined Agile": "Hybrid toolkit that provides guidance for choosing the right approach for your specific context.",
  "Continuous Delivery": "Software development practice where code changes are automatically built, tested, and deployed.",
};

export function buildSlides(results: ScoringResult, opts?: { onOpenBenchmark?: () => void }) {
  const ranking = results.ranking ?? [];
  const top = ranking[0];
  if (!top) return [];

  const positives = [...top.contributions].filter(c => c.delta > 0).sort((a,b)=>b.delta-a.delta).slice(0,3).map(c=>c.factor.replace(/_/g," "));
  const negatives = [...top.contributions].filter(c => c.delta < 0).sort((a,b)=>a.delta-b.delta).slice(0,3).map(c=>c.factor.replace(/_/g," "));
  const secondary = [ranking[1], ranking[2]].filter(Boolean);

  return [
    // Slide 1
    <div key="hero" className="flex flex-col items-center text-center py-12">
      <div className="flex items-center gap-3 mb-5">
        <span className="bg-yellow-400 p-3 rounded-full">
          <Trophy className="h-8 w-8 text-yellow-900" />
        </span>
        <Badge className="bg-green-600">Top Match</Badge>
      </div>
      <h1 className="text-4xl font-semibold mb-3">{top.method}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl">{METHOD_DESCRIPTIONS[top.method]}</p>
    </div>,

    // Slide 2
    <div key="video" className="py-10">
      {METHOD_VIDEOS[top.method] ? (
        <YouTubeEmbed videoId={METHOD_VIDEOS[top.method]} title={`${top.method} overview`} />
      ) : (
        <Card className="p-8 text-center">No video configured for {top.method}.</Card>
      )}
    </div>,

    // Slide 3
    <div key="insights" className="grid md:grid-cols-2 gap-8 py-10">
      <Card className="p-8">
        <h3 className="text-2xl font-semibold mb-3">Why it fits</h3>
        <ul className="list-disc list-inside text-lg text-muted-foreground space-y-2">
          {positives.length ? positives.map(p => <li key={p}>{p}</li>) : <li>—</li>}
        </ul>
      </Card>
      <Card className="p-8">
        <h3 className="text-2xl font-semibold mb-3">Watch outs</h3>
        <ul className="list-disc list-inside text-lg text-muted-foreground space-y-2">
          {negatives.length ? negatives.map(n => <li key={n}>{n}</li>) : <li>—</li>}
        </ul>
      </Card>
    </div>,

    // Slide 4
    <div key="alts" className="py-10">
      <h3 className="text-2xl font-semibold mb-4 text-center">Secondary Options</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {secondary.map((opt, i) => (
          <Card key={opt.method} className="p-8">
            <div className="flex items-start justify-between">
              <h4 className="text-2xl font-semibold">{opt.method}</h4>
              <Badge variant="secondary">Alt #{i + 2}</Badge>
            </div>
            <p className="text-muted-foreground mt-3">{METHOD_DESCRIPTIONS[opt.method]}</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                <span>Relative match</span>
                <span>{opt.score.toFixed(2)}</span>
              </div>
              <Progress value={100 * (opt.score / Math.max(top.score, 1e-9))} className="h-2" />
            </div>
          </Card>
        ))}
      </div>
    </div>,

    // Slide 5
    <div key="bench" className="py-10">
      <Card className="p-10 text-center max-w-xl mx-auto">
        <h3 className="text-3xl font-semibold mb-3">Industry Benchmark</h3>
        <p className="text-muted-foreground mb-6">
          Compare your organization to leading peers: cadence, governance, sourcing, and delivery patterns.
        </p>
        <Button size="lg" onClick={opts?.onOpenBenchmark} disabled={!opts?.onOpenBenchmark}>
          <BarChart3 className="h-5 w-5 mr-2" />
          View Benchmark
        </Button>
      </Card>
    </div>,
  ];
}
