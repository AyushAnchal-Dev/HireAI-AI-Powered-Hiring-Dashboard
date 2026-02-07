import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { answers } = await req.json(); // Array of indices provided by user
        // e.g. [1, 0, 3]

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return new NextResponse("User not found", { status: 404 });

        const quiz = await prisma.quiz.findUnique({
            where: { id: params.id }
        });
        if (!quiz) return new NextResponse("Quiz not found", { status: 404 });

        const questions = quiz.questions as any[];
        let score = 0;

        questions.forEach((q, idx) => {
            if (answers[idx] === q.answer) {
                score++;
            }
        });

        // Save result
        const result = await prisma.quizResult.create({
            data: {
                quizId: quiz.id,
                userId: user.id,
                score,
                total: questions.length
            }
        });

        return NextResponse.json({
            score,
            total: questions.length,
            resultId: result.id
        });

    } catch (error) {
        console.error("[QUIZ_SUBMIT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
