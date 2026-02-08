import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    // In a real app, restrict to recruiter
    // if (!session || (session.user as any).role !== "recruiter") ...

    const applications = await prisma.application.findMany({
      select: {
        status: true,
        match: true,
      }
    });

    const total = applications.length;
    const shortlisted = applications.filter(a => a.status === 'shortlisted' || a.status === 'ACCEPTED').length;
    const rejected = applications.filter(a => a.status === 'rejected' || a.status === 'REJECTED').length;

    const avgScore = total > 0
      ? Math.round(applications.reduce((acc, curr) => acc + (curr.match || 0), 0) / total)
      : 0;

    // Calculate Buckets
    const buckets = [
      { range: "0-20", count: 0 },
      { range: "21-40", count: 0 },
      { range: "41-60", count: 0 },
      { range: "61-80", count: 0 },
      { range: "81-100", count: 0 },
    ];

    applications.forEach(app => {
      const score = app.match || 0;
      if (score <= 20) buckets[0].count++;
      else if (score <= 40) buckets[1].count++;
      else if (score <= 60) buckets[2].count++;
      else if (score <= 80) buckets[3].count++;
      else buckets[4].count++;
    });

    return NextResponse.json({
      total,
      shortlisted,
      rejected,
      avgScore,
      scoreBuckets: buckets
    });

  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
