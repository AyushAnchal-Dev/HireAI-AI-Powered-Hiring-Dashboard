"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
    id: string;
    content: string;
    from: { name: string; email: string };
    createdAt: string;
}

export default function MessagesPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [recipientEmail, setRecipientEmail] = useState(""); // Simple version: type email

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/messages");
            const data = await res.json();
            // Combine sent and received for a timeline or just show received for now
            // For simplicity in Phase 1, let's just show received inbox
            setMessages(data.received || []);
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = async () => {
        if (!newMessage || !recipientEmail) return;

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toEmail: recipientEmail, content: newMessage })
            });

            if (res.ok) {
                alert("Message sent!");
                setNewMessage("");
                fetchMessages(); // Refresh inbox
            } else {
                const err = await res.text();
                alert("Failed to send: " + err);
            }
        } catch (error) {
            console.error(error);
            alert("Error sending message");
        }
    };

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12 grid md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">

                {/* SIDEBAR / INBOX LIST */}
                <div className="glass-card p-4 rounded-2xl flex flex-col md:col-span-1">
                    <h2 className="text-xl font-bold text-white mb-4">Inbox</h2>
                    <div className="flex-1 overflow-y-auto space-y-2">
                        {messages.length ? messages.map(m => (
                            <div key={m.id} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-gray-200">{m.from?.name || "Unknown"}</span>
                                    <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{m.content}</p>
                            </div>
                        )) : <p className="text-gray-500 text-sm">No messages received.</p>}
                    </div>
                </div>

                {/* MESSAGE CONTENT / COMPOSE */}
                <div className="glass-card p-6 rounded-2xl md:col-span-2 flex flex-col">
                    <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Send size={24} />
                        </div>
                        <p>Select a message to read or compose a new one.</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                        <Input
                            placeholder="To: email@example.com"
                            value={recipientEmail}
                            onChange={e => setRecipientEmail(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                        />
                        <div className="flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                className="bg-white/5 border-white/10 text-white"
                            />
                            <Button onClick={sendMessage} className="bg-blue-600">Send</Button>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
