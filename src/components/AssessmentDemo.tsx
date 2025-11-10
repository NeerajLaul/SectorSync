import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { ArrowRight, Play, Pause, RotateCcw, CheckCircle2, TrendingUp } from "lucide-react";

interface AssessmentDemoProps {
  onStartRealAssessment?: () => void;
}

// Sample answers that lead to a Scrum recommendation
const SAMPLE_ANSWERS = [
  "Small",
  "Iterative",
  "Internal Sourcing",
  "Speed",
  "Medium",
  "Continuous Feedback Loops",
  "Time & Materials",
  "Emergent",
  "Cross-functional",
  "Iterative",
  "Continuous",
  "Team Acceptance",
];

export function AssessmentDemo({ onStartRealAssessment }: AssessmentDemoProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<"intro" | "questions" | "results">("intro");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // --- Fetch questions from backend ---
  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then(setQuestions)
      .catch((err) => console.error("Failed to load demo questions:", err));
  }, []);

  // --- Auto-advance logic ---
  useEffect(() => {
    if (!isPlaying || questions.length === 0) return;

    if (phase === "intro") {
      const timer = setTimeout(() => {
        setPhase("questions");
        setCurrentStep(0);
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (phase === "questions") {
      if (currentStep < questions.length) {
        const timer = setTimeout(() => {
          setSelectedAnswer(SAMPLE_ANSWERS[currentStep]);

          setTimeout(() => {
            if (currentStep === questions.length - 1) {
              setPhase("results");
            } else {
              setCurrentStep(currentStep + 1);
              setSelectedAnswer(null);
            }
          }, 1000);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }

    if (phase === "results") {
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, phase, questions]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setPhase("intro");
    setSelectedAnswer(null);
  };

  const progress =
    phase === "questions"
      ? ((currentStep + 1) / questions.length) * 100
      : phase === "results"
        ? 100
        : 0;

  const currentQuestion = questions[currentStep];

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePlayPause} className="gap-2">
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> {phase === "intro" ? "Start" : "Resume"} Demo
              </>
            )}
          </Button>
          <Button size="sm" variant="outline" onClick={handleRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Restart
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {phase === "intro" && "Introduction"}
          {phase === "questions" && `Question ${currentStep + 1} of ${questions.length}`}
          {phase === "results" && "Results"}
        </div>
      </div>

      {/* Demo Container */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/5 to-purple-100/10 dark:from-primary/10 dark:to-purple-900/20 rounded-xl border-2 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Intro */}
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="bg-primary/10 p-6 rounded-full inline-block mb-4">
                  <CheckCircle2 className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-3xl">SectorSync Assessment Demo</h3>
                <p className="text-muted-foreground max-w-md">
                  Watch how the 12-question assessment works and see a sample result
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Questions */}
          {phase === "questions" && currentQuestion && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="absolute inset-0 flex flex-col p-8"
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Question {currentStep + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}% Complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex flex-col"
              >
                <div className="mb-6">
                  <h3 className="text-2xl mb-2">{currentQuestion.question}</h3>
                  {currentQuestion.description && (
                    <p className="text-muted-foreground">{currentQuestion.description}</p>
                  )}
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option: any, idx: number) => {
                    const displayText = option.text || option;
                    const isSelected = selectedAnswer === displayText;
                    return (
                      <motion.div
                        key={option.id || option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${isSelected
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-muted bg-white/50 dark:bg-black/20"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                              }`}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2 h-2 rounded-full bg-white"
                              />
                            )}
                          </div>
                          <span className="text-lg">{displayText}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Results */}
          {phase === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="w-full max-w-2xl space-y-6"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                    className="bg-yellow-400 p-4 rounded-full inline-block mb-4"
                  >
                    <span className="text-4xl">🏆</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="text-sm text-green-600 dark:text-green-400 mb-2">TOP MATCH</div>
                    <h2 className="text-4xl mb-4">Scrum</h2>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="p-6 rounded-xl glass-card border-2 border-primary/20"
                >
                  <p className="text-muted-foreground mb-4">
                    Agile framework emphasizing iterative development, self-organizing teams,
                    and continuous improvement through sprints.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Match Score</span>
                      <span className="text-primary">0.95 / 1.00</span>
                    </div>
                    <div className="bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "95%" }}
                        transition={{ delay: 1, duration: 1, ease: "easeOut" }}
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>2nd: SAFe</span>
                      </div>
                      <span className="text-muted-foreground">0.78</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>3rd: Hybrid</span>
                      </div>
                      <span className="text-muted-foreground">0.72</span>
                    </div>
                  </div>
                </motion.div>

                {onStartRealAssessment && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-center pt-4"
                  >
                    <Button size="lg" onClick={onStartRealAssessment} className="gap-2">
                      Start Your Assessment <ArrowRight className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          This is an automated demo showing a sample assessment flow. The actual assessment takes
          about 3–5 minutes to complete.
        </p>
      </div>
    </div>
  );
}
