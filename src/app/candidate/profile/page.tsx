"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ArrowLeft, Save, FileText } from "lucide-react";
import Link from "next/link";
import AnimatedBackground from "@/components/login/AnimatedBackground";
import { motion } from "framer-motion";

export default function CandidateProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // User fields
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [skills, setSkills] = useState(""); // comma separated

    // Dynamic fields
    const [projects, setProjects] = useState<{ title: string; link: string; desc: string }[]>([]);
    const [experience, setExperience] = useState<{ role: string; company: string; duration: string }[]>([]);
    const [education, setEducation] = useState<{ degree: string; school: string; year: string }[]>([]);

    useEffect(() => {
        fetch("/api/candidate/profile")
            .then(res => res.json())
            .then(data => {
                if (data.error) return;
                setName(data.user?.name || data.name || "");
                setBio(data.bio || "");
                setSkills(data.skills ? data.skills.join(", ") : "");
                setProjects(Array.isArray(data.projects) ? data.projects : []);
                setExperience(Array.isArray(data.experience) ? data.experience : []);
                setEducation(Array.isArray(data.education) ? data.education : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/candidate/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    bio,
                    skills: skills.split(",").map(s => s.trim()).filter(Boolean),
                    projects,
                    experience,
                    education
                })
            });
            if (res.ok) {
                alert("Profile saved successfully!");
            } else {
                alert("Failed to save profile.");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving profile.");
        } finally {
            setSaving(false);
        }
    };

    // Helper to update dynamic fields
    const updateItem = (setter: any, list: any[], index: number, field: string, value: string) => {
        const newList = [...list];
        newList[index] = { ...newList[index], [field]: value };
        setter(newList);
    };

    const addItem = (setter: any, list: any[], item: any) => setter([...list, item]);
    const removeItem = (setter: any, list: any[], index: number) => setter(list.filter((_, i) => i !== index));

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen relative bg-black text-white selection:bg-blue-500/30">
            <AnimatedBackground />

            <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-10 space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/candidate/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
                                <ArrowLeft className="w-5 h-5 text-gray-400" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                Edit Profile
                            </h1>
                            <p className="text-gray-400 text-sm">Update your public profile and resume details.</p>
                        </div>
                    </div>
                    <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-500 gap-2">
                        {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
                    </Button>
                </header>

                <div className="space-y-8 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                    {/* Basic Info */}
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-white border-b border-white/10 pb-2">Basic Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Full Name</label>
                                <Input value={name} onChange={e => setName(e.target.value)} className="bg-black/20 border-white/10 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Skills (comma separated)</label>
                                <Input value={skills} onChange={e => setSkills(e.target.value)} className="bg-black/20 border-white/10 text-white" placeholder="React, Node.js, Python..." />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Biography</label>
                            <Textarea value={bio} onChange={e => setBio(e.target.value)} className="bg-black/20 border-white/10 text-white min-h-[100px]" placeholder="Tell recruiters about yourself..." />
                        </div>
                    </section>

                    {/* Projects */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h2 className="text-xl font-semibold text-white">Projects</h2>
                            <Button variant="ghost" size="sm" onClick={() => addItem(setProjects, projects, { title: "", link: "", desc: "" })} className="text-blue-400 hover:text-blue-300">
                                <Plus className="w-4 h-4 mr-2" /> Add Project
                            </Button>
                        </div>
                        {projects.map((p, i) => (
                            <div key={i} className="bg-black/20 p-4 rounded-xl space-y-3 relative group">
                                <Button variant="ghost" size="icon" onClick={() => removeItem(setProjects, projects, i)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input placeholder="Project Title" value={p.title} onChange={e => updateItem(setProjects, projects, i, "title", e.target.value)} className="bg-transparent border-white/10" />
                                    <Input placeholder="Link (GitHub/Demo)" value={p.link} onChange={e => updateItem(setProjects, projects, i, "link", e.target.value)} className="bg-transparent border-white/10" />
                                </div>
                                <Textarea placeholder="Description" value={p.desc} onChange={e => updateItem(setProjects, projects, i, "desc", e.target.value)} className="bg-transparent border-white/10 min-h-[60px]" />
                            </div>
                        ))}
                        {projects.length === 0 && <p className="text-gray-500 text-sm italic">No projects added yet.</p>}
                    </section>

                    {/* Experience */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h2 className="text-xl font-semibold text-white">Experience</h2>
                            <Button variant="ghost" size="sm" onClick={() => addItem(setExperience, experience, { role: "", company: "", duration: "" })} className="text-blue-400 hover:text-blue-300">
                                <Plus className="w-4 h-4 mr-2" /> Add Experience
                            </Button>
                        </div>
                        {experience.map((ex, i) => (
                            <div key={i} className="bg-black/20 p-4 rounded-xl space-y-3 relative group">
                                <Button variant="ghost" size="icon" onClick={() => removeItem(setExperience, experience, i)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input placeholder="Role / Position" value={ex.role} onChange={e => updateItem(setExperience, experience, i, "role", e.target.value)} className="bg-transparent border-white/10" />
                                    <Input placeholder="Company" value={ex.company} onChange={e => updateItem(setExperience, experience, i, "company", e.target.value)} className="bg-transparent border-white/10" />
                                    <Input placeholder="Duration (e.g. 2020-2022)" value={ex.duration} onChange={e => updateItem(setExperience, experience, i, "duration", e.target.value)} className="bg-transparent border-white/10" />
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Education */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                            <h2 className="text-xl font-semibold text-white">Education</h2>
                            <Button variant="ghost" size="sm" onClick={() => addItem(setEducation, education, { degree: "", school: "", year: "" })} className="text-blue-400 hover:text-blue-300">
                                <Plus className="w-4 h-4 mr-2" /> Add Education
                            </Button>
                        </div>
                        {education.map((ed, i) => (
                            <div key={i} className="bg-black/20 p-4 rounded-xl space-y-3 relative group">
                                <Button variant="ghost" size="icon" onClick={() => removeItem(setEducation, education, i)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input placeholder="Degree" value={ed.degree} onChange={e => updateItem(setEducation, education, i, "degree", e.target.value)} className="bg-transparent border-white/10" />
                                    <Input placeholder="School / University" value={ed.school} onChange={e => updateItem(setEducation, education, i, "school", e.target.value)} className="bg-transparent border-white/10" />
                                    <Input placeholder="Year of Grad" value={ed.year} onChange={e => updateItem(setEducation, education, i, "year", e.target.value)} className="bg-transparent border-white/10" />
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </main>
    );
}
