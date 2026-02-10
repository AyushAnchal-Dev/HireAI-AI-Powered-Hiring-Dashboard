"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BrainCircuit, Timer, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface Quiz {
    id: string;
    title: string;
    timeLimit: number;
    recruiter: { name: string };
    _count?: {
        questions: number;
    }
}

export default function RecruiterQuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/quizzes")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setQuizzes(data);
                else console.error("Invalid quizzes data", data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent inline-block">
                        Skill Assessments
                    </h1>
                    <p className="text-gray-400 mt-1 text-lg">
                        Create and manage quizzes to test candidate skills.
                    </p>
                </div>
                <Link href="/quizzes/create">
                    <Button className="bg-blue-600 hover:bg-blue-500 gap-2 shadow-lg hover:shadow-blue-500/20">
                        <Plus size={16} /> Create New Quiz
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((q, i) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all group flex flex-col p-6 h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">
                                    ID: {q.id.slice(0, 4)}...
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                                {q.title}
                            </h3>

                            <div className="flex flex-col gap-2 mb-6 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Timer className="w-4 h-4" />
                                    <span>{q.timeLimit} minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>By {q.recruiter?.name || "You"}</span>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-3">
                                <Link href={`/quizzes/${q.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/10">
                                        View
                                    </Button>
                                </Link>
                                <Button className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                    Results
                                </Button>
                            </div>
                        </motion.div>
                    ))}

                    {!loading && quizzes.length === 0 && (
                        <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                            <BrainCircuit className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-300">No quizzes found</h3>
                            <p className="text-gray-500 mt-2 mb-6">Create your first assessment to start screening candidates.</p>
                            <Link href="/quizzes/create">
                                <Button className="bg-blue-600 hover:bg-blue-500">
                                    Create Quiz
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
