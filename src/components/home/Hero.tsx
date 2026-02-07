"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import HeroVisuals from "./HeroVisuals";

export default function Hero() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center pt-24 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE: TEXT CONTENT */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
          >
            AI-Powered Hiring,
            <span className="text-blue-600"> Made Simple</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl"
          >
            Screen candidates faster with AI-assisted resume matching
            and a modern hiring dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link href="/signup">
              <Button size="lg" className="shadow-lg">
                Get Started
              </Button>
            </Link>

            <Link href="/login">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* RIGHT SIDE: HERO VISUALS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="hidden md:block"
        >
          <HeroVisuals />
        </motion.div>

      </div>
    </section>
  );
}
