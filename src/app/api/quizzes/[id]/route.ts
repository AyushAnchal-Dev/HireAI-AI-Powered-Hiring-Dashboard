import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const quiz = await prisma.quiz.findUnique({
            where: { id: params.id },
            include: {
                recruiter: { select: { name: true } }
            }
        });

        if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

        return NextResponse.json(quiz);
    } catch (error) {
        console.error("[QUIZ_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
