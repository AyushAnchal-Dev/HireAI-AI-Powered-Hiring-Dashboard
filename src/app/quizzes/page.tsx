"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

interface Quiz {
    id: string;
    title: string;
    timeLimit: number;
    recruiter: { name: string };
}

export default function QuizzesPage() {
    const { data: session } = useSession();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await fetch("/api/quizzes");
                const data = await res.json();
                if (Array.isArray(data)) {
                    const unique = data.filter((q, index, self) =>
                        index === self.findIndex((t) => t.id === q.id || t.title === q.title)
                    );
                    setQuizzes(unique);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const role = (session?.user as any)?.role || "candidate";

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Skill Assessments</h1>
                        <p className="text-gray-400">Take quizzes to prove your skills.</p>
                    </div>
                    {role === 'recruiter' && (
                        <Link href="/quizzes/create">
                            <Button className="bg-blue-600 hover:bg-blue-500 gap-2">
                                <Plus size={16} /> Create Quiz
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((q, i) => (
                        <motion.div
                            key={q.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all group"
                        >
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{q.title}</h3>
                            <div className="text-sm text-gray-400 mb-6 flex justify-between">
                                <span>{q.timeLimit} mins</span>
                                <span>By {q.recruiter?.name || "Recruiter"}</span>
                            </div>
                            <Link href={`/quizzes/${q.id}`}>
                                <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                    Start Quiz
                                </Button>
                            </Link>
                        </motion.div>
                    ))}

                    {!loading && !quizzes.length && (
                        <p className="text-gray-500 col-span-full text-center py-10">No quizzes available yet.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
