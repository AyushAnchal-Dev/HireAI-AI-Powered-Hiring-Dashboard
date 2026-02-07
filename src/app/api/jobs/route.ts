import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const jobs = await prisma.job.findMany({
    include: {
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(jobs);
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "recruiter") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const job = await prisma.job.create({
      data: {
        title: body.title,
        // @ts-expect-error - Prisma types regeneration verification pending
        department: body.department,
        description: body.description,
        recruiterId: (session.user as any).id,
        skills: body.skills ? body.skills.split(",").map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [],
      },
    });
    return NextResponse.json(job);
  } catch (err) {
    console.error(" [API] Job creation failed:", err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
