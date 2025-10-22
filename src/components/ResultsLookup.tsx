import { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ResultsCard } from './ResultsCard';
import { Loader2, Search } from 'lucide-react';

// ✅ Import the same methodology definitions from App
import { methodologies } from '../utils/Methods';

export function ResultsLookupPage({ onBack }: { onBack: () => void }) {
    const [searchId, setSearchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<any[]>([]);
    const [submissionId, setSubmissionId] = useState<string | null>(null);

    const handleFetch = async () => {
        if (!searchId.trim()) return;
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const res = await fetch(`/api/answers/${searchId}`);
            if (!res.ok) throw new Error('Invalid or not found');
            const data = await res.json();

            // ✅ Convert minimal format to full structure using methodologies constant
            const mappedResults = data.results.map((r: any) => ({
                ...methodologies[r.method],
                score: r.score,
                key: r.method,
            }));

            setResults(mappedResults);
            setSubmissionId(searchId);
        } catch (err: any) {
            setError('Could not find a submission with that ID.');
        } finally {
            setLoading(false);
        }
    };

    // ✅ If we have results, show the ResultsCard
    if (results.length > 0) {
        return (
            <ResultsCard
                results={results}
                submissionId={submissionId || undefined}
                onRestart={onBack}
            />
        );
    }

    // ✅ Otherwise show lookup UI
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl mx-auto text-center py-16"
        >
            <Card className="p-8 bg-gradient-to-br from-[#FFF5E6] to-white dark:from-[#2C4F5E] dark:to-[#1A2A33] border-[#F5A623]/30 border-2 shadow-sm">
                <h1 className="text-2xl font-semibold mb-4">Retrieve Your Results</h1>
                <p className="text-muted-foreground mb-6">
                    Enter your response ID below to view your saved results.
                </p>

                <div className="flex gap-2 justify-center mb-4">
                    <Input
                        placeholder="Enter response ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button
                        onClick={handleFetch}
                        disabled={loading}
                        className="bg-gradient-to-r from-[#F5A623] to-[#F8C545] text-white hover:from-[#E09615] hover:to-[#E6B637] border-0"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Search className="w-4 h-4 mr-1" />
                        )}
                        Search
                    </Button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <Button
                    onClick={onBack}
                    variant="ghost"
                    className="mt-6 text-muted-foreground hover:text-[#F5A623]"
                >
                    ← Back
                </Button>
            </Card>
        </motion.div>
    );
}
