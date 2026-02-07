"use client";

import { useEffect, useState } from "react";
import CandidateProfile from "@/components/profile/CandidateProfile";
import RecruiterProfile from "@/components/profile/RecruiterProfile";
import Navbar from "@/components/layout/Navbar";

export default function ProfilePage() {
    const [role, setRole] = useState<string>("candidate");

    useEffect(() => {
        fetch("/api/profile")
            .then(res => res.json())
            .then(data => {
                if (data && data.role) {
                    setRole(data.role);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <div className="min-h-screen bg-[#060B1A]">
            <Navbar />
            <main className="container mx-auto px-6 pt-24 pb-12">
                {role === 'recruiter' ? <RecruiterProfile /> : <CandidateProfile />}
            </main>
        </div>
    );
}
