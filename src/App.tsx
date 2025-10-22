import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ToolGuidePage } from './components/ToolGuidePage';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionCard } from './components/QuestionCard';
import { ResultsCard } from './components/ResultsCard';
import { ProgressBar } from './components/ProgressBar';
import { ResultsLookupPage } from './components/ResultsLookup';
import { methodologies } from './utils/Methods';


type UserAnswers = { [key: string]: string };

interface Option {
  id: string;
  text: string;
  icon: string;
  factorValue: string;
}

interface Question {
  id: number;
  question: string;
  factor: string;
  options: Option[];
}

interface Methodology {
  name: string;
  icon: string;
  description: string;
  bestFor: string[];
  keyPrinciples: string[];
}

interface MethodologyResult extends Methodology {
  score: number;
  key: string;
}

// dynamicQuestions mapped to the 12 factors from the backend - Updated, now dynamic via backend CRUDS
// Moved methodologies to different file for easier access required for other pages.

export default function App() {
  const [page, setPage] = useState<'home' | 'guide' | 'quiz' | 'lookup'>('home');
  const [stage, setStage] = useState<'welcome' | 'quiz' | 'results'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [results, setResults] = useState<MethodologyResult[]>([]);

  const [dynamicQuestions, setDynamicQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionId, setSubmissionId] = useState<string | null>(null);


  useEffect(() => {
    fetch("/api/data")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch questions");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort(
            (a, b) => (a.questionNumber || 0) - (b.questionNumber || 0)
          );
          setDynamicQuestions(sorted);
        }
      })
      .catch((err) => {
        console.error("Using fallback questions:", err);
      })
      .finally(() => setLoading(false));
  }, []);



  const handleNavigate = (newPage: string) => {
    setPage(newPage as 'home' | 'guide' | 'quiz');
    if (newPage === 'quiz') {
      setStage('welcome');
    }
  };

  const handleStartQuiz = () => {
    setPage('quiz');
    setStage('quiz');
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleStart = () => {
    setStage('quiz');
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleOptionSelect = (option: Option) => {
    const currentFactor = dynamicQuestions[currentQuestion].factor;
    const newAnswers = { ...answers, [currentFactor]: option.factorValue };
    setAnswers(newAnswers);

    if (currentQuestion < dynamicQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results using scoring engine
      fetch("/api/scoring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnswers),
      })
        .then((res) => res.json())
        .then((scoringResult) => {
          const top3 = scoringResult.ranking.slice(0, 3).map((result: any) => ({
            ...methodologies[result.method],
            score: result.score,
            key: result.method,
          }));
          setResults(top3);
          setStage("results");

          // 🔹 Save answers after scoring succeeds
          fetch("/api/answers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              answers: newAnswers,
              results: top3,
              timestamp: new Date().toISOString(),
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("✅ Answers saved with ID:", data.id);
              setSubmissionId(data.id); // ✅ store ID for ResultsCard
            })

            .catch((err) => console.error("❌ Error saving answers:", err));
        })
        .catch((err) => console.error("Error fetching scoring results:", err));
    }
  };

  const handleRestart = () => {
    setStage('welcome');
    setCurrentQuestion(0);
    setAnswers({});
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={page} onNavigate={handleNavigate} />

      <div className="p-4 sm:p-8">
        <div className="max-w-5xl mx-auto py-8">
          <AnimatePresence mode="wait">
            {page === 'home' && (
              <HomePage
                key="home"
                onStartQuiz={handleStartQuiz}
                onViewGuide={() => setPage('guide')}
              />
            )}

            {page === 'guide' && (
              <ToolGuidePage key="guide" onStartQuiz={handleStartQuiz} />
            )}
            {page === 'lookup' && (
              <ResultsLookupPage
                key="lookup"
                onBack={() => setPage('home')}
              />
            )}


            {page === 'quiz' && (
              <>
                {stage === 'welcome' && (
                  <WelcomeScreen key="welcome" onStart={handleStart} />
                )}

                {stage === 'quiz' && (
                  <div key="quiz">
                    <ProgressBar current={currentQuestion + 1} total={dynamicQuestions.length} />
                    <AnimatePresence mode="wait">
                      <QuestionCard
                        key={dynamicQuestions[currentQuestion].id}
                        question={dynamicQuestions[currentQuestion].question}
                        options={dynamicQuestions[currentQuestion].options}
                        onSelect={handleOptionSelect}
                      />
                    </AnimatePresence>
                  </div>
                )}

                {stage === 'results' && results.length > 0 && (
                  <ResultsCard
                    key="results"
                    results={results}
                    submissionId={submissionId || undefined}
                    onRestart={handleRestart}
                  />
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
