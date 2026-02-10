"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import MatchBar from "@/components/MatchBar";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const res = await fetch("/api/recruiter/applicants");
                if (res.ok) {
                    const data = await res.json();
                    setCandidates(data);
                }
            } catch (error) {
                console.error("Failed to fetch applicants:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, []);

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "SHORTLISTED": return "default"; // or success variant if defined
            case "REJECTED": return "destructive";
            case "PENDING": return "secondary";
            default: return "outline";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">Candidates</h1>
                <Badge variant="outline" className="text-gray-400 border-white/10">
                    Total: {candidates.length}
                </Badge>
            </div>

            <div className="bg-[#060B1A]/50 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
                <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10 text-left">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Candidate</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Applied For</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Match Score</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/10">
                        {loading ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">Loading applicants...</td></tr>
                        ) : candidates.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-400">No applicants found yet.</td></tr>
                        ) : (
                            <AnimatePresence>
                                {candidates.map((c, index) => (
                                    <motion.tr
                                        key={c.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4 font-medium text-white">
                                            <Link href={`/recruiter/candidates/${c.candidateId}`} className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer">
                                                <span className="group-hover:text-blue-400 transition-colors font-bold">{c.name}</span>
                                                <span className="text-xs text-gray-500">Applied: {new Date(c.appliedAt).toLocaleDateString()}</span>
                                            </Link>
                                        </td>
                                        <td className="p-4 text-sm text-gray-300">{c.job}</td>
                                        <td className="p-4">
                                            <MatchBar score={c.match} />
                                        </td>
                                        <td className="p-4">
                                            <Badge variant={getStatusVariant(c.status) as any} className="bg-blue-500/20 text-blue-200 border-0">
                                                {c.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4">
                                            {c.resumeUrl ? (
                                                <a href={c.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
                                                    View PDF
                                                </a>
                                            ) : <span className="text-gray-600 text-sm">No Resume</span>}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
