
import { createHash } from "crypto";
import { Variant } from "./types";

// 1. Signature Hasher
// 1. Signature Hasher (Fingerprint v2)
export function generateSignature(patternId: string, variant: Variant): string {
    // Includes answerType and complete shape to make duplication mathematically impossible
    // unless the logic itself is identical.
    const data = `${patternId}:${variant.task}:${variant.shape}:${variant.constraint}:${variant.answerType}`;
    return createHash("md5").update(data).digest("hex");
}

// 2. Centralized Story Bank
export const STORY_THEMES = {
    tech: [
        "analyzing server logs", "processing API requests", "optimizing database queries",
        "scanning filesystem paths", "tracking user sessions", "monitoring network packets"
    ],
    finance: [
        "tracking stock prices", "auditing transaction logs", "calculating portfolio returns",
        "detecting fraud patterns", "forecasting revenue streams"
    ],
    gaming: [
        "calculating player scores", "tracking level progress", "finding item durability",
        "matching player rankings", "analyzing leaderboard stats"
    ],
    nature: [
        "monitoring rainfall data", "tracking animal migration paths", "analyzing temperature sensors",
        "measuring seismic activity", "studying gene sequences"
    ]
};

export function getRandomStory(theme?: keyof typeof STORY_THEMES): string {
    const themes = theme ? [theme] : (Object.keys(STORY_THEMES) as Array<keyof typeof STORY_THEMES>);
    const selectedTheme = themes[Math.floor(Math.random() * themes.length)];
    const stories = STORY_THEMES[selectedTheme];
    return `You are ${stories[Math.floor(Math.random() * stories.length)]}.`;
}

// 3. Variant Randomizer
export function getRandomVariant(difficulty?: "Easy" | "Medium" | "Hard"): Variant {
    const tasks: any[] = ["max", "min", "count", "exists"];
    const shapes: any[] = ["sorted", "unsorted", "mixed"];

    // Bias constraints based on difficulty if provided
    let constraints: any[] = ["small", "medium", "large"];
    if (difficulty === "Easy") constraints = ["small"];
    if (difficulty === "Medium") constraints = ["medium"];
    if (difficulty === "Hard") constraints = ["large"];

    return {
        task: tasks[Math.floor(Math.random() * tasks.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        constraint: constraints[Math.floor(Math.random() * constraints.length)],
        answerType: "integer" // Default, generators override
    };
}
