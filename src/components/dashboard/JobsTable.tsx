"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type Job = {
  id: string;
  title: string;
  department: string;
  _count: {
    applications: number;
  };
  createdAt: string;
};

export default function JobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center p-4 text-white">Loading jobs...</div>;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden relative">
      <Table>
        <TableHeader className="bg-white/10">
          <TableRow className="hover:bg-white/10 border-white/10">
            <TableHead className="text-gray-300">Job Title</TableHead>
            <TableHead className="text-gray-300">Department</TableHead>
            <TableHead className="text-gray-300">Applicants</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-right text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobs.length === 0 ? (
            <TableRow className="hover:bg-transparent border-white/10">
              <TableCell colSpan={5} className="text-center p-8 text-gray-500">
                No active jobs found. Create one to get started!
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job, index) => (
              <motion.tr
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-white/10 transition-colors hover:bg-white/5 data-[state=selected]:bg-muted"
                style={{ display: "table-row" }}
              >
                <TableCell className="font-medium p-4 text-white">
                  {job.title}
                </TableCell>
                <TableCell className="p-4 text-gray-300">{job.department || "General"}</TableCell>
                <TableCell className="p-4 font-bold text-center w-32 border-l border-r border-white/10 bg-white/5 text-white">
                  {job._count.applications}
                </TableCell>
                <TableCell className="p-4">
                  <Badge variant="default" className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50">Active</Badge>
                </TableCell>
                <TableCell className="text-right p-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-white/20 transition-colors"
                    onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
                  >
                    View
                  </Button>
                </TableCell>
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
