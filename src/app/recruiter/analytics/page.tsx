"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import AnimatedBackground from "@/components/login/AnimatedBackground";
import { ArrowLeft, Users, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return null;

  return (
    <main className="min-h-screen relative overflow-hidden text-white">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      <div className="relative z-10 p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4 border-b border-white/10 pb-6">
          <Link href="/recruiter/dashboard">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Hiring Analytics
          </h1>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Stat title="Total Applicants" value={data.total} icon={Users} color="text-blue-400" />
          <Stat title="Shortlisted" value={data.shortlisted} icon={CheckCircle} color="text-green-400" />
          <Stat title="Rejected" value={data.rejected} icon={XCircle} color="text-red-400" />
          <Stat title="Avg Match Score" value={`${data.avgScore}%`} icon={TrendingUp} color="text-yellow-400" />
        </div>

        {/* Chart */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-6 text-white">
            Applicant Match Score Distribution
          </h2>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreBuckets} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="range" stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#9ca3af" tick={{ fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ title, value, icon: Icon, color }: { title: string; value: any; icon: any; color: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
