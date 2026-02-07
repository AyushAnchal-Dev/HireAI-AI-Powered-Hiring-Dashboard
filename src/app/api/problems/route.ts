import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const difficulty = searchParams.get("difficulty");
        const tag = searchParams.get("tag");

        const where: any = {};
        if (difficulty) where.difficulty = difficulty;
        if (tag) where.tags = { has: tag };

        const problems = await prisma.problem.findMany({
            where,
            orderBy: { id: 'desc' }, // Recently created first
            include: {
                recruiter: {
                    select: { name: true, email: true }
                }
            }
        });

        return NextResponse.json(problems);
    } catch (error) {
        console.error("[PROBLEMS_GET]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        // In a real app, verify role === 'recruiter'
        if (!session || !session.user || !session.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { title, description, difficulty, tags } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        const problem = await prisma.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags: tags || [],
                recruiterId: user.id,
            }
        });

        return NextResponse.json(problem);
    } catch (error) {
        console.error("[PROBLEMS_POST]", error);
        return NextResponse.json({ error: "Internal Error: " + (error as Error).message }, { status: 500 });
    }
}
