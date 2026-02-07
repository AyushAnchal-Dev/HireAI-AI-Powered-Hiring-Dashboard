import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "mock-key",
});

export async function generateProblem(templateId: string, recruiterId: string) {
    try {
        const template = await prisma.questionTemplate.findUnique({ where: { id: templateId } });
        if (!template) throw new Error("Template not found");

        let generatedData;

        if (process.env.OPENAI_API_KEY) {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a senior technical interviewer. Generate a coding problem in JSON format with fields: title, description, difficulty, tags (array), and testCases (array of objects with input, output, isHidden)." },
                    { role: "user", content: `Generate a variation of this pattern: ${template.pattern}. Prompt: ${template.basePrompt}. Make it unique.` }
                ],
                model: "gpt-3.5-turbo",
                response_format: { type: "json_object" },
            });
            const content = completion.choices[0].message.content;
            generatedData = content ? JSON.parse(content) : null;
        } else {
            // Mock Fallback
            const uniqueId = Math.floor(Math.random() * 1000);
            generatedData = {
                title: `${template.pattern} Challenge ${uniqueId}`,
                description: `This is an AI-generated variation of the ${template.pattern} problem (ID: ${uniqueId}). \n\n${template.basePrompt}`,
                difficulty: template.difficulty,
                tags: [template.pattern, "AI Generated"],
                testCases: [
                    { input: "Sample Input 1", output: "Sample Output 1", isHidden: false },
                    { input: "Hidden Input 2", output: "Hidden Output 2", isHidden: true }
                ]
            };
        }

        if (!generatedData) throw new Error("AI generation failed");

        const problem = await prisma.problem.create({
            data: {
                title: generatedData.title,
                description: generatedData.description,
                difficulty: generatedData.difficulty,
                tags: generatedData.tags,
                recruiterId: recruiterId,
                templateId: template.id,
                testCases: {
                    create: generatedData.testCases
                }
            },
            include: { testCases: true }
        });

        return problem;

    } catch (error) {
        console.error("[GENERATE_HELPER]", error);
        throw error;
    }
}
