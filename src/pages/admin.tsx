// src/pages/admin.tsx
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Download, RefreshCw, Trash2, Plus } from "lucide-react";

export default function AdminPage() {
    const [summary, setSummary] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [methods, setMethods] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("questions");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [answers, setAnswers] = useState<any[]>([]);

    const fetchAnswers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/admin/answers");
            const json = await res.json();
            if (json.success && Array.isArray(json.answers)) setAnswers(json.answers);
        } catch (err) {
            console.error("Failed to load answers:", err);
        }
    };


    const fetchSummary = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/admin/summary");
            const json = await res.json();
            if (json.success) setSummary(json.summary);
        } catch (err) {
            console.error("Failed to load summary:", err);
        }
    };

    const fetchQuestions = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/questions");
            const data = await res.json();
            setQuestions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch questions:", err);
        }
    };

    const fetchMethods = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/methods");
            const data = await res.json();
            setMethods(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch methods:", err);
        }
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: `q${Date.now()}`,
            question: "",
            description: "",
            options: [],
        };
        setQuestions([...questions, newQuestion]);
    };

    const handleAddOption = (qid: string) => {
        setQuestions(
            questions.map((q) =>
                q.id === qid
                    ? {
                        ...q,
                        options: [
                            ...q.options,
                            {
                                id: `${qid}-opt${q.options.length + 1}`,
                                text: "",
                                factorValue: "",
                            },
                        ],
                    }
                    : q
            )
        );
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm("Delete this question?")) return;
        setQuestions(questions.filter((q) => q.id !== id));
        await fetch(`http://localhost:5000/api/questions/${id}`, { method: "DELETE" });
    };

    const handleDeleteOption = (qid: string, oid: string) => {
        setQuestions(
            questions.map((q) =>
                q.id === qid
                    ? { ...q, options: q.options.filter((opt: any) => opt.id !== oid) }
                    : q
            )
        );
    };

    const handleSaveQuestions = async () => {
        try {
            await fetch("http://localhost:5000/api/questions/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(questions),
            });
            setMessage("✅ Questions saved successfully.");
            fetchSummary();
        } catch {
            setMessage("❌ Failed to save questions.");
        }
    };

    const handleSaveMethods = async () => {
        try {
            await fetch("http://localhost:5000/api/methods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(methods),
            });
            setMessage("✅ Methods saved successfully.");
            fetchSummary();
        } catch {
            setMessage("❌ Failed to save methods.");
        }
    };

    const handleResetAnswers = async () => {
        if (!confirm("Are you sure you want to delete all saved answers?")) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/admin/reset/answers", {
                method: "DELETE",
            });
            const json = await res.json();
            setMessage(json.message || "✅ Answers cleared.");
            fetchSummary();
        } catch (err) {
            setMessage("❌ Failed to reset answers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
        fetchQuestions();
        fetchMethods();
        fetchAnswers();
    }, []);

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
            <div className="max-w-6xl mx-auto space-y-8">
                <h1 className="text-3xl font-semibold text-center mb-8">Admin Dashboard</h1>

                {/* Summary Section */}
                <Card className="p-6 space-y-4 shadow-lg border border-primary/10">
                    <h2 className="text-xl font-medium mb-2">📊 Data Summary</h2>
                    {summary ? (
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <Badge variant="secondary" className="mb-1">Methods</Badge>
                                <div className="text-2xl font-semibold">{summary.methods_count}</div>
                            </div>
                            <div>
                                <Badge variant="secondary" className="mb-1">Questions</Badge>
                                <div className="text-2xl font-semibold">{summary.questions_count}</div>
                            </div>
                            <div>
                                <Badge variant="secondary" className="mb-1">Answers</Badge>
                                <div className="text-2xl font-semibold">{summary.answers_count}</div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Loading summary...</p>
                    )}
                </Card>

                {/* Actions */}
                <Card className="p-6 space-y-4 shadow-lg border border-primary/10">
                    <h2 className="text-xl font-medium mb-2">⚙️ Admin Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Button variant="destructive" onClick={handleResetAnswers} disabled={loading}>
                            <Trash2 className="w-4 h-4 mr-2" /> Reset Answers
                        </Button>
                        <Button variant="outline" onClick={fetchSummary} disabled={loading}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Summary
                        </Button>
                    </div>
                    {message && <p className="text-sm text-muted-foreground">{message}</p>}
                </Card>

                {/* Tabs for inline editing */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="questions">Questions</TabsTrigger>
                        <TabsTrigger value="methods">Methods</TabsTrigger>
                        <TabsTrigger value="answers">Answers</TabsTrigger>
                    </TabsList>


                    {/* Questions Tab */}
                    <TabsContent value="questions">
                        <Card className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">🧩 Questions</h2>
                                <Button onClick={handleAddQuestion}><Plus className="w-4 h-4 mr-2" /> Add Question</Button>
                            </div>

                            <div className="space-y-6">
                                {questions.map((q) => (
                                    <div key={q.id} className="border rounded-lg p-4 bg-white/50 dark:bg-slate-800/50">
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={q.question}
                                                onChange={(e) =>
                                                    setQuestions(questions.map((item) =>
                                                        item.id === q.id ? { ...item, question: e.target.value } : item
                                                    ))
                                                }
                                                placeholder="Question text"
                                                className="flex-1 border rounded p-2"
                                            />
                                            <Button variant="destructive" onClick={() => handleDeleteQuestion(q.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="ml-4 space-y-2">
                                            <h4 className="text-sm font-medium">Options</h4>
                                            {q.options.map((opt: any) => (
                                                <div key={opt.id} className="flex gap-2 items-center">
                                                    <input
                                                        type="text"
                                                        value={opt.text}
                                                        onChange={(e) =>
                                                            setQuestions(questions.map((item) =>
                                                                item.id === q.id
                                                                    ? {
                                                                        ...item,
                                                                        options: item.options.map((o: any) =>
                                                                            o.id === opt.id ? { ...o, text: e.target.value } : o
                                                                        ),
                                                                    }
                                                                    : item
                                                            ))
                                                        }
                                                        placeholder="Option text"
                                                        className="border rounded p-2 flex-1"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={opt.factorValue}
                                                        onChange={(e) =>
                                                            setQuestions(questions.map((item) =>
                                                                item.id === q.id
                                                                    ? {
                                                                        ...item,
                                                                        options: item.options.map((o: any) =>
                                                                            o.id === opt.id ? { ...o, factorValue: e.target.value } : o
                                                                        ),
                                                                    }
                                                                    : item
                                                            ))
                                                        }
                                                        placeholder="Factor value"
                                                        className="border rounded p-2 w-40"
                                                    />
                                                    <Button variant="destructive" onClick={() => handleDeleteOption(q.id, opt.id)}>X</Button>
                                                </div>
                                            ))}
                                            <Button size="sm" onClick={() => handleAddOption(q.id)}>
                                                + Add Option
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={handleSaveQuestions} className="mt-4">💾 Save Questions</Button>
                        </Card>
                    </TabsContent>

                    {/* Methods Tab */}
                    <TabsContent value="methods">
                        <Card className="p-6 space-y-4">
                            <h2 className="text-xl font-medium">🧠 Methods</h2>
                            {methods.map((m, i) => (
                                <div key={i} className="border rounded-lg p-4 bg-white/50 dark:bg-slate-800/50 space-y-2">
                                    <input
                                        type="text"
                                        value={m.name}
                                        onChange={(e) =>
                                            setMethods(methods.map((mm, idx) =>
                                                idx === i ? { ...mm, name: e.target.value } : mm
                                            ))
                                        }
                                        placeholder="Method name"
                                        className="border rounded p-2 w-full"
                                    />
                                    <textarea
                                        value={m.description || ""}
                                        onChange={(e) =>
                                            setMethods(methods.map((mm, idx) =>
                                                idx === i ? { ...mm, description: e.target.value } : mm
                                            ))
                                        }
                                        placeholder="Description"
                                        className="border rounded p-2 w-full h-20"
                                    />
                                </div>
                            ))}
                            <Button onClick={handleSaveMethods} className="mt-4">💾 Save Methods</Button>
                        </Card>
                    </TabsContent>
                    <TabsContent value="answers">
                        <Card className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium">🧾 Saved Answers</h2>
                                <Button variant="outline" onClick={fetchAnswers}>
                                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                                </Button>
                            </div>

                            {answers.length > 0 ? (
                                <div className="space-y-6">
                                    {answers.map((entry, idx) => (
                                        <div
                                            key={idx}
                                            className="border rounded-lg p-4 bg-white/60 dark:bg-slate-800/60 shadow-sm"
                                        >
                                            <div className="flex justify-between text-sm text-muted-foreground mb-2">
                                                <span>Entry #{idx + 1}</span>
                                                <span>{new Date(entry.timestamp).toLocaleString()}</span>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                                                {Object.entries(entry.answers).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between border-b pb-1">
                                                        <span className="font-medium capitalize">{key.replace(/_/g, " ")}</span>
                                                        <span>{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4">
                                                <h4 className="font-medium mb-1">Top Results:</h4>
                                                <ul className="space-y-1 text-sm">
                                                    {entry.results
                                                        .sort((a, b) => b.score - a.score)
                                                        .slice(0, 3)
                                                        .map((r, i) => (
                                                            <li key={i} className="flex justify-between">
                                                                <span>{r.method}</span>
                                                                <span className="font-mono">{r.score.toFixed(3)}</span>
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No answers found.</p>
                            )}
                        </Card>
                    </TabsContent>


                </Tabs>
            </div>
        </div>
    );
}
