
import { slidingWindowGenerator } from "./sliding-window";
import { twoPointersGenerator } from "./two-pointers";
import { GeneratedQuestion } from "./types";
import { getRandomVariant } from "./utils";

// Registry of Atomic Generators
const ATOMIC_GENERATORS = [
    slidingWindowGenerator,
    twoPointersGenerator
];

export function generateDailyBatch(count: number = 15, existingDifficulties: string[] = []): GeneratedQuestion[] {
    const questions: GeneratedQuestion[] = [];
    const usedSignatures = new Set<string>();
    let attempts = 0;
    const MAX_ATTEMPTS = count * 10;

    // 1. Quota Definition
    const TARGET_QUOTA = { "Easy": 5, "Medium": 7, "Hard": 3 };

    // Adjust quota based on total count requested (scale down if count < 15, or just fill round-robin)
    // For simplicity, we fill based on what's missing from the global picture.

    // Account for what we already have (e.g. from AI)
    const currentCounts: Record<string, number> = { "Easy": 0, "Medium": 0, "Hard": 0 };
    existingDifficulties.forEach(d => { if (currentCounts[d] !== undefined) currentCounts[d]++ });

    // Determine what we still need
    const getNextNeededDifficulty = (): "Easy" | "Medium" | "Hard" => {
        if (currentCounts["Easy"] < TARGET_QUOTA["Easy"]) return "Easy";
        if (currentCounts["Medium"] < TARGET_QUOTA["Medium"]) return "Medium";
        if (currentCounts["Hard"] < TARGET_QUOTA["Hard"]) return "Hard";
        // If all quotas met but we still need questions (e.g. count > 15), pick random
        return ["Easy", "Medium", "Hard"][Math.floor(Math.random() * 3)] as any;
    };

    while (questions.length < count && attempts < MAX_ATTEMPTS) {
        attempts++;

        // 2. Pick Random Generator
        const generator = ATOMIC_GENERATORS[Math.floor(Math.random() * ATOMIC_GENERATORS.length)];

        // 3. Pick Variant Targeted at Needed Difficulty
        const targetDiff = getNextNeededDifficulty();
        const variant = getRandomVariant(targetDiff);

        // 4. Generate
        const question = generator.generate(variant);

        // 5. Check Uniqueness & Validity
        // Ensure the generated question actually matches the target difficulty (generators might override)
        if (!usedSignatures.has(question.signature)) {
            // Verify difficulty match (loose check, or just accept it to avoid loops)
            if (question.difficulty === targetDiff || attempts > count * 5) {
                usedSignatures.add(question.signature);
                questions.push(question);
                if (currentCounts[question.difficulty] !== undefined) {
                    currentCounts[question.difficulty]++;
                }
            }
        }
    }

    console.log(`[BatchEngine] Generated ${questions.length} unique questions. Stats: E=${currentCounts.Easy}, M=${currentCounts.Medium}, H=${currentCounts.Hard}`);
    return questions;
}
