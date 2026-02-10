"use client";

import Link from "next/link";
import { LayoutDashboard, Briefcase, Users, BrainCircuit, MessageSquare, User, Code } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  {
    label: "Overview",
    href: "/recruiter/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Jobs",
    href: "/recruiter/jobs",
    icon: Briefcase,
  },
  {
    label: "Candidates",
    href: "/recruiter/candidates",
    icon: Users,
  },
  {
    label: "Quizzes",
    href: "/recruiter/quizzes",
    icon: BrainCircuit,
  },
  {
    label: "Problems",
    href: "/recruiter/problems",
    icon: Code,
  },
  {
    label: "Messages",
    href: "/recruiter/messages",
    icon: MessageSquare,
  },
  {
    label: "Profile",
    href: "/recruiter/profile",
    icon: User,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-[#060B1A]/95 backdrop-blur-xl border-white/10 hidden md:flex flex-col h-screen sticky top-0 overflow-hidden z-40">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 pointer-events-none" />

      <div className="p-6 font-bold text-xl flex items-center gap-3 z-10 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
        >
          H
        </motion.div>
        <span className="text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
          HireAI
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
        {navItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className="block"
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 + 0.2 }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
              whileHover={{ x: 5 }}
            >
              <item.icon className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              {item.label}

              {/* Active styling logic could be added here if needed, but hover is enough for now */}
            </motion.div>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10 z-10">
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-white/5">
          <h4 className="text-white font-semibold text-sm mb-1">Pro Plan</h4>
          <p className="text-gray-500 text-xs mb-3">Upgrade for AI analytics</p>
          <button className="w-full py-2 text-xs font-bold text-white bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
