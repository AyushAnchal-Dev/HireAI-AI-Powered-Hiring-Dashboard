"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";





interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
}

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);

    useEffect(() => {
        fetch("/api/jobs")
            .then(res => res.json())
            .then(data => setJobs(data));
    }, []);

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12">
                <h1 className="text-4xl font-bold text-white mb-2">Explore Jobs</h1>
                <p className="text-gray-400 mb-10">Find your next role in AI and Tech.</p>

                <div className="space-y-4">
                    {jobs.map((job, i) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-blue-500/30 transition-all group"
                        >
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">{job.title}</h3>
                                <p className="text-gray-400">{job.company} • {job.location}</p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="border-white/10 text-gray-400">{job.type}</Badge>
                                    <Badge variant="outline" className="border-white/10 text-gray-400">{job.salary}</Badge>
                                </div>
                            </div>
                            <Link href={`/jobs/${job.id}`}>
                                <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10">
                                    View Details
                                </Button>
                            </Link>
                        </motion.div>
                    ))}
                    {!jobs.length && <p className="text-gray-500 text-center py-10">No active jobs found.</p>}
                </div>
            </main>
        </div>
    );
}
