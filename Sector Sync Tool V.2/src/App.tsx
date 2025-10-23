// App.tsx
import { useEffect, useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { ToolGuide } from "./components/ToolGuide";
import { About } from "./components/About";
import { Questionnaire } from "./components/Questionnaire";
import { Results } from "./components/Results";
import { PitchResults } from "./components/Pitchresults"; // <-- add (you created earlier)
import { PrintDeck } from "./components/PrintDeck"; // <-- add (you created earlier)
// import { Dashboard } from "./components/Dashboard";      // <-- optional if you build a benchmark page

import {
  scoreMethodologies,
  UserAnswers,
  ScoringResult,
} from "./utils/scoringEngine";

// App navigation tabs (top nav)
type AppPage = "home" | "guide" | "about";

// App "mode" states for the main content area
type AppState =
  | "landing"
  | "questionnaire"
  | "results"
  | "pitch"
  | "print";
// | "benchmark" // <-- optional, if you add a dashboard page

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<AppPage>("home");
  const [state, setState] = useState<AppState>("landing");
  const [results, setResults] = useState<ScoringResult | null>(
    null,
  );

  // --------- Navigation (top tabs) ----------
  const handleNavigate = (page: string) => {
    setCurrentPage(page as AppPage);
    setState("landing");
    // If you want URL changes later, wire React Router here.
  };

  // --------- Assessment flow ----------
  const handleStartAssessment = () => setState("questionnaire");

  const handleComplete = (answers: UserAnswers) => {
    const scoringResults = scoreMethodologies(answers);
    setResults(scoringResults);
    setState("results");
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
  // const handleOpenBenchmark = () => setState("benchmark");
  // const handleExitBenchmark = () => setState("results");

  // --------- Optional: open modes by URL query (?pitch=1 / ?print=1) ----------
  useEffect(() => {
    const u = new URL(window.location.href);
    if (u.searchParams.get("pitch") === "1") setState("pitch");
    if (u.searchParams.get("print") === "1") setState("print");
    // if (u.searchParams.get("benchmark") === "1") setState("benchmark");
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
          />
        )}

        <main className="flex-1">
          {/* Questionnaire */}
          {state === "questionnaire" && (
            <Questionnaire onComplete={handleComplete} />
          )}

          {/* Results (standard UI) */}
          {state === "results" && results && (
            <Results
              results={results}
              onRestart={handleRestart}
              // Pass these so the Results page can open Pitch/Print
              onOpenPitch={handleOpenPitch}
              onOpenPrint={handleOpenPrint}
              // onOpenBenchmark={handleOpenBenchmark} // if you add a dashboard page
            />
          )}

          {/* Landing pages under each top tab */}
          {state === "landing" && (
            <>
              {currentPage === "home" && (
                <LandingPage
                  onStartAssessment={handleStartAssessment}
                />
              )}
              {currentPage === "guide" && (
                <ToolGuide
                  onStartAssessment={handleStartAssessment}
                />
              )}
              {currentPage === "about" && (
                <About
                  onStartAssessment={handleStartAssessment}
                />
              )}
            </>
          )}

          {/* Pitch Mode (full-screen overlay style component) */}
          {state === "pitch" && results && (
            <PitchResults
              results={results}
              onExit={handleExitPitchOrPrint}
              // onOpenBenchmark={handleOpenBenchmark} // optional
            />
          )}

          {/* Print Deck (print-ready, one slide per page) */}
          {state === "print" && results && (
            <PrintDeck
              results={results}
              onBack={handleExitPitchOrPrint}
              // onOpenBenchmark={handleOpenBenchmark} // optional
              brandName="SectorSync"
              // logoUrl="/logo.svg"
            />
          )}

          {/* Optional: Industry Benchmark page */}
          {/* {state === "benchmark" && results && (
            <Dashboard results={results} onBack={handleExitBenchmark} />
          )} */}
        </main>
      </div>
    </ThemeProvider>
  );
}