import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Linkedin, Mail, Calendar, Briefcase, GraduationCap } from "lucide-react";

export default async function CandidateProfileView({ params }: { params: { candidateId: string } }) {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "recruiter") {
        redirect("/login");
    }

    const { candidateId } = params;

    const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
        include: {
            user: true,
            applications: {
                where: { job: { recruiterId: (session.user as any).id } },
                include: { job: true }
            }
        }
    });

    if (!candidate) return <div className="p-10 text-white">Candidate not found</div>;

    const projects = (candidate.projects as any[]) || [];
    const experience = (candidate.experience as any[]) || [];
    const education = (candidate.education as any[]) || [];
    const skills = candidate.skills || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/recruiter/candidates">
                    <Button variant="ghost" size="icon" className="hover:bg-white/5">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">{candidate.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-3 h-3" />
                        {candidate.user.email}
                    </div>
                </div>
                {candidate.resumeUrl && candidate.resumeUrl.length > 5 && (
                    <a href={candidate.resumeUrl} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
                            <ExternalLink className="w-4 h-4" /> View Resume
                        </Button>
                    </a>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Bio & Skills */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white mb-4">About</h2>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                            {candidate.bio || "No biography provided."}
                        </p>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.length > 0 ? skills.map((s, i) => (
                                <Badge key={i} variant="secondary" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                                    {s}
                                </Badge>
                            )) : <span className="text-gray-500 text-sm">No skills listed</span>}
                        </div>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white mb-4">Applications</h2>
                        {candidate.applications.length > 0 ? (
                            <div className="space-y-3">
                                {candidate.applications.map(app => (
                                    <div key={app.id} className="p-3 bg-black/20 rounded-lg border border-white/5">
                                        <p className="font-medium text-white text-sm">{app.job.title}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <Badge variant="outline" className="text-xs border-white/10 text-gray-400">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </Badge>
                                            <Badge className={
                                                app.status === "SHORTLISTED" ? "bg-green-500/20 text-green-300" :
                                                    app.status === "REJECTED" ? "bg-red-500/20 text-red-300" :
                                                        "bg-yellow-500/20 text-yellow-300"
                                            }>{app.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No active applications for your jobs.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Experience & Projects */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Experience */}
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Briefcase className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg font-semibold text-white">Experience</h2>
                        </div>
                        <div className="space-y-6">
                            {experience.length > 0 ? experience.map((ex, i) => (
                                <div key={i} className="relative pl-6 border-l border-white/10 pb-6 last:pb-0">
                                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-purple-500/50" />
                                    <h3 className="font-medium text-white">{ex.role}</h3>
                                    <p className="text-sm text-blue-300">{ex.company}</p>
                                    <p className="text-xs text-gray-400 mt-1">{ex.duration}</p>
                                </div>
                            )) : <p className="text-gray-500 text-sm">No experience listed.</p>}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <GraduationCap className="w-5 h-5 text-green-400" />
                            <h2 className="text-lg font-semibold text-white">Education</h2>
                        </div>
                        <div className="space-y-4">
                            {education.length > 0 ? education.map((ed, i) => (
                                <div key={i} className="flex justify-between items-start p-3 bg-black/20 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-white text-sm">{ed.school}</h3>
                                        <p className="text-xs text-gray-400">{ed.degree}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">{ed.year}</span>
                                </div>
                            )) : <p className="text-gray-500 text-sm">No education listed.</p>}
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Github className="w-5 h-5 text-cyan-400" />
                            <h2 className="text-lg font-semibold text-white">Projects</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projects.length > 0 ? projects.map((p, i) => (
                                <div key={i} className="p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-medium text-white">{p.title}</h3>
                                        {p.link && (
                                            <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-3">{p.desc}</p>
                                </div>
                            )) : <p className="text-gray-500 text-sm col-span-2">No projects listed.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
