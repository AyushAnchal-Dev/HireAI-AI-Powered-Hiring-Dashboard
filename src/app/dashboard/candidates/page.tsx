"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MatchBar from "@/components/MatchBar";
import ResumeUpload from "@/components/ResumeUpload";
import { extractSkillsFromText, extractName, extractEmail } from "@/lib/extractSkills";
import { candidates as initialCandidates } from "@/data/sampleCandidates";
import { calculateWeightedMatch } from "@/lib/aiMatch";
import { JOB_SKILLS } from "@/data/jobSkills";
import { motion, AnimatePresence } from "framer-motion";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      console.log("Starting upload...", file.name, file.size);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errText = await res.text();
        console.error("Upload error text:", errText);
        throw new Error("Upload failed: " + res.status);
      }

      const data = await res.json();
      console.log("Raw text received length:", data.text?.length);

      const extractedSkills = extractSkillsFromText(data.text);
      const extractedName = extractName(data.text);
      const extractedEmail = extractEmail(data.text);

      // Find best matching job role by iterating through all defined roles
      let bestMatch = { role: "Generalist", percent: 0, confidence: "Low" };

      Object.entries(JOB_SKILLS).forEach(([role, skills]) => {
        const result = calculateWeightedMatch(extractedSkills, skills);
        if (result.matchPercent > bestMatch.percent) {
          bestMatch = {
            role: role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()), // Format role name
            percent: result.matchPercent,
            confidence: result.confidence
          };
        }
      });

      console.log("Extracted Data:", { extractedName, extractedEmail, extractedSkills });
      console.log("AI Match Result:", bestMatch);

      const newCandidate = {
        id: candidates.length + 1,
        name: extractedName,
        job: bestMatch.role,
        match: bestMatch.percent,
        status: bestMatch.confidence === "High" ? "Shortlisted" : "New",
      };

      setCandidates([...candidates, newCandidate]);
      setIsOpen(false);
      alert(`Resume parsed! Added ${extractedName}. Best fit: ${bestMatch.role} (${bestMatch.percent}%)`);
    } catch (error) {
      console.error("HandleUpload Error:", error);
      alert("Failed to upload resume. Check console.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Candidates
        </h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              Upload Resume
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md backdrop-blur-sm bg-background/95 border-primary/20">
            <h2 className="text-lg font-semibold mb-4 text-primary">Upload Resume</h2>
            <ResumeUpload onUpload={handleUpload} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-semibold text-muted-foreground">Candidate</th>
              <th className="p-4 font-semibold text-muted-foreground">Job Role</th>
              <th className="p-4 font-semibold text-muted-foreground">Match Score</th>
              <th className="p-4 font-semibold text-muted-foreground">Status</th>
              <th className="p-4 font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            <AnimatePresence>
              {candidates.map((c, index) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <td className="p-4 font-medium">
                    <div className="flex flex-col">
                      <span className="text-foreground group-hover:text-primary transition-colors">{c.name}</span>
                      <span className="text-xs text-muted-foreground">ID: #{c.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{c.job}</td>
                  <td className="p-4">
                    <MatchBar score={c.match} />
                  </td>
                  <td className="p-4">
                    <Badge variant={c.status === "Shortlisted" ? "default" : "secondary"} className="shadow-sm">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button size="sm" className="h-8 shadow-sm">Shortlist</Button>
                    <Button size="sm" variant="outline" className="h-8 shadow-sm">
                      Reject
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
