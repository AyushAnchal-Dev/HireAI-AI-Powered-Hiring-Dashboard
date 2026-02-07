"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast, ToastProvider } from "@/components/ui/use-toast";

function JobDetailContent({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const [job, setJob] = useState<any>(null);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    useEffect(() => {
        fetch(`/api/jobs`) // In real app, fetch /api/jobs/${params.id}
            .then(res => res.json())
            .then(data => {
                const found = data.find((j: any) => j.id === params.id);
                setJob(found);
            });
    }, [params.id]);

    const handleApply = async () => {
        setApplying(true);
        try {
            const res = await fetch(`/api/jobs/${params.id}/apply`, {
                method: "POST",
                body: JSON.stringify({ coverLetter: "Applied via button" })
            });

            if (res.ok) {
                setApplied(true);
                toast({ title: "Application Sent!", description: "Good luck!" });
            } else {
                const msg = await res.text();
                toast({ title: "Error", description: msg, variant: "destructive" });
                if (msg.includes("Already")) setApplied(true);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setApplying(false);
        }
    };

    if (!job) return <div className="text-white p-10">Loading Job...</div>;

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12 max-w-4xl">
                <div className="glass-card p-8 rounded-3xl mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                            <p className="text-xl text-blue-400">{job.company}</p>
                        </div>
                        <Badge className="bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 text-lg px-4 py-1">{job.type}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm text-gray-300">
                        <div className="bg-white/5 p-3 rounded-xl">📍 {job.location}</div>
                        <div className="bg-white/5 p-3 rounded-xl">💰 {job.salary}</div>
                        <div className="bg-white/5 p-3 rounded-xl">📅 Posted 2d ago</div>
                        <div className="bg-white/5 p-3 rounded-xl">👥 12 Applicants</div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
                    <div className="prose prose-invert max-w-none text-gray-300 mb-8">
                        <p>{job.description || "Join our team to build the future of AI."}</p>
                    </div>

                    <Button
                        size="lg"
                        className={`w-full py-6 text-lg ${applied ? 'bg-green-600/20 text-green-400' : 'bg-blue-600 hover:bg-blue-500'}`}
                        onClick={handleApply}
                        disabled={applying || applied}
                    >
                        {applied ? "Applied ✅" : applying ? "Sending..." : "Apply Now"}
                    </Button>
                </div>
            </main>
        </div>
    );
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
    return (
        <ToastProvider>
            <JobDetailContent params={params} />
        </ToastProvider>
    )
}
