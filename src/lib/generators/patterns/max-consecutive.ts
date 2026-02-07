export function maxConsecutiveGenerator(difficulty: string) {
    const stories = [
        "You are tracking a habit streak on a calendar app.",
        "You are analyzing a binary signal for the longest period of activity.",
        "You are detecting the longest run of winning games for a sports team.",
        "You are finding the maximum contiguous availability in a booking system.",
        "You are measuring the longest period of continuous rainfall.",
        "You are checking a server heartbeat log for the longest uptime streak.",
        "You are identifying the longest sequence of correct answers in a quiz.",
        "You are finding the longest road segment without traffic lights.",
        "You are monitoring a conveyor belt for the longest run of defective items.",
        "You are analyzing DNA sequences for repeated gene markers."
    ];
    const story = stories[Math.floor(Math.random() * stories.length)];

    let size = 10;
    if (difficulty === "Medium") size = 50;
    if (difficulty === "Hard") size = 500;

    const N = Math.floor(Math.random() * size) + 10;

    // Logic: Binary Array (0s and 1s) usually, or any specific target value.
    // Standard Problem: Max Consecutive Ones.

    const generateInput = (len: number) => {
        return Array.from({ length: len }, () => Math.random() > 0.5 ? 1 : 0);
    };

    const solve = (nums: number[]) => {
        let maxCount = 0;
        let currentCount = 0;
        for (let num of nums) {
            if (num === 1) {
                currentCount++;
                maxCount = Math.max(maxCount, currentCount);
            } else {
                currentCount = 0;
            }
        }
        return maxCount;
    };

    const testCases = [];

    // Case 1
    const n1 = generateInput(N);
    testCases.push({
        input: JSON.stringify(n1),
        output: solve(n1).toString(),
        isHidden: false
    });

    // Case 2: Risk of all zeros
    const n2 = new Array(10).fill(0);
    testCases.push({
        input: JSON.stringify(n2),
        output: "0",
        isHidden: true
    });

    const variantId = Math.random().toString(36).substring(7).toUpperCase();

    return {
        title: `Max Streak - ${story.split(' ').slice(2, 4).join(' ')} (#${variantId})`,
        description: `${story}\n\nGiven a binary array, find the maximum number of consecutive 1s in this array.\n\n**Input:** Array of 0s and 1s.\n**Output:** Integer.`,
        difficulty,
        tags: ["Array", "Sliding Window", "Easy"],
        testCases
    };
}
