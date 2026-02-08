import { prisma } from "@/lib/prisma";
import { generateProblem } from "@/lib/dsa-generator";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getGenerator } from "@/lib/generators/registry";
import { getTrendingCategory, getTemplatesForTrend } from "@/lib/generators/trend-engine";
import { generateDailyBatch } from "@/lib/generators/advanced/batch-engine";
import { fetchTrendingTags } from "@/lib/external/codeforces";
import { generateQuestionFromAI } from "@/lib/ai/ollama";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const secret = searchParams.get("secret");

        // Simple security check
        // In prod, use process.env.CRON_SECRET
        if (secret !== "MY_SECRET_KEY" && process.env.NODE_ENV === "production") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));

        // 1. Check if Daily Pack exists
        const existingPack = await prisma.questionPack.findFirst({
            where: {
                type: "Daily",
                date: { gte: startOfDay }
            }
        });

        const force = searchParams.get("force") === "true";

        if (existingPack && !force) {
            return NextResponse.json({ message: "Daily Pack already exists", packId: existingPack.id });
        }

        // 2. Trend Engine: Get Today's Topic
        const trendingCategory = await getTrendingCategory();
        console.log(`[CRON] Today's Trend: ${trendingCategory}`);

        const templates = await getTemplatesForTrend(trendingCategory);

        if (templates.length === 0) {
            console.warn("No templates for trend, checking all...");
            // logic already handled in trend engine fallback, but safe check
        }

        // 3. Generate Questions (AI Priority -> Batch Fallback)
        const TARGET_COUNT = 15;
        let aiQuestions = [];

        try {
            // A. Attempt AI Generation
            const trends = await fetchTrendingTags();
            console.log("Trends:", trends);

            // Generate parallel requests for speed (limit concurrency in prod)
            // Generate in chunks of 3 for safety
            const CHUNK_SIZE = 3;
            for (let i = 0; i < TARGET_COUNT; i += CHUNK_SIZE) {
                const chunkPromises = [];
                for (let j = 0; j < CHUNK_SIZE && i + j < TARGET_COUNT; j++) {
                    const tag = trends[(i + j) % trends.length];
                    chunkPromises.push(generateQuestionFromAI(tag));
                }
                const chunkResults = await Promise.all(chunkPromises);
                aiQuestions.push(...chunkResults.filter(q => q !== null));
            }

        } catch (e) {
            console.error("AI Generation failed:", e);
        }

        // B. Fallback to Batch Engine if AI failed or insufficient
        if (aiQuestions.length < TARGET_COUNT) {
            console.log(`[CRON] AI returned ${aiQuestions.length}/${TARGET_COUNT}. Filling with Batch Engine.`);
            // We consciously do nothing here because Section C handles the filling.
        }

        // C. Combine and Save
        const newProblems = [];

        // Need a user to assign to
        const recruiter = await prisma.user.findFirst({ where: { role: "recruiter" } });
        const systemId = recruiter?.id || (await prisma.user.findFirst())?.id;
        if (!systemId) throw new Error("No user found");

        // Save AI Questions
        for (const q of aiQuestions) {
            const p = await prisma.problem.create({
                data: {
                    title: q.title,
                    description: q.description,
                    difficulty: q.difficulty,
                    tags: [...q.tags, "AI-Generated", "Trending"],
                    recruiterId: systemId,
                    // No test cases for AI yet
                }
            });
            newProblems.push(p);
        }

        // Save Batch Questions (Reliable Fallback)
        if (newProblems.length < TARGET_COUNT) {
            const needed = TARGET_COUNT - newProblems.length;

            // Extract difficulties from *saved* problems (AI ones)
            // Note: newProblems contains Prisma objects, they have a 'difficulty' field.
            const existingDiffs = newProblems.map(p => p.difficulty);

            const batchQs = generateDailyBatch(needed, existingDiffs);

            // Fetch a default template to satisfy FK
            const defaultTemplate = (await prisma.questionTemplate.findFirst())?.id;

            for (const q of batchQs) {
                const p = await prisma.problem.create({
                    data: {
                        title: q.title,
                        description: q.description,
                        difficulty: q.difficulty,
                        tags: [...q.tags, "Advanced"],
                        recruiterId: systemId,
                        templateId: defaultTemplate || undefined,
                        testCases: { create: q.testCases }
                    }
                });
                newProblems.push(p);
            }
        }

        // Fetch a fallback template ID (e.g., Array) to satisfy FK if needed, 
        // or we can allow nullable. Schema says `templateId` is optional? 
        // Let's check schema/seed. TemplateId might be required.
        // For MVP, just pick the first template as a dummy parent.
        const defaultTemplate = (await prisma.questionTemplate.findFirst())?.id;



        // 4. Create Pack
        const pack = await prisma.questionPack.create({
            data: {
                title: `Daily Trending: ${trendingCategory} (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
                type: "Daily",
                problems: {
                    connect: newProblems.map(p => ({ id: p.id }))
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: "Daily Pack Created",
            packId: pack.id,
            problems: newProblems.map(p => p.title)
        });

    } catch (error) {
        console.error("[CRON_DAILY]", error);
        return NextResponse.json({ error: "Cron Failed: " + (error as Error).message }, { status: 500 });
    }
}
