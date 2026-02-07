"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import CodeEditor from "@/components/ui/CodeEditor";

export default function ProblemDetail({ params }: { params: { id: string } }) {
    const [problem, setProblem] = useState<any>(null);
    const [code, setCode] = useState("// Write your solution here...");
    const [result, setResult] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`/api/problems/${params.id}`)
            .then(res => {
                if (!res.ok) {
                    if (res.status === 404) throw new Error("Problem not found");
                    throw new Error("Failed to load problem");
                }
                return res.json();
            })
            .then(data => setProblem(data))
            .catch(err => {
                console.error(err);
                setError(err.message);
            });
    }, [params.id]);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/run-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problemId: params.id,
                    code,
                    language: "javascript"
                })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (error) return (
        <div className="min-h-screen bg-[#060B1A] flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center text-red-400">
                Error: {error}. Please go back to the <a href="/problems" className="ml-1 underline text-blue-400">Problems List</a>.
            </div>
        </div>
    );

    if (!problem) return <div className="text-white p-10">Loading Problem...</div>;

    return (
        <div className="min-h-screen bg-[#060B1A] flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-6 pt-24 pb-6 grid md:grid-cols-2 gap-6">

                {/* LEFT: PROBLEM DESCRIPTION */}
                <div className="glass-card p-6 rounded-2xl h-fit">
                    <h1 className="text-2xl font-bold text-white mb-4">{problem.title}</h1>
                    <div className="flex gap-2 mb-6">
                        <span className="bg-white/10 text-xs px-2 py-1 rounded text-gray-300">{problem.difficulty}</span>
                    </div>
                    <div className="prose prose-invert max-w-none text-gray-300">
                        <p>{problem.description || "No description provided."}</p>
                    </div>
                </div>

                {/* RIGHT: EDITOR */}
                <div className="flex flex-col gap-4">
                    <div className="bg-[#1e1e1e] rounded-xl border border-white/10 flex-1 flex flex-col overflow-hidden min-h-[400px]">
                        <div className="bg-[#2d2d2d] px-4 py-2 border-b border-white/5 flex justify-between items-center">
                            <span className="text-xs text-gray-400">main.js</span>
                            <span className="text-xs text-green-400">Online Runner</span>
                        </div>
                        <CodeEditor
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            language="javascript"
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-green-600 hover:bg-green-500">
                            {submitting ? "Running Tests..." : "Run Code"}
                        </Button>

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 p-4 rounded-xl border border-white/10"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <span className={`text-lg font-bold ${result.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
                                        {result.status}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Passed: {result.passedTests} / {result.totalTests}
                                    </span>
                                </div>

                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {result.results?.map((res: any, idx: number) => (
                                        <div key={idx} className={`p-2 rounded text-xs border ${res.passed ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                            <div className="flex justify-between mb-1">
                                                <span className="font-semibold text-gray-300">Test Case {idx + 1}</span>
                                                <span className={res.passed ? "text-green-400" : "text-red-400"}>{res.passed ? "Passed" : "Failed"}</span>
                                            </div>
                                            {!res.passed && (
                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                    <div>
                                                        <span className="block text-[10px] text-gray-500">Input</span>
                                                        <code className="text-gray-300">{res.input}</code>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] text-gray-500">Expected</span>
                                                        <code className="text-yellow-300">{res.expectedOutput}</code>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
