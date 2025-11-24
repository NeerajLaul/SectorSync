/**
 * AssessmentDemo Component
 *
 * Quick 30-second interactive walkthrough of SectorSync's key features.
 * Includes synchronized captions showing key features.
 *
 * Features:
 * - Fast-paced flow: intro → 2 questions → results with all features
 * - Synchronized captions
 * - Shows top 3 results, benchmark, pitch mode, share/print
 *
 * @component
 * @example
 * <AssessmentDemo onStartRealAssessment={() => startAssessment()} />
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Share2,
  Printer,
  Presentation,
} from "lucide-react";

interface AssessmentDemoProps {
  /** Optional callback triggered when user clicks "Start Your Assessment" */
  onStartRealAssessment?: () => void;
}

// Shape of questions coming back from the backend
interface QuestionOption {
  id?: string;
  text?: string;
  value?: string;
}

interface Question {
  id?: string;
  question: string;
  description?: string;
  options: (string | QuestionOption)[];
}

// Quick demo - only show 2 answers we auto-select
const DEMO_ANSWERS = ["Small", "Speed"] as const;

// Caption script with timing
const CAPTION_SCRIPT = [
  {
    time: 0,
    text: "Welcome to SectorSync - your data-driven project management methodology advisor",
    duration: 4,
  },
  {
    time: 4,
    text: "Answer just 12 quick questions about your project",
    duration: 3,
  },
  {
    time: 7,
    text: "Our advanced scoring engine analyzes your needs",
    duration: 3,
  },
  {
    time: 10,
    text: "Get your top 3 methodology matches instantly",
    duration: 3,
  },
  { time: 13, text: "View industry benchmarks for context", duration: 2.5 },
  { time: 15.5, text: "Share results in stunning pitch mode", duration: 2.5 },
  { time: 18, text: "Export or print your recommendations", duration: 2.5 },
  {
    time: 20.5,
    text: "Ready to find your perfect methodology?",
    duration: 2.5,
  },
];

// helper to normalize option display text
const getOptionText = (option: string | QuestionOption): string =>
  typeof option === "string" ? option : option.text ?? option.value ?? "";

// helper to pick a demo option by keyword (e.g. "Small", "Speed")
const pickDemoOption = (
  question: Question | undefined,
  keyword: string
): string | null => {
  if (!question || !question.options?.length) return null;

  const lowerKeyword = keyword.toLowerCase();
  const texts = question.options.map(getOptionText);

  const match = texts.find((t) => t.toLowerCase().includes(lowerKeyword));
  return match ?? texts[0]
