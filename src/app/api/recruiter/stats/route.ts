import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user || (session.user as any).role !== "recruiter") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const recruiterId = (session.user as any).id;

        // 1. Active Jobs Count
        const activeJobsCount = await prisma.job.count({
            where: {
                recruiterId: recruiterId,
            },
        });

        // 2. Total Applicants Count (across all jobs posted by this recruiter)
        // We can filter applications where the job's recruiterId matches
        const applicantsCount = await prisma.application.count({
            where: {
                job: {
                    recruiterId: recruiterId
                }
            },
        });

        // 3. Shortlisted Candidates Count
        // Assuming 'status' is used to track shortlisting. 
        // If you don't have a specific 'SHORTLISTED' status, we might count those > certain match score, 
        // or just use 'ACCEPTED' / 'INTERVIEW' etc. 
        // For now let's assume we want to count distinct candidates who have applied, or just total applications.
        // The previous mock data had "Shortlisted". Let's assume we check for status not 'PENDING' or 'REJECTED' or specific 'SHORTLISTED'.
        // Let's count applications with status != 'PENDING' and != 'REJECTED' as "Shortlisted" / In Progress
        const shortlistedCount = await prisma.application.count({
            where: {
                job: {
                    recruiterId: recruiterId
                },
                status: {
                    notIn: ["PENDING", "REJECTED"]
                }
            },
        });

        return NextResponse.json({
            activeJobs: activeJobsCount,
            applicants: applicantsCount,
            shortlisted: shortlistedCount
        });

    } catch (error) {
        console.error("[RECRUITER_STATS]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
