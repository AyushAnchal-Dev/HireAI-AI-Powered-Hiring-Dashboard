
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const problem = await prisma.problem.findUnique({
            where: { id: params.id },
            include: {
                recruiter: {
                    select: { name: true, email: true }
                }
            }
        });

        if (!problem) {
            return new NextResponse("Problem not found", { status: 404 });
        }

        return NextResponse.json(problem);
    } catch (error) {
        console.error("[PROBLEM_GET_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
