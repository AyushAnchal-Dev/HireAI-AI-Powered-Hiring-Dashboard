"use client";

import { motion } from "framer-motion";
import ScoreCircle from "@/components/ScoreCircle";
import InsightCard from "@/components/InsightCard";
import { useEffect, useState } from "react";

export default function ResultPage() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("analysis") || "{}")
        : {};
    setData(stored);
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 pt-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center"
        >
          Resume Analysis Report
        </motion.h1>

        {/* Score Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <ScoreCircle score={data.roles?.[0]?.match || 0} />
        </motion.div>

        {/* Insights */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <InsightCard
            title="Strengths"
            items={data.strengths || []}
            type="good"
          />

          <InsightCard
            title="Improvements"
            items={data.weaknesses || []}
            type="warn"
          />

          <InsightCard
            title="AI Suggestions"
            items={data.suggestions || []}
            type="info"
          />
        </div>

        {/* Job Match */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">
            Best Job Role Matches
          </h2>

          <div className="space-y-4">
            {data.roles?.map((job: any, i: number) => (
              <motion.div
                key={job.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-5 rounded-xl shadow flex justify-between"
              >
                <span className="font-medium">{job.title}</span>
                <span className="text-blue-600 font-semibold">
                  {job.match}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
