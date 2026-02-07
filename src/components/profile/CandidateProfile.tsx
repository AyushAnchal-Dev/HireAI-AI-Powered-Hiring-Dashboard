"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Project {
    id: string; // generated client-side if new
    title: string;
    techStack: string[];
    status: string;
}

interface Learning {
    id: string;
    topic: string;
    status: string;
}

interface Certification {
    id: string;
    name: string;
    issuer: string;
    year: number;
}

interface ProfileData {
    role: "recruiter" | "candidate";
    name: string;
    email: string;
    company?: string | null;
    bio: string | null;
    skills: string[];
    projects: Project[];
    learning: Learning[];
    certs: Certification[];
}

export default function CandidateProfile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ProfileData>({
        role: "candidate",
        name: "",
        email: "",
        company: "",
        bio: "",
        skills: [],
        projects: [],
        learning: [],
        certs: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch("/api/profile");
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setFormData({
                    role: data.role || "candidate",
                    name: data.name || "",
                    email: data.email || "",
                    company: data.company || "",
                    bio: data.bio || "",
                    skills: data.skills || [],
                    projects: data.projects || [],
                    learning: data.learning || [],
                    certs: data.certs || []
                });
            }
        } catch (err) {
            console.error("Failed to fetch profile", err);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async () => {
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setProfile(formData);
                setIsEditing(false);
                // In a real app, show success toast
            } else {
                console.error("Failed to save profile");
            }
        } catch (err) {
            console.error("Error saving profile", err);
        }
    };

    if (loading) return <div className="p-10 text-center text-white">Loading Profile...</div>;

    return (
        <div className="space-y-8">
            {/* BIO HEADER */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-8 rounded-3xl overflow-hidden glass-card"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 z-0" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                    {profile?.name || "User Profile"}
                                    <Badge variant="outline" className={`text-xs ${profile?.role === 'recruiter' ? 'border-purple-500 text-purple-400' : 'border-cyan-500 text-cyan-400'}`}>
                                        {profile?.role === 'recruiter' ? 'Recruiter' : 'Candidate'}
                                    </Badge>
                                </h2>
                                <p className="text-sm text-gray-500">{profile?.email}</p>
                            </div>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-500">Save</Button>
                                        <Button onClick={() => setIsEditing(false)} variant="outline">Cancel</Button>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                )}
                            </div>
                        </div>

                        {/* RECRUITER SPECIFIC FIELD */}
                        {profile?.role === 'recruiter' && (
                            <div className="mb-6">
                                <label className="text-sm text-gray-400">Company / Organization</label>
                                {isEditing ? (
                                    <Input
                                        value={formData.company || ""}
                                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                                        className="bg-white/10 text-white border-white/10 mt-1"
                                        placeholder="Enter your company name"
                                    />
                                ) : (
                                    <p className="text-xl font-semibold text-purple-200 mt-1">{profile?.company || "No company listed"}</p>
                                )}
                            </div>
                        )}

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400">Bio</label>
                                    <Textarea
                                        value={formData.bio || ""}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="bg-white/10 text-white border-white/10"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400">Skills (comma separated)</label>
                                    <Input
                                        value={formData.skills.join(", ")}
                                        onChange={e => setFormData({ ...formData, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                                        className="bg-white/10 text-white border-white/10"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-300 max-w-xl mb-4">
                                    {profile?.bio || "No bio added yet. Add a short bio to stand out!"}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {profile?.skills?.map((skill, i) => (
                                        <Badge key={i} variant="secondary" className="bg-cyan-950/50 text-cyan-200 border-cyan-800">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* HIDE SECTIONS FOR RECRUITERS */}
            {profile?.role !== 'recruiter' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* PROJECTS */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 rounded-2xl border border-white/5"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">Live Projects 📂</h3>
                            {isEditing && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10"
                                    onClick={() => {
                                        const newP = { id: Date.now().toString(), title: "New Project", techStack: [], status: "In Progress" };
                                        setFormData({ ...formData, projects: [...formData.projects, newP] });
                                    }}
                                >
                                    +
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {(isEditing ? formData.projects : profile?.projects)?.length ? (isEditing ? formData.projects : profile!.projects).map((p, idx) => (
                                <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={p.title}
                                                onChange={e => {
                                                    const newProjects = [...formData.projects];
                                                    newProjects[idx].title = e.target.value;
                                                    setFormData({ ...formData, projects: newProjects });
                                                }}
                                                className="h-8 bg-black/20 border-white/10 text-white"
                                                placeholder="Project Title"
                                            />
                                            <Input
                                                value={p.status}
                                                onChange={e => {
                                                    const newProjects = [...formData.projects];
                                                    newProjects[idx].status = e.target.value;
                                                    setFormData({ ...formData, projects: newProjects });
                                                }}
                                                className="h-8 bg-black/20 border-white/10 text-white"
                                                placeholder="Status (Live/In Progress)"
                                            />
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-6 text-xs w-full mt-2"
                                                onClick={() => {
                                                    const newProjects = formData.projects.filter((_, i) => i !== idx);
                                                    setFormData({ ...formData, projects: newProjects });
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-cyan-100">{p.title}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${p.status === 'Live' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {p.status}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-sm text-gray-500 italic">No projects added.</p>}
                        </div>
                    </motion.div>

                    {/* LEARNING */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 rounded-2xl border border-white/5"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">Learning 📚</h3>
                            {isEditing && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10"
                                    onClick={() => {
                                        const newL = { id: Date.now().toString(), topic: "New Topic", status: "In Progress" };
                                        setFormData({ ...formData, learning: [...formData.learning, newL] });
                                    }}
                                >
                                    +
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {(isEditing ? formData.learning : profile?.learning)?.length ? (isEditing ? formData.learning : profile!.learning).map((l, idx) => (
                                <div key={l.id} className="p-3 rounded-lg bg-white/5">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={l.topic}
                                                onChange={e => {
                                                    const newLearning = [...formData.learning];
                                                    newLearning[idx].topic = e.target.value;
                                                    setFormData({ ...formData, learning: newLearning });
                                                }}
                                                className="h-8 bg-black/20 border-white/10 text-white"
                                                placeholder="Topic"
                                            />
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-6 text-xs w-full"
                                                onClick={() => {
                                                    const newLearning = formData.learning.filter((_, i) => i !== idx);
                                                    setFormData({ ...formData, learning: newLearning });
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-200">{l.topic}</span>
                                            <span className="text-xs text-blue-300">{l.status}</span>
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-sm text-gray-500 italic">No current learning.</p>}
                        </div>
                    </motion.div>

                    {/* CERTIFICATIONS */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 rounded-2xl border border-white/5"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">Certifications 🧾</h3>
                            {isEditing && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10"
                                    onClick={() => {
                                        const newC = { id: Date.now().toString(), name: "New Cert", issuer: "Self", year: new Date().getFullYear() };
                                        setFormData({ ...formData, certs: [...formData.certs, newC] });
                                    }}
                                >
                                    +
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {(isEditing ? formData.certs : profile?.certs)?.length ? (isEditing ? formData.certs : profile!.certs).map((c, idx) => (
                                <div key={c.id} className="p-3 rounded-lg bg-white/5">
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                value={c.name}
                                                onChange={e => {
                                                    const newCerts = [...formData.certs];
                                                    newCerts[idx].name = e.target.value;
                                                    setFormData({ ...formData, certs: newCerts });
                                                }}
                                                className="h-8 bg-black/20 border-white/10 text-white"
                                                placeholder="Certification Name"
                                            />
                                            <Input
                                                value={c.issuer}
                                                onChange={e => {
                                                    const newCerts = [...formData.certs];
                                                    newCerts[idx].issuer = e.target.value;
                                                    setFormData({ ...formData, certs: newCerts });
                                                }}
                                                className="h-8 bg-black/20 border-white/10 text-white"
                                                placeholder="Issuer (e.g. Google)"
                                            />
                                            <Input
                                                type="number"
                                                value={c.year}
                                                onChange={e => {
                                                    const newCerts = [...formData.certs];
                                                    newCerts[idx].year = parseInt(e.target.value) || 2024;
                                                    setFormData({ ...formData, certs: newCerts });
                                                }}
                                                className="h-8 bg-black/20 border-white/10 text-white"
                                                placeholder="Year"
                                            />
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-6 text-xs w-full"
                                                onClick={() => {
                                                    const newCerts = formData.certs.filter((_, i) => i !== idx);
                                                    setFormData({ ...formData, certs: newCerts });
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-yellow-500/20 flex items-center justify-center text-yellow-500">🏆</div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-200">{c.name}</p>
                                                <p className="text-xs text-gray-500">{c.issuer} • {c.year}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )) : <p className="text-sm text-gray-500 italic">No certifications.</p>}
                        </div>
                    </motion.div>

                </div>
            ) : (
                <div className="p-6 glass-card rounded-2xl">
                    <h3 className="text-xl font-semibold text-white mb-4">Recruiter Dashboard</h3>
                    <p className="text-gray-400">View job postings and applications from the main dashboard accessible in the navbar.</p>
                </div>
            )}
        </div>
    );
}
