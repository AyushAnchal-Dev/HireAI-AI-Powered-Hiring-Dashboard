"use client";

import { motion } from "framer-motion";

export default function HeroVisuals() {
    return (
        <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1200px]">

            {/* BLUR GRADIENT BACKGROUND ELEMENTS - Subtle glow behind the visuals */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[100px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-emerald-500/10 rounded-full blur-[80px] -z-10 translate-x-20 translate-y-10" />

            {/* CONTAINER FOR 3-COLUMN LAYOUT SIMULATION WITHIN THE VISUAL AREA */}
            <div className="relative w-full max-w-[500px] h-[400px] grid grid-cols-2 items-center gap-4">

                {/* RESUME CARD (Left) */}
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-[220px] h-[320px] rounded-2xl glass border border-cyan-400/30 shadow-[0_0_40px_rgba(0,255,255,0.15)] transform rotate-y-[-12deg] rotate-x-[6deg] z-10 sm:w-[240px] sm:h-[340px]"
                >
                    <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 pointer-events-none" />

                    {/* GLOW CROSS */}
                    <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-400/50 blur-[1px]" />
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-400/50 blur-[1px]" />

                    {/* FAKE TEXT CONTENT */}
                    <div className="p-5 space-y-3 opacity-80">
                        <div className="w-12 h-12 rounded-full bg-white/20 mb-4" />
                        <div className="h-2 bg-white/30 rounded w-3/4" />
                        <div className="h-2 bg-white/30 rounded w-1/2" />
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-2 bg-white/20 rounded w-full" />
                        ))}
                    </div>
                </motion.div>

                {/* CONNECTIONS (Absolute positioned between cards) */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[100px] z-0 overflow-visible opacity-60">
                    {/* Animated connection lines could go here, for now simple lines */}
                    <line x1="10" y1="20" x2="190" y2="20" stroke="#00FF88" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="10" y1="50" x2="190" y2="50" stroke="#00FF88" strokeWidth="2" strokeDasharray="5,5" />
                    <line x1="10" y1="80" x2="190" y2="80" stroke="#00FF88" strokeWidth="2" strokeDasharray="5,5" />
                </svg>

                {/* JOB CARD (Right) */}
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-[220px] h-[280px] rounded-2xl bg-[#0E1628]/90 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_40px_rgba(0,100,255,0.2)] transform rotate-y-[10deg] flex flex-col justify-center p-5 z-20 sm:w-[240px] sm:h-[300px] ml-auto"
                >
                    <h3 className="text-white text-lg font-semibold mb-3 leading-tight">
                        Frontend Engineer
                    </h3>
                    <p className="text-blue-200/70 text-xs mb-4">Remote • Full-time</p>

                    <div className="flex flex-wrap gap-2">
                        {["React", "TS", "Node"].map(skill => (
                            <span
                                key={skill}
                                className="px-2 py-1 text-xs rounded-full border border-cyan-400/30 text-cyan-300 bg-cyan-400/10"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* MATCH SCORE RING (Floating) */}
                <motion.div
                    animate={{
                        rotate: 360,
                        y: [0, -10, 0]
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-[4px] border-emerald-400/80 shadow-[0_0_30px_rgba(0,255,150,0.5)] flex items-center justify-center bg-[#060B1A]/80 backdrop-blur-md z-30"
                >
                    <div className="text-center transform flex flex-col items-center justify-center h-full w-full">
                        <span className="text-[10px] text-emerald-200 uppercase tracking-wider">Match</span>
                        <span className="text-xl font-bold text-white">84%</span>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
