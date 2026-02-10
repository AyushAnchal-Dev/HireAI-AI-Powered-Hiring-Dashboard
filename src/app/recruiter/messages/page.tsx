"use client";

import { useEffect, useState, useRef } from "react";
import { MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react"; // Assuming you have SessionProvider

type Candidate = {
    candidateId: string; // The Application.candidateId
    userId: string; // We need the User ID to send messages, not Candidate ID. API needs update?
    name: string;
    job: string;
    email?: string;
};

type Message = {
    id: string;
    content: string;
    createdAt: string;
    fromId: string;
    toId: string;
    from?: { name: string };
    to?: { name: string };
};

export default function MessagesPage() {
    const { data: session } = useSession();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Candidates (Applicants)
    // PROBLEM: The previous API '/api/recruiter/applicants' returned candidateId (from Candidate table), 
    // but Messages require User ID. 
    // I need to update the Applicants API to return the underlying User ID of the candidate.
    // OR create a new endpoint. 
    // Let's assume for now I can get it. 
    // NOTE: I will update the Applicants API first to include userId.

    useEffect(() => {
        Promise.all([
            fetch("/api/recruiter/applicants").then(res => res.json()),
            fetch("/api/messages").then(res => res.json())
        ]).then(([applicantsData, messagesData]) => {
            setCandidates(applicantsData);
            // Merge sent and received
            const allMsgs = [...(messagesData.sent || []), ...(messagesData.received || [])];
            allMsgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setMessages(allMsgs);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, selectedCandidate]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedCandidate) return;

        const optimisticMsg = {
            id: Date.now().toString(),
            content: newMessage,
            createdAt: new Date().toISOString(),
            fromId: (session?.user as any)?.id,
            toId: selectedCandidate.userId, // Needs to be real User ID
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toId: selectedCandidate.userId,
                    content: optimisticMsg.content
                })
            });
            if (!res.ok) throw new Error("Failed to send");
            // Could replace optimistic with real one
        } catch (err) {
            console.error(err);
            alert("Failed to send message");
        }
    };

    // Filter messages for current chat
    const currentChat = selectedCandidate ? messages.filter(m =>
        (m.fromId === selectedCandidate.userId || m.toId === selectedCandidate.userId)
    ) : [];

    return (
        <div className="h-[calc(100vh-8rem)] flex rounded-2xl border border-white/10 overflow-hidden bg-white/5 backdrop-blur-sm">
            {/* Sidebar List */}
            <div className="w-1/3 border-r border-white/10 flex flex-col">
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Messages</h2>
                    <p className="text-xs text-gray-400 mt-1">Chat with your applicants</p>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {loading ? (
                        <div className="text-center p-4 text-gray-500">Loading...</div>
                    ) : candidates.length === 0 ? (
                        <div className="text-center p-4 text-gray-500">No applicants found to chat with.</div>
                    ) : (
                        candidates.map((c) => (
                            <div
                                key={c.id}
                                onClick={() => setSelectedCandidate(c)}
                                className={`p-4 rounded-xl cursor-pointer transition-colors ${selectedCandidate?.id === c.id ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-white">{c.name}</h4>
                                    <span className="text-xs text-gray-400">{c.job}</span>
                                </div>
                                <div className="text-xs text-blue-400">Click to chat</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-black/20">
                {selectedCandidate ? (
                    <>
                        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {selectedCandidate.name[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-white">{selectedCandidate.name}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-400" />
                                    <span className="text-xs text-gray-400">Applicant for {selectedCandidate.job}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                            {currentChat.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">
                                    Start the conversation with {selectedCandidate.name}.
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
                                                <div className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-gray-500'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
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
                                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <Button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-500 rounded-xl px-6">
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a candidate to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}
