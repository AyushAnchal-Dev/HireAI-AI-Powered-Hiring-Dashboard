"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";

interface InsightCardProps {
    title: string;
    items: string[];
    type: "good" | "warn" | "info";
}

export default function InsightCard({ title, items, type }: InsightCardProps) {
    const styles = {
        good: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-800",
            icon: <CheckCircle className="w-5 h-5 text-green-600" />,
        },
        warn: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            text: "text-amber-800",
            icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        },
        info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-800",
            icon: <Lightbulb className="w-5 h-5 text-blue-600" />,
        },
    };

    const theme = styles[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`p-6 rounded-xl border ${theme.bg} ${theme.border}`}
        >
            <div className="flex items-center gap-3 mb-4">
                {theme.icon}
                <h3 className={`font-semibold text-lg ${theme.text}`}>{title}</h3>
            </div>

            <ul className="space-y-3">
                {items.length > 0 ? (
                    items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                            {item}
                        </li>
                    ))
                ) : (
                    <li className="text-sm text-gray-500 italic">No items to display</li>
                )}
            </ul>
        </motion.div>
    );
}
