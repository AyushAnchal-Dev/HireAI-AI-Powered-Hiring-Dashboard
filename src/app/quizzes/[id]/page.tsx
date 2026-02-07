"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function TakeQuizPage({ params }: { params: { id: string } }) {
    const [quiz, setQuiz] = useState<any>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timer, setTimer] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState<{ score: number, total: number } | null>(null);

    useEffect(() => {
        fetch(`/api/quizzes/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setQuiz(data);
                setAnswers(new Array(data.questions.length).fill(-1));
                setTimer(data.timeLimit * 60);
            });
    }, [params.id]);

    useEffect(() => {
        if (timer > 0 && !submitted) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0 && quiz && !submitted) {
            handleSubmit(); // Auto submit
        }
    }, [timer, submitted, quiz]);

    const handleSubmit = async () => {
        setSubmitted(true);
        const res = await fetch(`/api/quizzes/${params.id}/submit`, {
            method: "POST",
            body: JSON.stringify({ answers })
        });
        const data = await res.json();
        setScore(data);
    };

    if (!quiz) return <div className="text-white p-10">Loading Quiz...</div>;

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    if (submitted && score) {
        return (
            <div className="min-h-screen bg-[#060B1A] flex flex-col items-center justify-center p-6">
                <Navbar />
                <div className="glass-card p-10 rounded-3xl text-center max-w-lg w-full">
                    <h1 className="text-3xl font-bold text-white mb-4">Quiz Completed!</h1>
                    <div className="text-6xl font-extrabold text-blue-400 mb-4">
                        {Math.round((score.score / score.total) * 100)}%
                    </div>
                    <p className="text-gray-300 text-lg mb-8">
                        You scored {score.score} out of {score.total} correct.
                    </p>
                    <Button onClick={() => window.location.href = '/quizzes'} className="bg-white/10 hover:bg-white/20">
                        Back to Quizzes
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12 max-w-3xl">
                <div className="flex justify-between items-center mb-8 sticky top-20 bg-[#060B1A]/90 p-4 rounded-xl border border-white/10 z-10 backdrop-blur">
                    <h1 className="text-xl font-bold text-white truncate max-w-md">{quiz.title}</h1>
                    <div className={`text-2xl font-mono font-bold ${timer < 60 ? 'text-red-500' : 'text-blue-400'}`}>
                        {formatTime(timer)}
                    </div>
                </div>

                <div className="space-y-8">
                    {quiz.questions.map((q: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-6 rounded-2xl"
                        >
                            <h3 className="text-lg text-white font-medium mb-4">
                                <span className="opacity-50 mr-2">{idx + 1}.</span> {q.question}
                            </h3>
                            <div className="grid gap-3">
                                {q.options.map((opt: string, oIdx: number) => (
                                    <button
                                        key={oIdx}
                                        onClick={() => {
                                            const newAns = [...answers];
                                            newAns[idx] = oIdx;
                                            setAnswers(newAns);
                                        }}
                                        className={`text-left p-4 rounded-xl border transition-all ${answers[idx] === oIdx
                                                ? 'bg-blue-600/20 border-blue-500 text-white'
                                                : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 flex justify-end">
                    <Button onClick={handleSubmit} size="lg" className="bg-green-600 hover:bg-green-500 px-8">
                        Submit Quiz
                    </Button>
                </div>
            </main>
        </div>
    );
}
