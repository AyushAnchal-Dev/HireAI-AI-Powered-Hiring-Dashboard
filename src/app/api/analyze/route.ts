import { NextResponse } from "next/server";
import OpenAI from "openai";
// @ts-ignore
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

import { generateJobMatches } from "@/lib/generateMatches";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No resume uploaded" },
        { status: 400 }
      );
    }

    // 1️⃣ Read PDF using pdf2json
    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeText = "";

    try {
      const PDFParser = require("pdf2json");
      const parser = new PDFParser(null, 1);
      resumeText = await new Promise((resolve, reject) => {
        parser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        parser.on("pdfParser_dataReady", (pdfData: any) => {
          resolve(parser.getRawTextContent());
        });
        parser.parseBuffer(buffer);
      });
    } catch (parseError) {
      console.error("PDF Parsing failed:", parseError);
      return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
    }

    // 2️⃣ AI Analysis (with Fallback)
    let aiResult;
    try {
      const prompt = `
        You are an ATS resume analyzer.
        Extract:
        1. Technical skills
        2. Strengths
        3. Weaknesses
        4. Career Suggestions (Actionable advice)

        Return ONLY JSON in this format:
        {
        "skills": string[],
        "strengths": string[],
        "weaknesses": string[],
        "suggestions": string[]
        }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a hiring assistant." },
          { role: "user", content: resumeText.slice(0, 3000) + prompt },
        ],
      });
      aiResult = JSON.parse(response.choices[0].message.content || "{}");
    } catch (aiError: any) {
      console.warn("AI Analysis failed (likely quota), using fallback analysis.");

      const commonSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "AWS", "HTML", "CSS"];
      const extractedSkills = commonSkills.filter(s => resumeText.toLowerCase().includes(s.toLowerCase()));

      aiResult = {
        skills: extractedSkills,
        strengths: ["Technical Proficiency", "Problem Solving (Inferred)", "Web Development"],
        weaknesses: ["Leadership experience unclear", "Missing quantitative metrics"],
        suggestions: ["Add more quantifiable achievements", "Highlight leadership roles", "Include a link to portfolio"],
      };
    }

    // 3️⃣ Generate Job Matches
    const jobMatches = generateJobMatches(aiResult.skills || []);

    // 4️⃣ Final Response
    return NextResponse.json({
      ...aiResult,
      roles: jobMatches,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Resume analysis failed" },
      { status: 500 }
    );
  }
}
