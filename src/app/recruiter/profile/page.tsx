"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Building, Mail, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function RecruiterProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        fetch("/api/recruiter/profile")
            .then(res => res.json())
            .then(data => {
                if (data.error) return;
                setName(data.name || "");
                setEmail(data.email || "");
                setRole(data.role || "");
                setCompany(data.profile?.company || "");
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/recruiter/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, company })
            });
            if (res.ok) {
                alert("Profile saved successfully!");
            } else {
                alert("Failed to save profile.");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-gray-400">Loading profile...</div>;

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-gray-400">Manage your account settings and public information.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-6"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {name[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{name}</h2>
                            <p className="text-sm text-gray-400 capitalize">{role}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <User className="w-4 h-4" /> Full Name
                            </label>
                            <Input value={name} onChange={e => setName(e.target.value)} className="bg-black/20 border-white/10 text-white" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Building className="w-4 h-4" /> Company Name
                            </label>
                            <Input value={company} onChange={e => setCompany(e.target.value)} className="bg-black/20 border-white/10 text-white" placeholder="e.g. Acme Corp" />
                        </div>

                        <div className="space-y-2 opacity-50 cursor-not-allowed">
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> Email Address
                            </label>
                            <Input value={email} readOnly className="bg-black/20 border-white/10 text-white" />
                        </div>
                    </div>

                    <Button onClick={handleSave} disabled={saving} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 mt-4">
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </motion.div>

                {/* Stats / Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-2">Account Status</h3>
                        <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Active Recruiter
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                            You have full access to post jobs, screen candidates, and create assessments.
                        </p>
                    </div>

                    {/* Placeholder for future settings */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-50">
                        <h3 className="text-lg font-semibold text-white mb-2">Notification Settings</h3>
                        <p className="text-sm text-gray-400">Coming soon based on your usage.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
