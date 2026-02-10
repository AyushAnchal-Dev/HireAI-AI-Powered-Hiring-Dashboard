import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// GET Method to check resume status
export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const candidate = await prisma.candidate.findFirst({
        where: { userId: (session.user as any).id },
        select: { skills: true, resumeUrl: true }
    });

    return NextResponse.json(candidate || { skills: [], resumeUrl: null });
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== "candidate") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("resume") as File;

        if (!file) {
            return NextResponse.json({ error: "No resume uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. Save File to Public Directory
        const filename = `${(session.user as any).id}-${Date.now()}.pdf`;
        const uploadDir = join(process.cwd(), "public", "uploads"); // Ensure folder exists

        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);

        const resumeUrl = `/uploads/${filename}`;

        // 2. Parse PDF
        let resumeText = "";

        try {
            const PDFParser = require("pdf2json");
            const parser = new PDFParser(null, 1); // 1 = text content

            resumeText = await new Promise((resolve, reject) => {
                parser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                parser.on("pdfParser_dataReady", (pdfData: any) => {
                    // Extract text from raw content
                    const rawText = parser.getRawTextContent();
                    resolve(rawText);
                });
                parser.parseBuffer(buffer);
            });
        } catch (parseError) {
            console.error("PDF Parsing failed:", parseError);
            return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
        }

        // 2. Extract Skills (Try AI -> Fallback to Keyword Match)
        let skills: string[] = [];

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert resume parser. Extract technical skills as a JSON array of strings.",
                    },
                    {
                        role: "user",
                        content: `Resume Text:\n${resumeText.slice(0, 3000)}\n\nReturn ONLY JSON: { "skills": ["skill1", "skill2"] }`,
                    },
                ],
            });
            const aiResult = JSON.parse(response.choices[0].message.content || "{}");
            skills = aiResult.skills || [];
        } catch (aiError: any) {
            console.warn("AI Extraction failed (likely quota), switching to fallback:", aiError.message);

            // Primitive Fallback: Keywork matching
            const commonSkills = ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Java", "SQL", "PostgreSQL", "MongoDB", "Docker", "AWS", "css", "html"];
            const lowerText = resumeText.toLowerCase();
            skills = commonSkills.filter(s => lowerText.includes(s.toLowerCase()));
        }

        // 3. Update Candidate Profile
        // Note: In a real app, upload 'file' to S3/Blob storage and get URL.
        // Here we'll simulate a URL or store it if we had a storage provider.
        // For now, we update skills.
        const updatedCandidate = await prisma.candidate.updateMany({
            where: { userId: (session.user as any).id },
            data: {
                skills: skills,
                resumeUrl: resumeUrl, // Updated to real file path
            },
        });

        return NextResponse.json({
            message: "Resume parsed and profile updated",
            skills
        });

    } catch (error) {
        console.error("Resume upload error:", error);
        return NextResponse.json(
            { error: "Failed to process resume" },
            { status: 500 }
        );
    }
}
