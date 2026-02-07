"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  async function handleAnalyze() {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    localStorage.setItem("analysis", JSON.stringify(data));
    router.push("/analyze/result");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow w-full max-w-md">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <Button className="mt-6 w-full" onClick={handleAnalyze}>
          Analyze Resume
        </Button>
      </div>
    </div>
  );
}
