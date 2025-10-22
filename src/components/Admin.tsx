import { useState, useEffect } from "react";

export function Administrator({}: {}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    fetch("/api/data")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort(
            (a, b) => (a.questionNumber || 0) - (b.questionNumber || 0)
          );
          setQuestions(sorted);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const newEntry = {
      id: questions.length + 1,
      questionNumber: questions.length + 1,
      question: newQuestion,
      factor: "",
      options: [],
    };
    setQuestions([...questions, newEntry]);
    setNewQuestion("");
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSave = async () => {
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questions, null, 2),
    });
    alert("Saved successfully!");
  };

  const handleAddOption = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [
                ...q.options,
                {
                  id: `q${q.id}-${String.fromCharCode(97 + q.options.length)}`,
                  text: "",
                  icon: "",
                  factorValue: "",
                },
              ],
            }
          : q
      )
    );
  };

  const handleDeleteOption = (questionId: number, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((opt: any) => opt.id !== optionId),
            }
          : q
      )
    );
  };

  const handleUpdateOption = (
    questionId: number,
    optionId: string,
    field: string,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt: any) =>
                opt.id === optionId ? { ...opt, [field]: value } : opt
              ),
            }
          : q
      )
    );
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel</h1>
      <p>Manage your questions and options below.</p>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Add new question..."
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          style={{ padding: "0.5rem", width: "250px", marginRight: "1rem" }}
        />
        <button onClick={handleAddQuestion}>Add Question</button>
        <button onClick={handleSave} style={{ marginLeft: "1rem" }}>
          Save All
        </button>
      </div>

      <ul style={{ marginTop: "2rem", listStyle: "none", padding: 0 }}>
        {questions.map((q) => (
          <li
            key={q.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <input
                type="number"
                value={q.questionNumber || ""}
                onChange={(e) => {
                  const updated = questions.map((item) =>
                    item.id === q.id
                      ? { ...item, questionNumber: Number(e.target.value) }
                      : item
                  );
                  setQuestions(updated);
                }}
                style={{
                  width: "70px",
                  padding: "0.4rem",
                }}
              />
              <input
                type="text"
                value={q.question}
                onChange={(e) => {
                  const updated = questions.map((item) =>
                    item.id === q.id
                      ? { ...item, question: e.target.value }
                      : item
                  );
                  setQuestions(updated);
                }}
                style={{
                  padding: "0.4rem",
                  width: "400px",
                  marginRight: "1rem",
                  marginBottom: "0.5rem",
                }}
              />
              <button onClick={() => handleDeleteQuestion(q.id)}>Delete</button>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <h4>Options</h4>
              {q.options.map((opt: any) => (
                <div
                  key={opt.id}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                    marginBottom: "0.3rem",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Text"
                    value={opt.text}
                    onChange={(e) =>
                      handleUpdateOption(q.id, opt.id, "text", e.target.value)
                    }
                    style={{ padding: "0.3rem", width: "180px" }}
                  />
                  <input
                    type="text"
                    placeholder="Icon"
                    value={opt.icon}
                    onChange={(e) =>
                      handleUpdateOption(q.id, opt.id, "icon", e.target.value)
                    }
                    style={{ padding: "0.3rem", width: "60px" }}
                  />
                  <input
                    type="text"
                    placeholder="Factor Value"
                    value={opt.factorValue}
                    onChange={(e) =>
                      handleUpdateOption(
                        q.id,
                        opt.id,
                        "factorValue",
                        e.target.value
                      )
                    }
                    style={{ padding: "0.3rem", width: "160px" }}
                  />
                  <button
                    onClick={() => handleDeleteOption(q.id, opt.id)}
                    style={{ color: "red" }}
                  >
                    X
                  </button>
                </div>
              ))}
              <button onClick={() => handleAddOption(q.id)}>+ Add Option</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
