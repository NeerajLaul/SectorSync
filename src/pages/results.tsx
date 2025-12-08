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

/* map method -> video id (swap these with your picks) */
const METHOD_VIDEOS: Record<string, string> = {
  Scrum: "pcsLLgUb7_A", // https://www.youtube.com/watch?v=pcsLLgUb7_A
  SAFe: "aW2m-BtCJyE", // https://www.youtube.com/watch?v=aW2m-BtCJyE
  "Disciplined Agile": "Giu5wIdCaLI", // https://www.youtube.com/watch?v=Giu5wIdCaLI
  Agile: "Z9QbYZh1YXY", // https://www.youtube.com/watch?v=Z9QbYZh1YXY&t=524s
  Hybrid: "bLZ9MNwV2vE", // https://www.youtube.com/watch?v=bLZ9MNwV2vE
  "Lean Continuous Delivery": "tQMrrNo16jo", // mapped to same main CD video
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
}

/* --- lightweight meta for percentile & confidence --- */
const useScoresMeta = (ranking: ScoringResult["ranking"]) => {
  const scores = ranking.map((r) => r.score);
  const max = Math.max(...scores);
  const min = Math.min(...scores);
  const range = Math.max(1e-9, max - min);
  const normalize = (s: number) => ((s - min) / range) * 100;

  // confidence = separation of #1 vs #2 relative to spread
  const sorted = [...scores].sort((a, b) => b - a);
  const sep = sorted.length > 1 ? sorted[0] - sorted[1] : 0;
  const confidence = Math.round(
    Math.min(100, Math.max(0, (sep / range) * 100)),
  );
  const percentile = (s: number) => Math.round(normalize(s));

  return { normalize, percentile,
