
interface CodeforcesProblem {
    contestId: number;
    index: string;
    name: string;
    type: string;
    tags: string[];
    rating?: number;
}

interface CodeforcesResponse {
    status: string;
    result: {
        problems: CodeforcesProblem[];
        problemStatistics: any[];
    };
}

export async function fetchTrendingTags(): Promise<string[]> {
    try {
        console.log("[Codeforces] Fetching trending problems...");
        // Fetch raw problem set (limit not supported natively, but response is paginated or full)
        // We fetch standard API. Note: This can be large (~10MB), in prod cache this!
        const res = await fetch("https://codeforces.com/api/problemset.problems", {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) throw new Error("Failed to fetch Codeforces data");

        const data: CodeforcesResponse = await res.json();

        if (data.status !== "OK") throw new Error("Codeforces API error");

        // Logic: Get problems from recent contests (e.g., last 500 IDs approx)
        // Sort by contestId descending
        const problems = data.result.problems.sort((a, b) => b.contestId - a.contestId);

        // Take top 100 recent problems
        const recentProblems = problems.slice(0, 100);

        // Count tags
        const tagCounts: Record<string, number> = {};
        recentProblems.forEach(p => {
            p.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        // specific filter: ignore "implementation", "brute force" as they are generic
        delete tagCounts["implementation"];
        delete tagCounts["brute force"];

        // Sort by popularity
        const sortedTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([tag]) => tag);

        console.log("[Codeforces] Trending Tags:", sortedTags.slice(0, 3));

        // Return top 3
        return sortedTags.slice(0, 3);

    } catch (error) {
        console.error("[Codeforces] Error:", error);
        // Fallback
        return ["dp", "greedy", "graphs"];
    }
}
