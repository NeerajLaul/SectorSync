import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { Loader2, Search, AlertTriangle } from "lucide-react";

interface FindResultsPageProps {
    onLoadResults: (data: any) => void;
}

export function FindResultsPage({ onLoadResults }: FindResultsPageProps) {
    const [searchId, setSearchId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!searchId.trim()) {
            setError("Please enter a result ID.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/answers/${searchId.trim()}`);
            if (!res.ok) {
                setError("Result not found. Please check the ID and try again.");
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (onLoadResults) {
                onLoadResults({
                    ranking: data.results.map((r: any) => {
                        const val = parseFloat(String(r.score || 0));
                        return {
                            method: r.method,
                            score: isNaN(val) ? 0 : val,
                            contributions: []
                        };
                    }),
                    answers: data.answers,
                    engineVersion: "restored",
                    restored: true
                });
            }

        } catch (err) {
            console.error(err);
            setError("An error occurred while fetching the result.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-950/30">
            <Card className="w-full max-w-md p-8 glass-strong shadow-2xl border border-white/20 dark:border-white/10">
                <h2 className="text-2xl font-semibold mb-4 text-center">Find Your Assessment Result</h2>
                <p className="text-muted-foreground text-center mb-8">
                    Enter your unique Result ID below to view your stored results.
                </p>

                <div className="flex items-center gap-2 mb-4">
                    <Input
                        placeholder="Enter Result ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="flex-1"
                    />
                    <Button onClick={handleSearch} disabled={loading} className="gap-2">
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Loading
                            </>
                        ) : (
                            <>
                                <Search className="h-4 w-4" /> Fetch
                            </>
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <p className="text-xs text-center text-muted-foreground mt-6">
                    Tip: You can find your Result ID on the Results page after completing the assessment.
                </p>
            </Card>
        </div>
    );
}