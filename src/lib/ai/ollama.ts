
export interface AIProblemData {
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    tags: string[];
    // Simplification: We will ask AI to return JSON string in text
}

export async function generateQuestionFromAI(tag: string): Promise<AIProblemData | null> {
    const model = "llama3"; // User must pull this, or change to 'mistral'
    const prompt = `
    Generate a unique Data Structures and Algorithms (DSA) problem inspired by the topic "${tag}".
    
    Rules:
    1. Do NOT copy an existing LeetCode question. Create a new story (e.g., Space, medieval, bio-tech).
    2. Difficulty: Randomly choose Easy, Medium, or Hard.
    3. Output MUST be valid JSON only. No markdown formatting.
    
    JSON Format:
    {
        "title": "Creative String Title",
        "description": "Full problem statement with Input/Output format and Constraints.",
        "difficulty": "Medium",
        "tags": ["${tag}", "Array"]
    }
    `;

    try {
        console.log(`[Ollama] Generating problem for tag: ${tag}...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        const res = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                stream: false,
                format: "json"
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Ollama connection failed");

        const data = await res.json();
        const responseText = data.response;

        // Parse JSON
        const problem: AIProblemData = JSON.parse(responseText);
        return problem;

    } catch (error) {
        console.error("[Ollama] Error:", error);
        return null;
    }
}

export interface CodeFeedback {
    summary: string;
    timeComplexity: string;
    spaceComplexity: string;
    suggestions: string[];
}

export async function generateCodeFeedback(code: string, problemTitle: string): Promise<CodeFeedback | null> {
    const model = "llama3";
    const prompt = `
    Analyze the following code solution for the algorithm problem "${problemTitle}".
    
    Code:
    ${code}

    Provide feedback in strict JSON format:
    {
        "summary": "Brief 1-sentence summary of the approach",
        "timeComplexity": "Big O notation",
        "spaceComplexity": "Big O notation",
        "suggestions": ["Array of 2-3 specific improvements"]
    }
    `;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model,
                prompt,
                stream: false,
                format: "json"
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error("Ollama connection failed");

        const data = await res.json();
        return JSON.parse(data.response);
    } catch (e) {
        console.error("[Ollama Feedback] Error:", e);
        // Fallback or null
        return {
            summary: "Analysis unavailable (AI Offline)",
            timeComplexity: "Unknown",
            spaceComplexity: "Unknown",
            suggestions: ["Check edge cases", "Verify time complexity"]
        };
    }
}
