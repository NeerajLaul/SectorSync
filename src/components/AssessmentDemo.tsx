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

import { useState, useEffect, useRef } from "react";
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
const pickDemoOption = (question: Question | undefined, keyword: string): string | null => {
  if (!question || !question.options?.length) return null;

  const lowerKeyword = keyword.toLowerCase();
  const texts = question.options.map(getOptionText);

  const match = texts.find((t) => t.toLowerCase().includes(lowerKeyword));
  return match ?? texts[0] ?? null;
};

export function AssessmentDemo({ onStartRealAssessment }: AssessmentDemoProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [demoQuestions, setDemoQuestions] = useState<Question[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<
    "intro" | "question1" | "question2" | "results" | "features"
  >("intro");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentCaption, setCurrentCaption] = useState("");
  const [showFeature, setShowFeature] = useState<
    "top3" | "benchmark" | "pitch" | "share" | null
  >(null);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  const hasDemoQuestions = demoQuestions.length >= 2;

  // --- Fetch questions from backend once ---
  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data: Question[]) => {
        const safeData = Array.isArray(data) ? data : [];
        setQuestions(safeData);

        // Pick demo questions: prefer index 0 and 3, fallback to first two
        const picks: Question[] = [];
        if (safeData[0]) picks.push(safeData[0]);
        if (safeData[3]) {
          picks.push(safeData[3]);
        } else if (safeData[1]) {
          picks.push(safeData[1]);
        }
        setDemoQuestions(picks);
      })
      .catch((err) => console.error("Failed to load demo questions:", err));
  }, []);

  // Synchronized caption updates
  useEffect(() => {
    if (!isPlaying) {
      // Clear captions when stopped
      setCurrentCaption("");
      return;
    }
  
    const updateCaption = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
  
      const currentNarration = CAPTION_SCRIPT.find(
        (item) => elapsed >= item.time && elapsed < item.time + item.duration
      );
  
      setCurrentCaption(currentNarration?.text ?? "");
    };
  
    updateCaption();
    const interval = window.setInterval(updateCaption, 100);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  // Main demo flow - ~23 second timeline
  useEffect(() => {
    if (!isPlaying || !hasDemoQuestions) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const runDemo = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;

      // Phase transitions based on time
      if (elapsed < 4) {
        if (phase !== "intro") setPhase("intro");
      } else if (elapsed < 7) {
        if (phase !== "question1") {
          setPhase("question1");
          setCurrentStep(0);
          setSelectedAnswer(null);
        }
        if (elapsed >= 5.5 && !selectedAnswer) {
          const picked = pickDemoOption(demoQuestions[0], DEMO_ANSWERS[0]);
          if (picked) setSelectedAnswer(picked);
        }
      } else if (elapsed < 10) {
        if (phase !== "question2") {
          setPhase("question2");
          setCurrentStep(1);
          setSelectedAnswer(null);
        }
        if (elapsed >= 8.5 && !selectedAnswer) {
          const picked = pickDemoOption(demoQuestions[1], DEMO_ANSWERS[1]);
          if (picked) setSelectedAnswer(picked);
        }
      } else if (elapsed < 13) {
        if (phase !== "results") {
          setPhase("results");
          setShowFeature("top3");
        }
      } else if (elapsed < 15.5) {
        if (showFeature !== "benchmark") {
          setShowFeature("benchmark");
        }
      } else if (elapsed < 18) {
        if (showFeature !== "pitch") {
          setShowFeature("pitch");
        }
      } else if (elapsed < 20.5) {
        if (showFeature !== "share") {
          setShowFeature("share");
        }
      } else if (elapsed < 23) {
        if (phase !== "features") {
          setPhase("features");
        }
      } else {
        // Demo complete at ~23 seconds
        setIsPlaying(false);
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    runDemo();
    timerRef.current = window.setInterval(runDemo, 100);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, phase, selectedAnswer, showFeature, hasDemoQuestions, demoQuestions]);

  const handlePlayPause = () => {
    if (!hasDemoQuestions) return; // avoid starting before data loads
    if (!isPlaying) {
      startTimeRef.current = Date.now();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setPhase("intro");
    setSelectedAnswer(null);
    setShowFeature(null);
    setCurrentCaption("");
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const currentQuestion = demoQuestions[currentStep];

  const progress =
    phase === "intro"
      ? 0
      : phase === "question1"
      ? 25
      : phase === "question2"
      ? 50
      : 100;

  return (
    <div className="w-full">
      {/* Demo Controls */}
      <div className="mb-4 flex items-center justify-between rounded-lg bg-muted/50 p-4">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePlayPause}
            className="gap-2"
            disabled={!hasDemoQuestions}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {!hasDemoQuestions
                  ? "Loading…"
                  : phase === "intro"
                  ? "Start Demo"
                  : "Resume Demo"}
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRestart}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" /> Restart
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          ~30 second walkthrough
        </div>
      </div>

      {/* Demo Container */}
      <div className="relative aspect-video overflow-hidden rounded-xl border-2 bg-gradient-to-br from-primary/5 to-purple-100/10 dark:from-primary/10 dark:to-purple-900/20">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="mb-4 inline-block rounded-full bg-primary/10 p-6">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-4xl">SectorSync</h3>
                <p className="mx-auto max-w-md text-xl text-muted-foreground">
                  Data-Driven Project Management Advisor
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Question Phases */}
          {(phase === "question1" || phase === "question2") &&
            currentQuestion && (
              <motion.div
                key={`question-${currentStep}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="absolute inset-0 flex flex-col p-6"
              >
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Sample Question {currentStep + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Question Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-1 flex-col"
                >
                  <div className="mb-4">
                    <h3 className="mb-2 text-2xl">{currentQuestion.question}</h3>
                    {currentQuestion.description && (
                      <p className="text-sm text-muted-foreground">
                        {currentQuestion.description}
                      </p>
                    )}
                  </div>

                  {/* Options - Show first 4 for brevity */}
                  <div className="space-y-2">
                    {currentQuestion.options.slice(0, 4).map((option, idx) => {
                      const displayText = getOptionText(option);
                      const isSelected = selectedAnswer === displayText;

                      return (
                        <motion.div
                          key={
                            typeof option === "string"
                              ? option
                              : option.id ?? displayText ?? idx
                          }
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className={`rounded-lg border-2 p-3 transition-all duration-300 ${
                            isSelected
                              ? "scale-105 border-primary bg-primary/10 shadow-lg"
                              : "border-muted bg-white/50 dark:bg-black/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                            >
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="h-2 w-2 rounded-full bg-white"
                                />
                              )}
                            </div>
                            <span>{displayText}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}

          {/* Results Phase - Show All Features */}
          {(phase === "results" || phase === "features") && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col overflow-y-auto p-6"
            >
              <div className="space-y-4">
                {/* Top Match */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="mb-2 inline-block rounded-full bg-yellow-400 p-3">
                    <span className="text-3xl">🏆</span>
                  </div>
                  <div className="mb-1 text-xs text-green-600 dark:text-green-400">
                    TOP MATCH
                  </div>
                  <h2 className="mb-2 text-3xl">Scrum</h2>
                  <div className="mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-green-500 to-green-600"
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    95% Match
                  </p>
                </motion.div>

                {/* Top 3 Results Feature */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    scale: showFeature === "top3" ? 1.02 : 1,
                    borderColor:
                      showFeature === "top3"
                        ? "rgb(var(--primary))"
                        : "transparent",
                  }}
                  transition={{ delay: 0.4 }}
                  className="glass-card rounded-lg border-2 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="text-sm">Top 3 Recommendations</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1. Scrum</span>
                      <span className="text-green-600 dark:text-green-400">
                        95%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>2. SAFe</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        78%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>3. Hybrid</span>
                      <span className="text-purple-600 dark:text-purple-400">
                        72%
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {/* Industry Benchmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      borderColor:
                        showFeature === "benchmark"
                          ? "rgb(var(--primary))"
                          : "transparent",
                      boxShadow:
                        showFeature === "benchmark"
                          ? "0 0 20px rgba(var(--primary-rgb, 0,0,0), 0.3)"
                          : "none",
                    }}
                    transition={{ delay: 0.6 }}
                    className="glass-card rounded-lg border-2 p-3 text-center"
                  >
                    <BarChart3 className="mx-auto mb-1 h-6 w-6 text-primary" />
                    <p className="text-xs">Industry Benchmark</p>
                  </motion.div>

                  {/* Pitch Mode */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      borderColor:
                        showFeature === "pitch"
                          ? "rgb(var(--primary))"
                          : "transparent",
                      boxShadow:
                        showFeature === "pitch"
                          ? "0 0 20px rgba(var(--primary-rgb, 0,0,0), 0.3)"
                          : "none",
                    }}
                    transition={{ delay: 0.7 }}
                    className="glass-card rounded-lg border-2 p-3 text-center"
                  >
                    <Presentation className="mx-auto mb-1 h-6 w-6 text-primary" />
                    <p className="text-xs">Pitch Mode</p>
                  </motion.div>

                  {/* Share & Print */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      borderColor:
                        showFeature === "share"
                          ? "rgb(var(--primary))"
                          : "transparent",
                      boxShadow:
                        showFeature === "share"
                          ? "0 0 20px rgba(var(--primary-rgb, 0,0,0), 0.3)"
                          : "none",
                    }}
                    transition={{ delay: 0.8 }}
                    className="glass-card rounded-lg border-2 p-3 text-center"
                  >
                    <div className="mb-1 flex justify-center gap-1">
                      <Share2 className="h-5 w-5 text-primary" />
                      <Printer className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-xs">Share & Print</p>
                  </motion.div>
                </div>

                {/* CTA */}
                {phase === "features" && onStartRealAssessment && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-2 text-center"
                  >
                    <Button
                      size="lg"
                      onClick={onStartRealAssessment}
                      className="gap-2"
                    >
                      Start Your Assessment{" "}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Captions Overlay */}
        {currentCaption && isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-6 left-6 right-6 rounded-lg bg-black/80 p-3 text-center text-sm text-white backdrop-blur-sm"
          >
            {currentCaption}
          </motion.div>
        )}

        {/* Animated Background Effect */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-0 top-0 h-64 w-64 animate-pulse rounded-full bg-primary/20 blur-3xl" />
          <div
            className="absolute bottom-0 right-0 h-64 w-64 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Demo Description */}
      <div className="mt-4 rounded-lg bg-muted/30 p-4">
        <p className="text-center text-sm text-muted-foreground">
          <strong>30-second quick tour</strong> showing key features with
          captions. Full assessment takes 3–5 minutes.
        </p>
      </div>
    </div>
  );
}
