import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { runCodeLocal } from "@/lib/execution/runner";

export async function POST(req: Request) {
    try {
        const session = await auth();
        // For MVP, user must be logged in
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { code, language, problemId } = await req.json();

        if (!problemId || !code) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // 1. Fetch Problem & Test Cases
        const problem = await prisma.problem.findUnique({
            where: { id: problemId },
            include: { testCases: true }
        });

        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        // 2. Execute Code (LOCAL ENGINE)
        const results = await runCodeLocal(code, language || 'javascript', problem.testCases);

        return NextResponse.json(results);

    } catch (error) {
        console.error("[RUN_CODE]", error);
        return NextResponse.json({ error: "Execution Failed: " + (error as Error).message }, { status: 500 });
    }
}
