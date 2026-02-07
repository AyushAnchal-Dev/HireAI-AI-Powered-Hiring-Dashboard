"use client";

import { motion } from "framer-motion";

export default function ScoreCircle({ score }: { score: number }) {
  const color =
    score >= 75 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`text-5xl font-bold ${color}`}
      >
        {score}
      </motion.div>
      <span className="absolute bottom-6 text-sm text-gray-500">
        Resume Score
      </span>
    </div>
  );
}
