import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { coverLetter } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        // Ensure candidate profile exists (User -> Candidate)
        // The schema says Application links to Candidate, not User directly for candidateId.
        // We need to find the Candidate record for this user, or create one if it doesn't exist.
        // For now, let's assume we use the User ID if your schema changed, OR we find the Candidate record.
        // Based on previous schema view: model Candidate { ... userId String ... }

        let candidate = await prisma.candidate.findFirst({
            where: { userId: user.id }
        });

        // If no candidate profile exists, we might need to create a stub or error out. 
        // For this flow, let's auto-create a stub candidate if missing to prevent 500s.
        if (!candidate) {
            candidate = await prisma.candidate.create({
                data: {
                    userId: user.id,
                    name: user.name || "Unknown",
                    resumeUrl: "",
                    skills: []
                }
            });
        }

        // Check if already applied (using candidate.id)
        const existing = await prisma.application.findFirst({
            where: {
                jobId: params.id,
                candidateId: candidate.id
            }
        });

        if (existing) {
            return new NextResponse("Already applied", { status: 400 });
        }

        const application = await prisma.application.create({
            data: {
                jobId: params.id,
                candidateId: candidate.id, // Use Candidate ID, not User ID
                status: "PENDING",
                match: 0, // Default mock match score
                confidence: "Low", // Default confidence
            }
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error("[APPLY_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
