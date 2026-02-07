"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function RecruiterProfile() {
    return (
        <div className="space-y-8">
            {/* HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 rounded-3xl glass-card relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 z-0" />
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Recruiter Dashboard</h2>
                        <p className="text-gray-300">Manage your hiring pipeline and assessments.</p>
                    </div>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-500">
                        <Plus size={16} /> Post New Job
                    </Button>
                </div>
            </motion.div>

            {/* STATS GRID */}
            <StatsGrid />

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 rounded-2xl"
                >
                    <h3 className="text-xl font-semibold text-white mb-4">Assessment Library</h3>
                    <p className="text-gray-400 mb-6 text-sm">Create and manage coding problems and quizzes.</p>
                    <Link href="/problems/create">
                        <Button variant="outline" className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10">
                            Create New Problem
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 rounded-2xl"
                >
                    <h3 className="text-xl font-semibold text-white mb-4">Candidate Search</h3>
                    <p className="text-gray-400 mb-6 text-sm">Find top talent using AI-powered matching.</p>
                    <Button variant="outline" className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                        Search Database
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}

function StatsGrid() {
    const [stats, setStats] = useState({ activeJobs: 0, applicants: 0, shortlisted: 0 });

    useEffect(() => {
        fetch("/api/recruiter/stats").then(res => res.json()).then(setStats).catch(console.error);
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { label: "Active Jobs", value: stats.activeJobs, color: "text-blue-400" },
                { label: "Candidates", value: stats.applicants, color: "text-purple-400" },
                { label: "In Progress", value: stats.shortlisted, color: "text-green-400" },
            ].map((stat, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center"
                >
                    <span className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</span>
                    <span className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</span>
                </motion.div>
            ))}
        </div>
    );
}
