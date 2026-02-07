"use client";

import { ThemeToggle } from "../theme-toggle";
import { User } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardHeader() {
  return (
    <header className="h-16 border-b glass sticky top-0 z-10 flex items-center justify-between px-6">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-lg font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
      >
        Dashboard
      </motion.h1>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary cursor-pointer"
        >
          <User className="h-4 w-4" />
        </motion.div>
      </div>
    </header>
  );
}
