import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Progress } from "../components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

// ✅ removed scoringEngine import — frontend doesn’t use backend logic here

interface Option {
  id: string;
  text: string;
  factorValue?: string;
}

interface Question {
  id: string;
  question: string;
  description?: string;
  options: Option[];
}

// ✅ Only collects answers to send to backend
interface SurveyPageProps {
  onComplete: (answers: Record<string, string>) => void;
}

function InteractiveOption({
  option,
  value,
  isSelected,
  onSelect,
}: {
  option: string;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const optionRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = optionRef.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    element.style.setProperty("--spotlight-x", `${x}%`);
    element.style.setProperty("--spotlight-y", `${y}%`);
  };

  return (
    <div
      ref={optionRef}
      className="flex items-center gap-4 p-5 sm:p-6 rounded-2xl glass-card border-white/20 dark:border-white/10 hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl group cursor-spotlight"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
    >
      <RadioGroupItem
        value={value}
        id={option}
        className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 group-hover:scale-110"
      />
      <Label
        htmlFor={option}
        className="flex-1 cursor-pointer text-lg sm:text-xl"
      >
        {option}
      </Label>
    </div>
  );
}

export function SurveyPage({ onComplete }: SurveyPageProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // ✅ answers now typed as simple key-value pairs
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Fetch questions from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading questions...
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = Math.min(99.0, ((currentQuestion + 1) / questions.length) * 100);
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[question.id] !== undefined;

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = () => {
    if (isLastQuestion) onComplete(answers); // ✅ sends raw answers to parent
    else setCurrentQuestion(currentQuestion + 1);
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 sm:p-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30"></div>

      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }}></div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="mb-10 glass-subtle rounded-2xl p-6 border border-white/20 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <Card className="glass-strong p-10 sm:p-12 shadow-2xl border-white/20 dark:border-white/10 transition-all duration-500">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-semibold leading-tight mb-4">
              {question.question}
            </h2>
            {question.description && (
              <p className="text-base sm:text-lg text-muted-foreground">
                {question.description}
              </p>
            )}
          </div>

          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-5"
          >
            {question.options.map((option) => (
              <InteractiveOption
                key={option.id}
                option={option.text}
                value={option.factorValue || option.text}
                isSelected={answers[question.id] === (option.factorValue || option.text)}
                onSelect={() => handleAnswer(option.factorValue || option.text)}
              />
            ))}
          </RadioGroup>

          <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="h-12 px-6 text-base glass-hover border-white/20 dark:border-white/10"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="h-12 px-8 text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              {isLastQuestion ? "See Results" : "Next"}
              {!isLastQuestion && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
