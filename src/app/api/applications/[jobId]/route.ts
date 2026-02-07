import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: { jobId: string } }
) {
  const apps = await prisma.application.findMany({
    where: { jobId: params.jobId },
    include: {
      candidate: {
        include: { user: true },
      },
    },
  });

  const formattedApps = apps.map((app) => ({
    ...app,
    name: app.candidate.name,
    email: app.candidate.user.email,
  }));

  return NextResponse.json(formattedApps);
}
