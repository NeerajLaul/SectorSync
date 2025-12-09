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
import AdminPage from "./pages/admin";
import { MoodPlayer } from "./components/MoodPlayer";
import { BenchmarkPage } from "./pages/benchmark";
import { FindResultsPage } from "./pages/findResults";
import { SignInPage } from "./pages/signin";
import { SignUpPage, SignUpData } from "./pages/signup";
import { ProjectNaming } from "./components/ProjectNaming";
import ProfilePage, { PastResult, UserProfile } from "./pages/profilepage";
import { Loader2 } from "lucide-react";

// ---------------- Types ----------------

export type AppPage = "home" | "guide" | "about" | "profile";

export type AppState =
  | "landing"
  | "signin"
  | "signup"
  | "project-naming"
  | "questionnaire"
  | "results"
  | "pitch"
  | "print"
  | "benchmark"
  | "profile"
  | "findresults";

interface UserSession {
  email: string;
  fullName?: string;
  company?: string;
}

// Ensure these types match what your backend returns
export interface ScoringResult {
  ranking: { method: string; score: number; contributions: any[] }[];
  engineVersion: string;
  answers?: Record<string, string>;
  restored?: boolean;
}

export type UserAnswers = Record<string, string>;

// ---------------- App ----------------

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("home");
  const [state, setState] = useState<AppState>("landing");

  // Global Auth Loading State
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Backend / scoring result
  const [results, setResults] = useState<ScoringResult | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);

  // Auth / profile
  const [user, setUser] = useState<UserSession | null>(null);

  // History (Loaded from Cloud)
  const [history, setHistory] = useState<PastResult[]>([]);

  // Project naming metadata
  const [currentProjectName, setCurrentProjectName] = useState<string | undefined>(undefined);
  const [currentProjectDescription, setCurrentProjectDescription] = useState<string | undefined>(undefined);

  // --------- CHECK SESSION ON MOUNT ---------
  useEffect(() => {
    fetch("https://sectorsync-production.up.railway.app/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then((data) => {
        setUser({
          email: data.email,
          fullName: data.fullName,
          company: data.company
        });
        if (data.history && Array.isArray(data.history)) {
          setHistory(data.history);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setIsAuthLoading(false));
  }, []);

  // --------- Navigation ----------

  const handleNavigate = (page: string) => {
    setCurrentPage(page as AppPage);
    setState(page === "profile" ? "profile" : "landing");
  };

  // --------- Auth flow ----------

  const handleShowSignIn = () => setState("signin");
  const handleShowSignUp = () => setState("signup");

  const handleSignIn = async (email: string, password: string) => {
    try {
      const res = await fetch("https://sectorsync-production.up.railway.app/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser({
          email: data.email,
          fullName: data.fullName,
          company: data.company
        });
        if (data.history) setHistory(data.history);
        setState("landing");
        setCurrentPage("home");
      }
    } catch (err) {
      console.error("Auth fetch failed", err);
    }
  };

  const handleSignUp = (data: SignUpData) => {
    setUser({
      email: data.email,
      fullName: data.fullName,
      company: data.company,
    });
    setState("landing");
    setCurrentPage("home");
  };

  const handleSignOut = async () => {
    await fetch("https://sectorsync-production.up.railway.app/api/auth/logout", { method: "POST" });
    setUser(null);
    setResults(null);
    setHistory([]);
    setState("landing");
    setCurrentPage("home");
  };

  const handleSkipAuth = () => {
    setState("landing");
    setCurrentPage("home");
  };

  // --------- Assessment flow ----------

  const handleStartAssessment = () => setState("project-naming");

  const handleProjectNamed = (name: string, desc?: string) => {
    setCurrentProjectName(name);
    setCurrentProjectDescription(desc);
    setState("questionnaire");
  };

  const handleSkipProjectNaming = () => {
    setCurrentProjectName(undefined);
    setCurrentProjectDescription(undefined);
    setState("questionnaire");
  };

  // ⬇️ UPDATED handleComplete (Adds instant history update)
  const handleComplete = async (answers: UserAnswers) => {
    try {
      // 1. Send answers to backend scoring engine
      const res = await fetch("https://sectorsync-production.up.railway.app/api/scoringEngine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) throw new Error("Scoring failed");

      const finalResults: ScoringResult = await res.json();

      // 2. Merge answers back (Crucial for saving later)
      const resultWithAnswers = {
        ...finalResults,
        answers: answers
      };

      // 3. Update main state
      setResults(resultWithAnswers);
      setState("results");

      // 4. INSTANT HISTORY UPDATE (Fixes the "Refresh" issue)
      if (user && currentProjectName) {
        const top = finalResults.ranking?.[0];

        // Create a temporary history entry
        const newEntry: PastResult = {
          id: "just-now", // This gets replaced by real ID on next refresh
          createdAt: new Date().toISOString(),
          projectName: currentProjectName,
          projectDescription: currentProjectDescription,
          topMethod: top?.method || "Unknown",
          score: Math.round((top?.score ?? 0) * 100),
          factors: {},
          fullResults: resultWithAnswers,
        };

        // Add to top of list immediately
        setHistory(prev => [newEntry, ...prev]);
      }
    } catch (err) {
      console.error("Error scoring assessment:", err);
      alert("Failed to calculate score. Please try again.");
    }
  };

  const handleRestart = () => {
    setResults(null);
    setResultId(null);
    setState("landing");
    setCurrentPage("home");
    setCurrentProjectName(undefined);
    setCurrentProjectDescription(undefined);
  };

  // --------- Find Results flow ----------

  const handleOpenFindResults = () => setState("findresults");

  // ⬇️ CHANGED: Handles cases where we need to re-score via backend
  const handleLoadResults = async (data: {
    answers: UserAnswers;
    results?: any[];
    projectName?: string;
    projectDescription?: string;
  }) => {
    // 1. Restore Metadata
    if (data.projectName) setCurrentProjectName(data.projectName);
    if (data.projectDescription) setCurrentProjectDescription(data.projectDescription);

    let finalScoring: ScoringResult;

    // 2. Use Saved Scores OR Ask Backend to Re-score
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      finalScoring = {
        ranking: data.results,
        engineVersion: "v1-restored",
        answers: data.answers
      };
    } else {
      // Fallback: Call backend to score these answers
      try {
        console.log("Recomputing scores via backend...");
        const res = await fetch("https://sectorsync-production.up.railway.app/api/scoringEngine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.answers),
        });
        finalScoring = await res.json();
      } catch (err) {
        console.error("Failed to re-score loaded data", err);
        return; // Stop if we can't get scores
      }
    }

    const normalized = { ...finalScoring, restored: true };
    setResults(normalized);
    setState("results");
  };

  // --------- Modes ----------

  const handleOpenPitch = () => setState("pitch");
  const handleOpenPrint = () => setState("print");
  const handleExitPitchOrPrint = () => setState("results");
  const handleOpenBenchmark = () => setState("benchmark");
  const handleExitBenchmark = () => setState("results");

  const handleViewResult = (id: string) => {
    const result = history.find((r) => r.id === id);
    if (result?.fullResults) {
      setResults(result.fullResults);
      setResultId(result.id);
      setCurrentProjectName(result.projectName);
      setCurrentProjectDescription(result.projectDescription);
      setState("results");
    }
  };

  // Profile update stubs
  async function onUpdateProfile(patch: Partial<UserProfile>) { /* ... */ }
  async function onChangeEmail(e: string, p: string) { /* ... */ }
  async function onChangePassword(c: string, n: string) { /* ... */ }
  async function onExportResult(id: string, format: "csv" | "json") { /* ... */ }
  async function onDeleteResult(id: string) { /* ... */ }

  const userProfile: UserProfile = user
    ? {
      fullName: user.fullName || user.email.split("@")[0],
      email: user.email,
      company: user.company,
    }
    : { fullName: "Guest", email: "guest@sectorsync", company: "" };

  // --------- Render ----------

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        {state !== "pitch" && state !== "signin" && state !== "signup" && (
          <Navigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onStartAssessment={handleStartAssessment}
            onOpenFindResults={handleOpenFindResults}
            onSignIn={handleShowSignIn}
            user={user}
            onSignOut={handleSignOut}
            showProfile={true}
            showFindResults={!user}
          />
        )}

        {state !== "signin" && state !== "signup" && <MoodPlayer />}

        <main className="flex-1">
          {state === "signin" && (
            <SignInPage onSignIn={handleSignIn} onSignUp={handleShowSignUp} onSkip={handleSkipAuth} />
          )}
          {state === "signup" && (
            <SignUpPage onSignUp={handleSignUp} onSignIn={handleShowSignIn} onSkip={handleSkipAuth} />
          )}
          {state === "project-naming" && (
            <ProjectNaming onComplete={handleProjectNamed} onSkip={handleSkipProjectNaming} />
          )}
          {state === "questionnaire" && (
            <SurveyPage onComplete={handleComplete} />
          )}
          {state === "results" && results && (
            <ResultsPage
              results={results}
              onRestart={handleRestart}
              resultId={resultId}
              setResultId={setResultId}
              onOpenPitch={handleOpenPitch}
              onOpenPrint={handleOpenPrint}
              onOpenBenchmark={handleOpenBenchmark}
              projectName={currentProjectName}
              projectDescription={currentProjectDescription}
            />
          )}
          {state === "findresults" && (
            <FindResultsPage onLoadResults={handleLoadResults} />
          )}
          {state === "landing" && (
            <>
              {currentPage === "home" && <IndexPage onStartAssessment={handleStartAssessment} />}
              {currentPage === "guide" && <GuidePage onStartAssessment={handleStartAssessment} />}
              {currentPage === "about" && <AboutPage onStartAssessment={handleStartAssessment} />}
            </>
          )}
          {state === "profile" && (
            <ProfilePage
              user={userProfile}
              history={history}
              onLogout={handleSignOut}
              onUpdateProfile={onUpdateProfile}
              onChangeEmail={onChangeEmail}
              onChangePassword={onChangePassword}
              onExportResult={onExportResult}
              onDeleteResult={onDeleteResult}
              onViewResult={handleViewResult}
              onStartAssessment={handleStartAssessment}
            />
          )}
          {state === "pitch" && results && (
            <PitchPage results={results} onExit={handleExitPitchOrPrint} />
          )}
          {state === "print" && results && (
            <PrintPage
              results={results}
              onBack={handleExitPitchOrPrint}
              onOpenBenchmark={handleOpenBenchmark}
              brandName="SectorSync"
            />
          )}
          {state === "benchmark" && results && (
            <BenchmarkPage results={results} onBack={handleExitBenchmark} />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}
