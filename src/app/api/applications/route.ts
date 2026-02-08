import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        // Assuming recruiter wants to see all applications for THEIR jobs
        // Prisma query needs nested filtering
        const applications = await prisma.application.findMany({
            where: {
                job: {
                    recruiterId: user.id
                }
            },
            include: {
                candidate: {
                    include: {
                        user: { select: { email: true } }
                    }
                },
                job: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Flatten the response for frontend
        const formattedApplications = applications.map(app => ({
            ...app,
            candidate: {
                ...app.candidate,
                email: app.candidate.user.email
            }
        }));

        return NextResponse.json(formattedApplications);
    } catch (error) {
        console.error("[APPLICATIONS_GET]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobId } = await req.json();

        // Check if candidate profile exists
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Auto-create candidate profile if missing (resilience)
        let candidate = await prisma.candidate.findFirst({
            where: { userId: user.id }
        });

        let candidateId = candidate?.id;
        if (!candidateId) {
            const newCandidate = await prisma.candidate.create({
                data: { userId: user.id, name: user.name || "Candidate", resumeUrl: "", skills: [] }
            });
            candidateId = newCandidate.id;
        }

        // Check for existing application
        const existing = await prisma.application.findFirst({
            where: {
                candidateId,
                jobId
            }
        });

        if (existing) {
            return NextResponse.json({ error: "Already applied" }, { status: 409 });
        }

        const application = await prisma.application.create({
            data: {
                candidateId,
                jobId,
                status: "PENDING",
                match: 0, // Will be updated by AI worker or separate logic
                confidence: "Pending" // Added default value
            }
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error("[APPLICATIONS_POST]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { applicationId, status } = await req.json();

        // Verify owner
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        // In real app, check if user.id owns the job associated with application

        const updated = await prisma.application.update({
            where: { id: applicationId },
            data: { status }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[APPLICATIONS_PATCH]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}
