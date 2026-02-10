"use client";

import JobsTable from "@/components/dashboard/JobsTable";
import CreateJobModal from "@/components/dashboard/CreateJobModal";
import { motion } from "framer-motion";

export default function JobsPage() {
    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent inline-block">
                        Jobs
                    </h2>
                    <p className="text-gray-400 mt-1 text-lg">
                        Manage job postings and applications.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <CreateJobModal />
                </motion.div>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <JobsTable />
            </motion.div>
        </motion.div>
    );
}
