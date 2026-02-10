"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Problem {
    id: string;
    title: string;
    difficulty: string;
    tags: string[];
}

interface QuestionPack {
    id: string;
    title: string;
    type: string;
    problems: Problem[];
}

export default function ProblemsPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [packs, setPacks] = useState<QuestionPack[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Problems
                const problemsRes = await fetch("/api/problems");
                if (!problemsRes.ok) throw new Error("Failed to fetch problems");
                const problemsData = await problemsRes.json();

                if (Array.isArray(problemsData)) {
                    // Filter duplicates by title to ensure unique listing
                    const uniqueProblems = problemsData.filter((p, index, self) =>
                        index === self.findIndex((t) => (
                            t.title === p.title
                        ))
                    );
                    setProblems(uniqueProblems);
                } else {
                    console.error("API returned non-array for problems:", problemsData);
                    setProblems([]);
                }

                // Fetch Packs
                const packsRes = await fetch("/api/question-packs");
                if (packsRes.ok) {
                    const packsData = await packsRes.json();
                    if (Array.isArray(packsData)) setPacks(packsData);
                }

            } catch (err) {
                console.error(err);
                setError("Failed to load content. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#060B1A] flex items-center justify-center text-white">Loading Challenges...</div>;

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2">Coding Challenges</h1>
                    <p className="text-gray-400">Daily packs and AI-curated problems.</p>
                </div>

                {error && <div className="p-4 bg-red-500/20 text-red-400 rounded-lg mb-6">{error}</div>}

                {/* PACKS SECTION */}
                {packs.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                            🔥 Daily Packs
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {packs.map(pack => (
                                <motion.div
                                    key={pack.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 rounded-2xl glass-card border border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <Badge className="bg-purple-500 text-white hover:bg-purple-600">{pack.type}</Badge>
                                        <span className="text-xs text-purple-300">{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{pack.title}</h3>
                                    <p className="text-sm text-gray-400 mb-6">{pack.problems.length} Problems • Automatic Grading</p>

                                    <div className="space-y-2">
                                        {pack.problems.slice(0, 3).map(p => (
                                            <div key={p.id} className="flex items-center gap-2 text-sm text-gray-300">
                                                <div className={`w-2 h-2 rounded-full ${p.difficulty === 'Easy' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                {p.title}
                                            </div>
                                        ))}
                                    </div>

                                    <Link href={`/problems/${pack.problems[0]?.id || ''}`}>
                                        <button className="w-full mt-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity">
                                            Start Pack
                                        </button>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-semibold text-white mb-6">All Problems</h2>

                <div className="grid gap-4">
                    {problems.length === 0 && !loading && <p className="text-gray-500">No individual problems found.</p>}
                    {problems.map((p, i) => (
                        <Link key={p.id} href={`/problems/${p.id}`}>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card p-6 rounded-xl hover:bg-white/10 transition-colors flex justify-between items-center cursor-pointer border border-white/5"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                                    <div className="flex gap-2">
                                        {p.tags.map(t => (
                                            <Badge key={t} variant="outline" className="text-xs border-gray-700 text-gray-400">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${p.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                        p.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'}`}>
                                    {p.difficulty}
                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    {!loading && !error && problems.length === 0 && (
                        <p className="text-gray-500 text-center py-10">No problems found. Check back later!</p>
                    )}
                </div>
            </main>
        </div>
    );
}
