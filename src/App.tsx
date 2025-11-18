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
import ProfilePage, {
  PastResult,
  UserProfile,
} from "./pages/profilepage";

import {
  scoreMethodologies,
  UserAnswers,
  ScoringResult,
} from "./utils/scoringEngine";

// ---------------- Types ----------------

// App navigation tabs (top nav)
export type AppPage = "home" | "guide" | "about" | "profile";

// App "mode" states for the main content area
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

// ---------------- LocalStorage helpers ----------------

const LS_USER_KEY = "sectorsync:user";
const LS_RESULTS_KEY = "sectorsync:results";

function loadUser(): UserSession | null {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? (JSON.parse(raw) as UserSession) : null;
  } catch {
    return null;
  }
}

function saveUser(u: UserSession | null) {
  if (!u) return localStorage.removeItem(LS_USER_KEY);
  localStorage.setItem(LS_USER_KEY, JSON.stringify(u));
}

function loadPastResults(): PastResult[] {
  try {
    const raw = localStorage.getItem(LS_RESULTS_KEY);
    return raw ? (JSON.parse(raw) as PastResult[]) : [];
  } catch {
    return [];
  }
}

function savePastResults(r: PastResult[]) {
  localStorage.setItem(LS_RESULTS_KEY, JSON.stringify(r));
}

