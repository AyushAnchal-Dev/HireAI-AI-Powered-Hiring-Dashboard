
import { AtomicGenerator, Variant, GeneratedQuestion, TestCaseData } from "./types";
import { generateSignature, getRandomStory } from "./utils";

export const slidingWindowGenerator: AtomicGenerator = {
    id: "sliding_window_fixed",
    generate: (variant: Variant): GeneratedQuestion => {
        // 1. Unpack Variant
        const { task, constraint, shape } = variant;
        const isMax = task === "max";

        // 2. Story Injection
        const story = getRandomStory();

        // 3. Constraints
        let size = 10;
        let k = 3;
        if (constraint === "medium") { size = 100; k = 10; }
        if (constraint === "large") { size = 1000; k = 50; }

        // 4. Input Generation
        const nums = Array.from({ length: size }, () => Math.floor(Math.random() * 200) - 100);

        // 5. Logic: Fixed Size Sliding Window (Max/Min Sum)
        // Task: Find max/min sum of subarray of size K
        // Valid Tasks for Fixed Window: Max, Min. (Count/Exists are for variable window)

        // Adjust task if needed for this logic
        const effectiveTask = (task === "count" || task === "exists") ? "max" : task;

        const solve = (arr: number[], winSize: number): number => {
            let currentSum = 0;
            for (let i = 0; i < winSize; i++) currentSum += arr[i];
            let ans = currentSum;

            for (let i = winSize; i < arr.length; i++) {
                currentSum += arr[i] - arr[i - winSize];
                ans = effectiveTask === "max" ? Math.max(ans, currentSum) : Math.min(ans, currentSum);
            }
            return ans;
        };

        const ans = solve(nums, k);

        // 6. Test Cases
        const testCases: TestCaseData[] = [
            {
                input: JSON.stringify({ nums, k }),
                output: ans.toString(),
                isHidden: false
            }
        ];

        // 7. Signature
        const signature = generateSignature("sliding_window_fixed", variant);

        // 8. Description Construction
        const taskText = effectiveTask === "max" ? "maximum sum" : "minimum sum";
        const desc = `${story}\n\nGiven an array of integers and an integer K, find the **${taskText}** of any contiguous subarray of size K.\n\n**Input:** Array \`nums\`, Integer \`k\`.\n**Output:** Integer result.`;

        return {
            title: `Fixed Window ${effectiveTask.toUpperCase()} (#${signature.substring(0, 4)})`,
            description: desc,
            difficulty: constraint === "large" ? "Hard" : constraint === "medium" ? "Medium" : "Easy",
            tags: ["Array", "Sliding Window", effectiveTask],
            testCases,
            signature
        };
    }
};
