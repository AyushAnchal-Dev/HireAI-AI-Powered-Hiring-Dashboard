"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Plus, Trash } from "lucide-react";

export default function CreateQuizPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [timeLimit, setTimeLimit] = useState(15);
    const [questions, setQuestions] = useState([
        { question: "", options: ["", "", "", ""], answer: 0 }
    ]);

    const addQuestion = () => {
        setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: 0 }]);
    };

    const removeQuestion = (idx: number) => {
        setQuestions(questions.filter((_, i) => i !== idx));
    };

    const updateQuestion = (idx: number, field: string, value: any) => {
        const newQs = [...questions];
        // @ts-ignore
        newQs[idx][field] = value;
        setQuestions(newQs);
    };

    const updateOption = (qIdx: number, oIdx: number, value: string) => {
        const newQs = [...questions];
        newQs[qIdx].options[oIdx] = value;
        setQuestions(newQs);
    };

    const handleSubmit = async () => {
        const res = await fetch("/api/quizzes", {
            method: "POST",
            body: JSON.stringify({ title, timeLimit, questions })
        });
        if (res.ok) {
            router.push("/quizzes");
        }
    };

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12 max-w-3xl">
                <h1 className="text-3xl font-bold text-white mb-8">Create New Quiz</h1>

                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Quiz Title</label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} className="bg-white/5 border-white/10 text-white mt-1" />
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Time Limit (minutes)</label>
                            <Input type="number" value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value))} className="bg-white/5 border-white/10 text-white mt-1" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, idx) => (
                            <div key={idx} className="glass-card p-6 rounded-2xl relative">
                                <Button variant="ghost" size="icon" onClick={() => removeQuestion(idx)} className="absolute top-4 right-4 text-red-400 hover:bg-red-900/20">
                                    <Trash size={16} />
                                </Button>
                                <h3 className="text-white font-semibold mb-4">Question {idx + 1}</h3>

                                <div className="space-y-4">
                                    <Input
                                        placeholder="Enter question text..."
                                        value={q.question}
                                        onChange={e => updateQuestion(idx, 'question', e.target.value)}
                                        className="bg-white/5 border-white/10 text-white"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        {q.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex gap-2 items-center">
                                                <input
                                                    type="radio"
                                                    name={`q-${idx}`}
                                                    checked={q.answer === oIdx}
                                                    onChange={() => updateQuestion(idx, 'answer', oIdx)}
                                                    className="accent-blue-500"
                                                />
                                                <Input
                                                    placeholder={`Option ${oIdx + 1}`}
                                                    value={opt}
                                                    onChange={e => updateOption(idx, oIdx, e.target.value)}
                                                    className="bg-white/5 border-white/10 text-white text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={addQuestion} variant="outline" className="w-full border-dashed border-white/20 text-gray-400 hover:text-white hover:bg-white/5">
                            <Plus size={16} className="mr-2" /> Add Question
                        </Button>
                    </div>

                    <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-500 py-6 text-lg">
                        Publish Quiz
                    </Button>
                </div>
            </main>
        </div>
    );
}
