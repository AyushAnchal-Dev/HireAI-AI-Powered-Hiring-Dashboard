"use client";

import { motion } from "framer-motion";

interface ScoreCircleProps {
    score: number;
}

export default function ScoreCircle({ score }: ScoreCircleProps) {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="10"
                    fill="transparent"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={score > 70 ? "#16a34a" : score > 40 ? "#eab308" : "#dc2626"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Score Text */}
            <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold text-gray-800">{score}%</span>
                <span className="text-sm text-gray-500 uppercase tracking-widest">Match</span>
            </div>
        </div>
    );
}
