import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateProblem } from "@/lib/dsa-generator";
import { getGenerator } from "@/lib/generators/registry";

export async function POST(req: Request) {
    try {
        const session = await auth();
        // Allow admins or automation scripts (via secret header) or recruiters
        // For MVP, just check if user exists
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // 1. Fetch a random template
        const templates = await prisma.questionTemplate.findMany();
        if (templates.length === 0) {
            return NextResponse.json({ error: "No templates found. Please seed the DB." }, { status: 404 });
        }
        const template = templates[Math.floor(Math.random() * templates.length)];

        // 2. Rule-Based vs AI Generation
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return new NextResponse("User not found", { status: 404 });

        let problem;
        // Check if template has a rule-based generator
        if (template.logicId) {
            const generator = getGenerator(template.logicId);
            if (generator) {
                console.log(`Using Rule Engine for ${template.pattern}`);
                const generatedData = generator(template.difficulty);

                problem = await prisma.problem.create({
                    data: {
                        title: generatedData.title,
                        description: generatedData.description,
                        difficulty: generatedData.difficulty,
                        tags: generatedData.tags,
                        recruiterId: user.id,
                        templateId: template.id,
                        testCases: {
                            create: generatedData.testCases
                        }
                    },
                    include: { testCases: true }
                });
            }
        }

        // Fallback to AI Helper if no rule engine or rule failed
        if (!problem) {
            console.log(`Falling back to AI/Mock for ${template.pattern}`);
            problem = await generateProblem(template.id, user.id);
        }

        return NextResponse.json(problem);

    } catch (error) {
        console.error("[GENERATE_PROBLEM]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
