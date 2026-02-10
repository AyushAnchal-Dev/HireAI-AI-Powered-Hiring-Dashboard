"use client";

import { useEffect, useState } from "react";
import { Loader2, Zap, Code, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type Problem = {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    tags: string[];
    createdAt?: string;
};

export default function ProblemsPage() {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Easy",
        tags: ""
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetch("/api/problems")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setProblems(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/problems", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
                })
            });
            if (!res.ok) throw new Error("Failed to create");
            const newProblem = await res.json();
            setProblems([newProblem, ...problems]);
            setIsOpen(false);
            setFormData({ title: "", description: "", difficulty: "Easy", tags: "" });
        } catch (err) {
            console.error(err);
            alert("Failed to create problem");
        } finally {
            setCreating(false);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff.toLowerCase()) {
            case 'easy': return 'bg-green-500/20 text-green-400';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400';
            case 'hard': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent inline-block">
                        Coding Problems
                    </h1>
                    <p className="text-gray-400 mt-1 text-lg">
                        Manage technical interview challenges.
                    </p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-500 shadow-lg gap-2">
                            <Plus className="w-4 h-4" /> Create Problem
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0D1526] border-white/10 text-white sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Create New Problem</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreate} className="space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. Reverse Linked List"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Difficulty</label>
                                <select
                                    value={formData.difficulty}
                                    onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 [&>option]:bg-slate-800"
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Problem statement..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                                <input
                                    value={formData.tags}
                                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="arrays, dynamic programming"
                                />
                            </div>
                            <Button type="submit" disabled={creating} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Problem"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading problems...</div>
            ) : problems.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                    <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white">No problems yet</h3>
                    <p className="text-gray-400 mt-1">Create your first coding challenge to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {problems.map((problem) => (
                        <div key={problem.id} className="group bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all hover:border-blue-500/30">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                                    {problem.difficulty}
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-blue-400 transition-colors">
                                    <Code className="w-4 h-4" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{problem.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                                {problem.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {problem.tags && problem.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-black/20 text-gray-400 px-2 py-1 rounded border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
