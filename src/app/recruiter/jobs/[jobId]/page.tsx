"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedBackground from "@/components/login/AnimatedBackground";
import { ArrowLeft, BarChart2 } from "lucide-react";
import Link from "next/link";

type Status = "pending" | "shortlisted" | "rejected";

export default function ApplicantsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const [apps, setApps] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch(`/api/applications/${params.jobId}`)
      .then((res) => res.json())
      .then(setApps);
  }, [params.jobId]);

  // ✅ UPDATED FUNCTION
  async function updateStatus(id: string, status: Status) {
    try {
      setLoadingId(id);

      const res = await fetch("/api/applications/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      // ✅ Optimistic UI update
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.error(err);
      alert("Status update failed");
    } finally {
      setLoadingId(null);
    }
  }

  const filteredApps = apps.filter((app) => {
    const scoreMatch = app.match >= minScore;
    const statusMatch =
      statusFilter === "all" ? true : app.status === statusFilter;
    return scoreMatch && statusMatch;
  });

  return (
    <main className="min-h-screen relative overflow-hidden text-white">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link href="/recruiter/dashboard">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Applicants
            </h1>
          </div>

          {/* Filters */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:text-white"
              onClick={() => window.location.href = "/recruiter/analytics"}
            >
              <BarChart2 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <input
              type="number"
              placeholder="Min Score"
              className="bg-white/5 border border-white/10 px-3 py-2 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-32"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
            />
            <select
              className="bg-white/5 border border-white/10 px-3 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 [&>option]:bg-slate-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-xl flex justify-between items-center hover:bg-white/10 transition-colors"
              >
                <div>
                  <p className="font-medium text-lg text-white">{app.name}</p>
                  <p className="text-sm text-gray-400">{app.email}</p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full mt-2 inline-block border ${app.status === "shortlisted"
                        ? "bg-green-500/20 text-green-400 border-green-500/50"
                        : app.status === "rejected"
                          ? "bg-red-500/20 text-red-400 border-red-500/50"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/50"
                      }`}
                  >
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Match Score</p>
                    <span className={`text-2xl font-bold ${app.match >= 80 ? "text-green-400" :
                        app.match >= 50 ? "text-yellow-400" : "text-red-400"
                      }`}>
                      {app.match}%
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={loadingId === app.id || app.status === "shortlisted"}
                      className="bg-green-600 hover:bg-green-500 text-white border-0"
                      onClick={() => updateStatus(app.id, "shortlisted")}
                    >
                      Shortlist
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={loadingId === app.id || app.status === "rejected"}
                      onClick={() => updateStatus(app.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredApps.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-gray-400">No applicants found matching criteria.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
