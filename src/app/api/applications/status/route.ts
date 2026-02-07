import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { sendRejectionEmail, sendSelectionEmail } from "@/lib/mail";

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: true,
        candidate: {
          include: {
            user: true,
          },
        },
      },
    });

    // Send emails based on status
    if (status === "shortlisted") {
      await sendSelectionEmail(
        updated.candidate.user.email,
        updated.job.title,
        updated.match
      );
    } else if (status === "rejected") {
      await sendRejectionEmail(
        updated.candidate.user.email,
        updated.job.title
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Status update failed:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
