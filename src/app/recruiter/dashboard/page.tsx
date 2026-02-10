"use client";

import StatsCards from "@/components/dashboard/StatsCards";
import CreateJobModal from "@/components/dashboard/CreateJobModal";
import JobsTable from "@/components/dashboard/JobsTable";
import { motion, Variants } from "framer-motion";
import AnimatedBackground from "@/components/login/AnimatedBackground";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RecruiterDashboard() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden text-white">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

      <motion.div
        className="relative z-10 space-y-8 p-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-end border-b border-white/10 pb-6">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent inline-block">
              Recruiter Dashboard
            </h2>
            <p className="mt-2 text-gray-300 text-lg">
              Overview of your hiring pipeline.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsCards />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold tracking-tight text-white">Recent Postings</h3>
            <div className="flex gap-4">
              <Link href="/recruiter/profile">
                <Button variant="outline" className="text-white hover:text-white border-white/20 hover:bg-white/10">Profile</Button>
              </Link>
              <CreateJobModal />
            </div>
          </div>
          <JobsTable />
        </motion.div>
      </motion.div>
    </main>
  );
}
