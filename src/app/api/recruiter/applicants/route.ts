
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user as any).role !== "recruiter") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const recruiterId = (session.user as any).id;

        // Fetch applications for jobs posted by this recruiter
        const applications = await prisma.application.findMany({
            where: {
                job: {
                    recruiterId: recruiterId
                }
            },
            include: {
                candidate: {
                    select: {
                        id: true,
                        name: true,
                        resumeUrl: true,
                        skills: true,
                        userId: true, // Needed for messaging
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const formattedAuth = applications.map(app => ({
            id: app.id,
            candidateId: app.candidate.id,
            userId: app.candidate.userId, // Expose for messaging
            name: app.candidate.name || "Unknown Candidate",
            job: app.job.title,
            match: app.match || 0,
            status: app.status,
            resumeUrl: app.candidate.resumeUrl,
            appliedAt: app.createdAt
        }));

        return NextResponse.json(formattedAuth);
    } catch (error) {
        console.error("[RECRUITER_APPLICANTS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
