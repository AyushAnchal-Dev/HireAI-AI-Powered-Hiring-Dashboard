"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import AnimatedBackground from "@/components/login/AnimatedBackground";
import { Loader2, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { signOut } from "next-auth/react";

type Job = {
    id: string;
    title: string;
    department: string;
    description: string;
    skills: string[];
};

type ScoredJob = Job & {
    matchScore: number;
    matchingSkills: string[];
    missingSkills: string[];
};

export default function CandidateDashboard() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [scoredJobs, setScoredJobs] = useState<ScoredJob[]>([]);
    const [skills, setSkills] = useState<string[]>([]);
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [applyingId, setApplyingId] = useState<string | null>(null);

    useEffect(() => {
        // Fetch Jobs
        fetch("/api/jobs")
            .then((res) => res.json())
            .then(setJobs)
            .catch(err => console.error("Failed to fetch jobs:", err));

        // Fetch Profile
        fetch("/api/candidate/resume")
            .then(res => res.json())
            .then(data => {
                if (data.skills) {
                    setSkills(data.skills);
                    setResumeUploaded(!!data.resumeUrl);
                }
            })
            .catch(err => console.error("Failed to fetch profile:", err));
    }, []);

    // Calculate matches whenever jobs or skills change
    useEffect(() => {
        if (jobs.length === 0) return;

        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, "");

        const processedJobs = jobs.map(job => {
            // If job has no explicit skills, we might default to description based or just 0
            if (!job.skills || job.skills.length === 0) {
                return { ...job, matchScore: 0, matchingSkills: [], missingSkills: [] };
            }

            const normalizedUserSkills = skills.map(normalize);

            const matching = job.skills.filter(jobSkill =>
                normalizedUserSkills.includes(normalize(jobSkill))
            );

            const missing = job.skills.filter(jobSkill =>
                !normalizedUserSkills.includes(normalize(jobSkill))
            );

            // Calculate percentage
            const matchScore = Math.round((matching.length / job.skills.length) * 100);

            return {
                ...job,
                matchScore,
                matchingSkills: matching,
                missingSkills: missing
            };
        });

        // Sort by match score descending
        processedJobs.sort((a, b) => b.matchScore - a.matchScore);

        setScoredJobs(processedJobs);
    }, [jobs, skills]);

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("resume", e.target.files[0]);

        try {
            const res = await fetch("/api/candidate/resume", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (res.ok) {
                setResumeUploaded(true);
                setSkills(data.skills || []);
                alert("Resume analyzed! Your skills have been extracted, and job matches updated.");
            } else {
                alert("Failed to upload resume: " + data.error);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setUploading(false);
        }
    };

    const handleApply = async (jobId: string) => {
        setApplyingId(jobId);
        try {
            const res = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobId }),
            });

            if (res.ok) {
                alert("Applied successfully!");
            } else {
                const data = await res.json();
                if (res.status === 409) {
                    alert("You have already applied to this job.");
                } else {
                    alert("Failed to apply: " + (data.error || "Unknown error"));
                }
            }
        } catch (err) {
            console.error(err);
            alert("Error applying to job");
        } finally {
            setApplyingId(null);
        }
    };

    // Use scoredJobs if we have any (or if empty but jobs existed), otherwise fallback (initial load)
    // Actually best to just always use scoredJobs logic if we want consistent ordering
    // But initially scoredJobs is empty until effect runs. 
    // If jobs exist but calculate effect hasn't run, we might see empty list.
    // Let's rely on scoredJobs being populated quickly or default to jobs if scoredJobs empty AND jobs not empty
    const displayJobs = scoredJobs.length > 0 ? scoredJobs : (jobs as ScoredJob[]);

    return (
        <main className="min-h-screen relative bg-black text-white selection:bg-blue-500/30">
            <AnimatedBackground />

            <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex justify-between items-center py-6 border-b border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FileText className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Candidate Portal
                        </h1>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/candidate/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/candidate/messages" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Messages</Link>
                        <Link href="/quizzes" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Assessments</Link>
                        <Link href="/problems" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Practice</Link>
                    </nav>

                    <Button onClick={() => signOut()} variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                        Log Out
                    </Button>
                </header>

                {/* Resume Upload Card */}
                <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-lg ${resumeUploaded ? "bg-green-500/20" : "bg-blue-500/20"}`}>
                            {resumeUploaded ? <CheckCircle className="text-green-400" /> : <FileText className="text-blue-400" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                {resumeUploaded ? "Resume Analysis Complete" : "Upload Your Resume"}
                            </h3>
                            <p className="text-sm text-gray-400">
                                {resumeUploaded
                                    ? "We've extracted your skills to match you with the best jobs."
                                    : "Upload to auto-fill your profile and get AI-matched jobs."}
                            </p>
                        </div>
                        <label className="ml-auto cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            {uploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
                            {uploading ? "Analyzing..." : (resumeUploaded ? "Update Resume" : "Upload PDF")}
                            <input type="file" accept=".pdf" className="hidden" onChange={handleResumeUpload} disabled={uploading} />
                        </label>
                    </div>

                    {/* Extracted Skills */}
                    {skills.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="border-t border-white/10 pt-4 mt-4"
                        >
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Extracted Skills</p>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill, i) => (
                                    <Badge key={i} variant="secondary" className="bg-white/10 hover:bg-white/20 text-blue-200 border-0">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="grid gap-6">
                    <h2 className="text-2xl font-semibold text-white">
                        {resumeUploaded ? "Best Job Matches For You" : "All Jobs"}
                    </h2>

                    {displayJobs.length === 0 ? (
                        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-gray-400">No active jobs found.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {displayJobs.map((job, i) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                {job.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 font-mono">
                                                {job.department || "Engineering"}
                                            </p>
                                        </div>
                                        {resumeUploaded && typeof job.matchScore === 'number' && (
                                            <div className="flex flex-col items-end">
                                                <div className={`
                                                    text-lg font-bold
                                                    ${job.matchScore >= 80 ? "text-green-400" :
                                                        job.matchScore >= 50 ? "text-yellow-400" : "text-red-400"}
                                                `}>
                                                    {job.matchScore}% Match
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-gray-300 line-clamp-3 mb-6 text-sm leading-relaxed flex-grow">
                                        {job.description}
                                    </p>

                                    {/* Skills Analysis */}
                                    {resumeUploaded && job.skills && job.skills.length > 0 && typeof job.matchScore === 'number' && (
                                        <div className="mb-6 p-4 bg-black/20 rounded-lg border border-white/5">
                                            <div className="mb-2">
                                                <span className="text-xs text-green-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                                                    <CheckCircle className="w-3 h-3" /> Matched Skills
                                                </span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {job.matchingSkills?.length > 0 ? job.matchingSkills.map(s => (
                                                        <span key={s} className="text-xs text-gray-300 bg-white/5 px-2 py-0.5 rounded">{s}</span>
                                                    )) : <span className="text-xs text-gray-500 italic">None</span>}
                                                </div>
                                            </div>

                                            {job.missingSkills?.length > 0 && (
                                                <div>
                                                    <span className="text-xs text-red-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" /> Missing
                                                    </span>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {job.missingSkills.map(s => (
                                                            <span key={s} className="text-xs text-gray-400 bg-white/5 px-2 py-0.5 rounded opacity-60">{s}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => handleApply(job.id)}
                                        disabled={applyingId === job.id}
                                        className="w-full mt-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-0 shadow-lg shadow-blue-500/20 transition-all"
                                    >
                                        {applyingId === job.id ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Applying...
                                            </>
                                        ) : "Apply Now"}
                                    </Button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
