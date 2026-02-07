export function arraySumGenerator(difficulty: string) {
    // 1. Stories
    const stories = [
        "You are analyzing historical stock prices to find the maximum profit period.",
        "You are tracking server request loads to identify the busiest time window.",
        "You are monitoring sensor data spikes in a factory pipeline.",
        "You are analyzing viewer engagement rates over a video stream.",
        "You are calculating the peak energy consumption interval for a smart grid.",
        "You are finding the most profitable segment of a sales timeline.",
        "You are identifying the highest density of traffic flow on a highway.",
        "You are scanning a DNA sequence for the most active gene expression region.",
        "You are measuring the intensity of a sound wave signal.",
        "You are tracking the altitude gain over a mountain hiking trail.",
        "You are analyzing the net cash flow of a startup over random months.",
        "You are monitoring heart rate variability during a workout session.",
        "You are tracking the speed of a formula one car through a sector.",
        "You are finding the hottest period of the day from temperature sensors.",
        "You are analyzing the memory usage of a process over time."
    ];
    const story = stories[Math.floor(Math.random() * stories.length)];

    // 2. Constraints & Logic based on Difficulty
    let nMin = 5, nMax = 20;
    if (difficulty === "Medium") { nMin = 20; nMax = 100; }
    if (difficulty === "Hard") { nMin = 100; nMax = 1000; }

    const N = Math.floor(Math.random() * (nMax - nMin + 1)) + nMin;

    // Task: Find Maximum Subarray Sum (Kadane's)
    const title = "Maximum Subarray Sum";
    const description = `${story}\n\nGiven an array of integers representing data points, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\n**Input:** An array of N integers.\n**Output:** A single integer representing the maximum sum.`;

    // 3. Helper: Solver (The "Official Solution")
    const solve = (arr: number[]) => {
        let maxSoFar = arr[0];
        let maxEndingHere = arr[0];
        for (let i = 1; i < arr.length; i++) {
            maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
            maxSoFar = Math.max(maxSoFar, maxEndingHere);
        }
        return maxSoFar;
    };

    // 4. Helper: Input Generator
    const generateInput = (size: number) => {
        return Array.from({ length: size }, () => Math.floor(Math.random() * 20) - 10); // -10 to 10
    };

    // 5. Generate Test Cases
    const testCases = [];

    // Case 1: Random Logic
    const input1 = generateInput(N);
    testCases.push({
        input: JSON.stringify(input1),
        output: solve(input1).toString(),
        isHidden: false
    });

    // Case 2: Edge Case (All negative)
    const input2 = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5) - 10);
    testCases.push({
        input: JSON.stringify(input2),
        output: solve(input2).toString(),
        isHidden: true
    });

    // Case 3: Large Case (Simulation)
    const input3 = generateInput(Math.min(N * 2, 2000)); // Cap for safety in this mock
    testCases.push({
        input: JSON.stringify(input3),
        output: solve(input3).toString(),
        isHidden: true
    });

    // Generate a short ID for uniqueness
    const variantId = Math.random().toString(36).substring(7).toUpperCase();

    return {
        title: `${title} - ${story.split(' ').slice(2, 4).join(' ')} (#${variantId})`, // Unique Title
        description,
        difficulty,
        tags: ["Array", "Kadane's Algorithm"],
        testCases
    };
}
