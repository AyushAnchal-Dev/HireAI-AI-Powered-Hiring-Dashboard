
import { AtomicGenerator, Variant, GeneratedQuestion, TestCaseData } from "./types";
import { generateSignature, getRandomStory } from "./utils";

export const twoPointersGenerator: AtomicGenerator = {
    id: "two_pointers_atomic",
    generate: (variant: Variant): GeneratedQuestion => {
        // 1. Unpack Variant
        const { task, constraint, shape } = variant;
        const isSorted = shape === "sorted"; // Two pointers often needs sorted

        // 2. Story Injection
        const story = getRandomStory();

        // 3. Constraints
        let size = 10;
        if (constraint === "medium") size = 100;
        if (constraint === "large") size = 1000;

        // 4. Input Generation
        let nums = Array.from({ length: size }, () => Math.floor(Math.random() * 200) - 100);
        if (isSorted) {
            nums.sort((a, b) => a - b);
        }

        // 5. Logic: Pair Sum or Container (Task based)
        // Task Mappings:
        // "exists" -> Two Sum (boolean)
        // "index" -> Two Sum (indices)
        // "max" -> Container With Most Water (if simplified) or Max Pair Sum < K

        let logicName = "Pair Sum";
        let target = 0;
        let output = "";

        if (task === "max") {
            // Max Pair Sum less than Target K
            logicName = "Max Pair Sum < K";
            target = nums[0] + nums[nums.length - 1] + 10; // offset
            nums.sort((a, b) => a - b); // Enforce sorted for this logic

            let l = 0, r = nums.length - 1;
            let maxSum = -Infinity;
            while (l < r) {
                const s = nums[l] + nums[r];
                if (s < target) {
                    maxSum = Math.max(maxSum, s);
                    l++;
                } else {
                    r--;
                }
            }
            output = maxSum.toString();
        } else {
            // Standard Two Sum Exists
            logicName = "Pair Sum Target";
            // Create guaranteed answer
            const idx1 = 0;
            const idx2 = nums.length - 1;
            target = nums[idx1] + nums[idx2];

            if (task === "index") {
                output = isSorted ? `[${idx1}, ${idx2}]` : "Indices depend on sort"; // Fallback
            } else {
                output = "true";
            }
        }

        // 6. Test Cases
        const testCases: TestCaseData[] = [
            {
                input: JSON.stringify({ nums, target }),
                output: output,
                isHidden: false
            }
        ];

        // 7. Signature
        const signature = generateSignature("two_pointers_atomic", variant);

        // 8. Description
        const desc = `${story}\n\nTerm: **${logicName}**.\nShape: ${isSorted ? "Sorted" : "Unsorted"}.\nGoal: ${task}.\n\n**Input:** \`nums\`, \`target\`.\n**Output:** Result.`;

        return {
            title: `Two Pointers ${task.toUpperCase()} (#${signature.substring(0, 4)})`,
            description: desc,
            difficulty: constraint === "large" ? "Hard" : "Easy",
            tags: ["Array", "Two Pointers", logicName],
            testCases,
            signature
        };
    }
};
