// App.tsx
import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navigation } from "./components/layout/Navigation";
import { IndexPage } from "./pages/index";
import { GuidePage } from "./pages/guide";
import { AboutPage } from "./pages/about";
import { SurveyPage } from "./pages/survey";
import { ResultsPage } from "./pages/results";
import { PitchPage } from "./pages/pitch";
import { PrintPage } from "./pages/print";
import { MoodPlayer } from "./components/MoodPlayer";
import { BenchmarkPage } from "./pages/benchmark";
import { FindResultsPage } from "./pages/findResults";



interface ScoringResult {
  ranking: { method: string; score: number; contributions: any[] }[];
  engineVersion: string;
}


// App navigation tabs (top nav)
type AppPage = "home" | "guide" | "about";

// App "mode" states for the main content area
type AppState =
  | "landing"
  | "questionnaire"
  | "results"
  | "pitch"
  | "print"
  | "benchmark"
  | "findresults";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<AppPage>("home");
  const [state, setState] = useState<AppState>("landing");
  const [results, setResults] = useState<ScoringResult | null>(
    null,
  );

  const [resultId, setResultId] = useState<string | null>(null);


  // Find results
  const handleOpenFindResults = () => setState("findresults");

  // --------- Navigation (top tabs) ----------
  const handleNavigate = (page: string) => {
    setCurrentPage(page as AppPage);
    setState("landing");
    // If you want URL changes later, wire React Router here.
  };

  // --------- Assessment flow ----------
  const handleStartAssessment = () => setState("questionnaire");

  const handleComplete = async (answers: Record<string, string>) => {
    try {
      const res = await fetch("http://localhost:5000/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });
      const scoringResults = await res.json();
      setResults(scoringResults);
      setState("results");
    } catch (err) {
      console.error("❌ Error fetching score:", err);
    }
  };

  const handleRestart = () => {
    setResults(null);
    setState("landing");
    setCurrentPage("home");
  };

  // --------- Pitch / Print modes ----------
  const handleOpenPitch = () => setState("pitch");
  const handleOpenPrint = () => setState("print");
  const handleExitPitchOrPrint = () => setState("results");

  // --------- Benchmark (optional) ----------
  const handleOpenBenchmark = () => setState("benchmark");
  const handleExitBenchmark = () => setState("results");
  // --------- Load Results from FindResults ----------
  // --------- Load Results from FindResults ----------
  const handleLoadResults = (data: any) => {
    const recomputed = scoreMethodologies(data.answers);
    const normalized = {
      ...recomputed,
      engineVersion: "restored-v1",
      answers: data.answers,
      restored: true, // 👈 new flag
    };
    setResults(normalized);
    setState("results");
  };

  // --------- Optional: open modes by URL query (?pitch=1 / ?print=1) ----------
  useEffect(() => {
    const u = new URL(window.location.href);
    if (u.searchParams.get("pitch") === "1") setState("pitch");
    if (u.searchParams.get("print") === "1") setState("print");
    if (u.searchParams.get("benchmark") === "1")
      setState("benchmark");
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        {/* Top navigation is always shown except during Pitch mode (full-screen). 
            If you want it hidden only in Pitch, you can conditionally render it. */}
        {state !== "pitch" && (
          <Navigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onStartAssessment={handleStartAssessment}
            onOpenFindResults={handleOpenFindResults}
          />
        )}

        {/* Mood Player - Floating sound control */}
        <MoodPlayer />

        <main className="flex-1">
          {/* Questionnaire */}
          {state === "questionnaire" && (
            <SurveyPage onComplete={handleComplete} />
          )}

          {/* Results (standard UI) */}
          {state === "results" && results && (
            <ResultsPage
              results={results}
              onRestart={handleRestart}
              resultId={resultId}
              setResultId={setResultId}
              onOpenPitch={handleOpenPitch}
              onOpenPrint={handleOpenPrint}
              onOpenBenchmark={handleOpenBenchmark}
            />
          )}
          {/* Find Results */}
          {state === "findresults" && (
            <FindResultsPage onLoadResults={handleLoadResults} />
          )}



          {/* Landing pages under each top tab */}
          {state === "landing" && (
            <>
              {currentPage === "home" && (
                <IndexPage
                  onStartAssessment={handleStartAssessment}
                />
              )}
              {currentPage === "guide" && (
                <GuidePage
                  onStartAssessment={handleStartAssessment}
                />
              )}
              {currentPage === "about" && (
                <AboutPage
                  onStartAssessment={handleStartAssessment}
                />
              )}
            </>
          )}

          {/* Pitch Mode (full-screen overlay style component) */}
          {state === "pitch" && results && (
            <PitchPage
              results={results}
              onExit={handleExitPitchOrPrint}
            />
          )}

          {/* Print Deck (print-ready, one slide per page) */}
          {state === "print" && results && (
            <PrintPage
              results={results}
              onBack={handleExitPitchOrPrint}
              onOpenBenchmark={handleOpenBenchmark}
              brandName="SectorSync"
            // logoUrl="/logo.svg"
            />
          )}

          {/* Optional: Industry Benchmark page */}
          {state === "benchmark" && results && (
            <BenchmarkPage
              results={results}
              onBack={handleExitBenchmark}
            />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
