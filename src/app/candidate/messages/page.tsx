"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import AnimatedBackground from "@/components/login/AnimatedBackground";
import { motion } from "framer-motion";

type Contact = {
    id: string; // User ID of recruiter
    name: string;
    jobs: string[];
};

type Message = {
    id: string;
    content: string;
    createdAt: string;
    fromId: string;
    toId: string;
};

export default function CandidateMessagesPage() {
    const { data: session } = useSession();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/applications").then(res => res.json()),
            fetch("/api/messages").then(res => res.json())
        ]).then(([appsData, messagesData]) => {
            // Process Contacts (Recruiters)
            const uniqueRecruiters = new Map();
            if (Array.isArray(appsData)) {
                appsData.forEach((app: any) => {
                    // Verify this is a candidate view (job has recruiter details)
                    if (app.job && app.job.recruiterId) {
                        if (!uniqueRecruiters.has(app.job.recruiterId)) {
                            uniqueRecruiters.set(app.job.recruiterId, {
                                id: app.job.recruiterId,
                                name: app.job.recruiterName || "Recruiter",
                                jobs: [app.job.title]
                            });
                        } else {
                            uniqueRecruiters.get(app.job.recruiterId).jobs.push(app.job.title);
                        }
                    }
                });
            }
            setContacts(Array.from(uniqueRecruiters.values()));

            // Process Messages
            const allMsgs = [...(messagesData.sent || []), ...(messagesData.received || [])];
            allMsgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setMessages(allMsgs);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, selectedContact]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedContact) return;

        const optimisticMsg = {
            id: Date.now().toString(),
            content: newMessage,
            createdAt: new Date().toISOString(),
            fromId: (session?.user as any)?.id,
            toId: selectedContact.id,
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");

        try {
            await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toId: selectedContact.id,
                    content: optimisticMsg.content
                })
            });
        } catch (err) {
            console.error(err);
        }
    };

    const currentChat = selectedContact ? messages.filter(m =>
        (m.fromId === selectedContact.id || m.toId === selectedContact.id)
    ) : [];

    return (
        <main className="min-h-screen relative bg-black text-white selection:bg-blue-500/30">
            <AnimatedBackground />

            <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-6 h-screen flex flex-col">
                {/* Header */}
                <header className="flex justify-between items-center py-4 border-b border-white/10 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <FileText className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            Candidate Portal
                        </h1>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link href="/candidate/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/candidate/messages" className="text-sm font-medium text-white border-b-2 border-blue-500">Messages</Link>
                        <Link href="/quizzes" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Assessments</Link>
                        <Link href="/problems" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Practice</Link>
                        <Button onClick={() => signOut()} variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5">
                            Log Out
                        </Button>
                    </nav>
                </header>

                {/* Content */}
                <div className="flex-1 flex rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm shadow-2xl">
                    {/* Contacts Sidebar */}
                    <div className="w-1/3 border-r border-white/10 flex flex-col bg-black/20">
                        <div className="p-4 border-b border-white/10">
                            <h2 className="text-lg font-bold text-white">Your Recruiters</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                            ) : contacts.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                    No contacts yet. Apply to jobs to start chatting.
                                </div>
                            ) : (
                                contacts.map(c => (
                                    <div
                                        key={c.id}
                                        onClick={() => setSelectedContact(c)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all ${selectedContact?.id === c.id ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
                                                {c.name[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-white text-sm">{c.name}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-1">{c.jobs.join(", ")}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-black/40">
                        {selectedContact ? (
                            <>
                                <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                                    <h3 className="font-bold text-white">{selectedContact.name}</h3>
                                </div>

                                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                    {currentChat.length === 0 ? (
                                        <div className="text-center text-gray-500 mt-10 text-sm">
                                            Start the conversation about your application.
                                        </div>
                                    ) : (
                                        currentChat.map((msg) => {
                                            const isMe = msg.fromId === (session?.user as any)?.id;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`
                                                        max-w-[70%] p-3 rounded-2xl text-sm
                                                        ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}
                                                    `}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={scrollRef} />
                                </div>

                                <div className="p-4 border-t border-white/10 bg-white/5">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                        className="flex gap-4"
                                    >
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        />
                                        <Button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4">
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-sm">Select a recruiter to chat</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