// ---------------- App ----------------

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<AppPage>("home");
  const [state, setState] = useState<AppState>("landing");

  // Backend / scoring result
  const [results, setResults] = useState<ScoringResult | null>(
    null,
  );

  // Optional: a selected result ID (used by ResultsPage)
  const [resultId, setResultId] = useState<string | null>(null);

  // Auth / profile
  const [user, setUser] = useState<UserSession | null>(
    loadUser(),
  );

  // Past results (for profile/history)
  const [history, setHistory] = useState<PastResult[]>(
    loadPastResults(),
  );

  // Project naming metadata for the *current* run
  const [currentProjectName, setCurrentProjectName] =
    useState<string | undefined>(undefined);
  const [currentProjectDescription, setCurrentProjectDescription] =
    useState<string | undefined>(undefined);

  // Persist user + history
  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    savePastResults(history);
  }, [history]);

  // --------- Navigation (top tabs) ----------

  const handleNavigate = (page: string) => {
    setCurrentPage(page as AppPage);
    setState(page === "profile" ? "profile" : "landing");
  };

  // --------- Auth flow ----------

  const handleShowSignIn = () => setState("signin");
  const handleShowSignUp = () => setState("signup");

  const handleSignIn = (email: string, password: string) => {
    console.log("Sign in:", email, password);
    setUser({ email, fullName: email.split("@")[0] });
    setState("landing");
    setCurrentPage("home");
  };

  const handleSignUp = (data: SignUpData) => {
    console.log("Sign up:", data);
    setUser({
      email: data.email,
      fullName: data.fullName,
      company: data.company,
    });
    setState("landing");
    setCurrentPage("home");
  };

  const handleSignOut = () => {
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

  // --------- Assessment flow (with project naming) ----------

  const handleStartAssessment = () => setState("project-naming");

  const handleProjectNamed = (
    projectName: string,
    projectDescription?: string,
  ) => {
    setCurrentProjectName(projectName);
    setCurrentProjectDescription(projectDescription);
    setState("questionnaire");
  };

  const handleSkipProjectNaming = () => {
    setCurrentProjectName(undefined);
    setCurrentProjectDescription(undefined);
    setState("questionnaire");
  };

  const handleComplete = async (answers: UserAnswers) => {
    try {
      // Backend scoring
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      const scoringResults: ScoringResult = await res.json();
      setResults(scoringResults);
      setState("results");

      // Save to history for profile
      const top = scoringResults.ranking?.[0];
      const newEntry: PastResult = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        projectName: currentProjectName,
        projectDescription: currentProjectDescription,
        topMethod: top?.method || "Unknown",
        score: Math.round((top?.score ?? 0) * 100),
        factors: {},
        fullResults: scoringResults,
      };
      setHistory((prev) => [newEntry, ...prev]);

      // Reset project info after saving
      setCurrentProjectName(undefined);
      setCurrentProjectDescription(undefined);
    } catch (err) {
      console.error("❌ Error fetching score:", err);
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

  // --------- Pitch / Print / Benchmark modes ----------

  const handleOpenPitch = () => setState("pitch");
  const handleOpenPrint = () => setState("print");
  const handleExitPitchOrPrint = () => setState("results");

  const handleOpenBenchmark = () => setState("benchmark");
  const handleExitBenchmark = () => setState("results");

  // --------- Find Results flow ----------

  const handleOpenFindResults = () => setState("findresults");

  const handleLoadResults = (data: { answers: UserAnswers }) => {
    // Recompute locally if you want consistency with the current engine
    const recomputed = scoreMethodologies(data.answers);
    const normalized: ScoringResult & {
      answers: UserAnswers;
      restored: boolean;
    } = {
      ...recomputed,
      engineVersion: "restored-v1",
      answers: data.answers,
      restored: true,
    };
    setResults(normalized);
    setState("results");
  };

  // --------- Profile / history helpers ----------

  const handleViewResult = (id: string) => {
    const result = history.find((r) => r.id === id);
    if (result?.fullResults) {
      setResults(result.fullResults);
      setResultId(result.id);
      setState("results");
    }
  };

  async function onUpdateProfile(patch: Partial<UserProfile>) {
    if (!user) return;
    setUser({
      email: user.email,
      fullName: patch.fullName ?? user.fullName,
      company: patch.company ?? user.company,
    });
  }

  async function onChangeEmail(
    newEmail: string,
    currentPassword: string,
  ) {
    if (!user) return;
    setUser({ ...user, email: newEmail });
  }

  async function onChangePassword(
    currentPassword: string,
    newPassword: string,
  ) {
    console.log("Password changed (mock)");
  }

  async function onExportResult(resultId: string) {
    const r = history.find((h) => h.id === resultId);
    if (!r) return;
    const blob = new Blob([JSON.stringify(r, null, 2)], {
      type: "application/json",
    });
    return blob;
  }

  async function onDeleteResult(resultId: string) {
    setHistory((prev) => prev.filter((r) => r.id !== resultId));
  }

  // Build a profile object even for guests so the page can render in read-only mode
  const userProfile: UserProfile = user
    ? {
        id: user.email,
        fullName: user.fullName || user.email.split("@")[0],
        email: user.email,
        company: user.company,
      }
    : {
        id: "guest",
        fullName: "Guest",
        email: "guest@sectorsync.local",
        company: undefined,
      };

  const showProfileTab = true;

  // --------- Optional: open modes by URL query ----------

  useEffect(() => {
    const u = new URL(window.location.href);
    if (u.searchParams.get("pitch") === "1") setState("pitch");
    if (u.searchParams.get("print") === "1") setState("print");
    if (u.searchParams.get("benchmark") === "1")
      setState("benchmark");
    if (u.searchParams.get("profile") === "1") {
      setCurrentPage("profile");
      setState("profile");
    }
  }, []);

  // --------- Render ----------

  return (
  <ThemeProvider>
    <div className="min-h-screen flex flex-col">
      {state !== "pitch" &&
        state !== "signin" &&
        state !== "signup" && (
          <Navigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onStartAssessment={handleStartAssessment}
            onOpenFindResults={handleOpenFindResults}
            onSignIn={handleShowSignIn}
            user={user}
            onSignOut={handleSignOut}
            showProfile={showProfileTab}
          />
        )}

      {state !== "signin" && state !== "signup" && (
        <MoodPlayer />
      )}

      <main className="flex-1">
        {window.location.pathname === "/admin" ? (
          <AdminPage />
        ) : (
          <>
            {state === "signin" && (
              <SignInPage
                onSignIn={handleSignIn}
                onSignUp={handleShowSignUp}
                onSkip={handleSkipAuth}
              />
            )}

            {state === "signup" && (
              <SignUpPage
                onSignUp={handleSignUp}
                onSignIn={handleShowSignIn}
                onSkip={handleSkipAuth}
              />
            )}

            {state === "project-naming" && (
              <ProjectNaming
                onComplete={handleProjectNamed}
                onSkip={handleSkipProjectNaming}
              />
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
              />
            )}

            {state === "findresults" && (
              <FindResultsPage onLoadResults={handleLoadResults} />
            )}

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

            {state === "profile" && (
              <ProfilePage
                user={userProfile}
                results={history}
                onUpdateProfile={
                  user
                    ? onUpdateProfile
                    : async () => {
                        alert("Sign in to edit your profile.");
                      }
                }
                onChangeEmail={
                  user
                    ? onChangeEmail
                    : async () => {
                        alert("Sign in to change your email.");
                      }
                }
                onChangePassword={
                  user
                    ? onChangePassword
                    : async () => {
                        alert("Sign in to change your password.");
                      }
                }
                onExportResult={onExportResult}
                onDeleteResult={onDeleteResult}
                onViewResult={handleViewResult}
              />
            )}

            {state === "pitch" && results && (
              <PitchPage
                results={results}
                onExit={handleExitPitchOrPrint}
              />
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
              <BenchmarkPage
                results={results}
                onBack={handleExitBenchmark}
              />
            )}
          </>
        )}
      </main>
    </div>
  </ThemeProvider>
);
}
