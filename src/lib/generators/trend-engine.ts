import { prisma } from "@/lib/prisma";

export const WEEKLY_TRENDS = [
    "Array",        // Sunday
    "Array",        // Monday
    "Two Pointers", // Tuesday
    "Array",        // Wednesday (Fallback until we add more)
    "Two Pointers", // Thursday
    "Array",        // Friday
    "Array"         // Saturday
];

export async function getTrendingCategory() {
    const day = new Date().getDay(); // 0-6
    return WEEKLY_TRENDS[day];
}

export async function getTemplatesForTrend(category: string) {
    // 1. Fetch templates matching the category
    // Also include 'Generic' or 'Easy' ones to ensure volume
    const templates = await prisma.questionTemplate.findMany({
        where: {
            OR: [
                { category: category },
                { category: null } // Fallback to generic if needed logic
            ]
        }
    });

    // If no templates found for this trend (e.g., waiting for new patterns), fallback to ALL
    if (templates.length === 0) {
        console.warn(`[TrendEngine] No templates found for ${category}, falling back to all.`);
        return prisma.questionTemplate.findMany();
    }

    return templates;
}
