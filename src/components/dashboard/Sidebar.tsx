"use client";

import Link from "next/link";
import { LayoutDashboard, Briefcase, Users } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Jobs",
    href: "/dashboard/jobs",
    icon: Briefcase,
  },
  {
    label: "Candidates",
    href: "/dashboard/candidates",
    icon: Users,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card/50 backdrop-blur-xl border-border hidden md:block overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <div className="p-6 font-bold text-xl flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground"
        >
          H
        </motion.div>
        <span className="text-foreground tracking-tight">
          HireAI
        </span>
      </div>

      <nav className="px-4 space-y-2 mt-4">
        {navItems.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all cursor-pointer relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              {item.label}
            </motion.div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
