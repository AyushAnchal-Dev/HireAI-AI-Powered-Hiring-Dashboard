import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const quizzes = await prisma.quiz.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                recruiter: { select: { name: true, email: true } }
            }
        });

        // Hide answers from the list view
        const safeQuizzes = quizzes.map(q => ({
            ...q,
            questions: (q.questions as any[]).map((ques: any) => {
                // Return question structure without 'answer' index
                const { answer, ...safeQuestion } = ques;
                return safeQuestion;
            })
        }));

        return NextResponse.json(safeQuizzes);
    } catch (error) {
        console.error("[QUIZZES_GET]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, questions, timeLimit } = await req.json();

        // Safe check for email done above
        const userEmail = (session.user as any).email;

        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        const quiz = await prisma.quiz.create({
            data: {
                title,
                questions, // Array of { question, options, answer (idx) }
                timeLimit: parseInt(timeLimit),
                recruiterId: user.id
            }
        });

        return NextResponse.json(quiz);
    } catch (error) {
        console.error("[QUIZZES_POST]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}
