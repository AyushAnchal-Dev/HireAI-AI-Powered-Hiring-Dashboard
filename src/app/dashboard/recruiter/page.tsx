"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast, ToastProvider } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Application {
    id: string;
    status: string;
    candidate: { name: string; email: string };
    job: { title: string };
    createdAt: string;
}

function DashboardContent() {
    const { toast } = useToast();
    const [applications, setApplications] = useState<Application[]>([]);
    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        fetch("/api/applications").then(res => res.json()).then(setApplications);
        fetch("/api/analytics").then(res => res.json()).then(setAnalytics);
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const res = await fetch("/api/applications", {
            method: "PATCH",
            body: JSON.stringify({ applicationId: id, status })
        });
        if (res.ok) {
            setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
            toast({ title: "Status Updated", description: `Application marked as ${status}` });
        }
    };

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12">
                <h1 className="text-3xl font-bold text-white mb-8">Recruiter Dashboard</h1>

                {/* ANALYTICS SECTION */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <div className="glass-card p-6 rounded-2xl h-[300px]">
                        <h3 className="text-white font-semibold mb-4">Views vs Applications</h3>
                        {analytics ? (
                            <ResponsiveContainer width="100%" height="90%">
                                <BarChart data={analytics.views}>
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e1e1e', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="applications" fill="#a855f7" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="text-gray-500 flex justify-center items-center h-full">Loading Chart...</div>}
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="text-white font-semibold mb-4">Hiring Pipeline</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-500/10 p-4 rounded-xl text-center">
                                <span className="block text-3xl font-bold text-blue-400">{applications.length}</span>
                                <span className="text-sm text-gray-400">Total Applications</span>
                            </div>
                            <div className="bg-purple-500/10 p-4 rounded-xl text-center">
                                <span className="block text-3xl font-bold text-purple-400">
                                    {applications.filter(a => a.status === 'ACCEPTED').length}
                                </span>
                                <span className="text-sm text-gray-400">Hired</span>
                            </div>
                            <div className="bg-yellow-500/10 p-4 rounded-xl text-center">
                                <span className="block text-3xl font-bold text-yellow-400">
                                    {applications.filter(a => a.status === 'PENDING').length}
                                </span>
                                <span className="text-sm text-gray-400">Pending Review</span>
                            </div>
                            <div className="bg-red-500/10 p-4 rounded-xl text-center">
                                <span className="block text-3xl font-bold text-red-400">
                                    {applications.filter(a => a.status === 'REJECTED').length}
                                </span>
                                <span className="text-sm text-gray-400">Rejected</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ATS LIST */}
                <h2 className="text-2xl font-bold text-white mb-6">Recent Applications</h2>
                <div className="space-y-4">
                    {applications.map(app => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4"
                        >
                            <div className="flex-1">
                                <h4 className="font-bold text-white">{app.candidate?.name || "Unknown Candidate"}</h4>
                                <p className="text-sm text-gray-400">Applied for <span className="text-blue-300">{app.job?.title}</span></p>
                                <p className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold
                            ${app.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                        app.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                            'bg-yellow-500/20 text-yellow-400'}`}>
                                    {app.status}
                                </span>

                                {app.status === 'PENDING' && (
                                    <>
                                        <Button size="sm" onClick={() => updateStatus(app.id, 'ACCEPTED')} className="bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/50">Accept</Button>
                                        <Button size="sm" onClick={() => updateStatus(app.id, 'REJECTED')} className="bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/50">Reject</Button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {applications.length === 0 && <p className="text-gray-500 text-center">No applications yet.</p>}
                </div>

            </main>
        </div>
    );
}

export default function RecruiterDashboard() {
    return (
        <ToastProvider>
            <DashboardContent />
        </ToastProvider>
    )
}
