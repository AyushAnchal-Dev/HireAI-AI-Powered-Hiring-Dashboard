export function twoSumGenerator(difficulty: string) {
    // 1. Stories
    const stories = [
        "You are matching transaction amounts to find a specific target reconciliation total.",
        "You are pairing user weights to balance a two-person elevator system.",
        "You are finding two chemical samples that combine to a precise pH level.",
        "You are identifying two server logs that sum up to a specific error code.",
        "You are looking for two products that fit exactly within a gift card balance.",
        "You are finding two data packets that complete a checksum.",
        "You are matching a buyer and a seller with compatible price points.",
        "You are identifying two locations that are a specific distance apart.",
        "You are pairing two ingredients to achieve a target calorie count.",
        "You are finding two resistors that combine to a target impedance.",
        "You are matching two audio tracks that overlap at a specific timestamp.",
        "You are pairing two drivers to optimize a delivery route duration.",
        "You are finding two stars that have a combined specific magnitude.",
        "You are matching an entry and exit timestamp to calculate duration.",
        "You are identifying two colors that mix to form a target shade."
    ];
    const story = stories[Math.floor(Math.random() * stories.length)];

    // 2. Constraints
    let size = 10;
    if (difficulty === "Medium") size = 50;
    if (difficulty === "Hard") size = 500;

    const N = Math.floor(Math.random() * size) + 5;

    // 3. Logic: Create a valid "Two Sum" scenario
    // We generate an array, pick two indices, sum them -> Target.
    // Guaranteed solvable.

    const generateInput = (len: number) => {
        const arr = Array.from({ length: len }, () => Math.floor(Math.random() * 100) - 50);
        // Sort it for "Two Pointers" optimal solution (O(N)) usually requires sorted,
        // OR unsorted for Hash Map (O(N)).
        // Let's explicitly say "Sorted Array" to force Two Pointers technique?
        // Or keep unsorted and let them use HashMap?
        // Let's do "Sorted" to fit the "Two Pointers" category strictly.
        return arr.sort((a, b) => a - b);
    };

    const solve = (nums: number[], target: number): number[] => {
        let left = 0;
        let right = nums.length - 1;
        while (left < right) {
            const sum = nums[left] + nums[right];
            if (sum === target) return [nums[left], nums[right]]; // Returning values for simplicity in output
            if (sum < target) left++;
            else right--;
        }
        return [];
    };

    // 4. Generate Test Cases
    const testCases = [];

    // Case 1: Random Solvable
    const nums1 = generateInput(N);
    // Ensure solution exists
    const idx1 = Math.floor(Math.random() * (N / 2));
    const idx2 = N - 1 - Math.floor(Math.random() * (N / 2));
    // Check overlap
    const finalIdx2 = idx1 === idx2 ? idx2 + 1 : idx2;
    // Actually, simple way: pick two distinct
    const i1 = 0, i2 = N - 1;
    // Force a target from real values
    const target1 = nums1[i1] + nums1[i2];

    testCases.push({
        input: JSON.stringify({ nums: nums1, target: target1 }),
        output: JSON.stringify([nums1[i1], nums1[i2]]), // Expect values
        isHidden: false
    });

    // Case 2: Negative Numbers
    const nums2 = generateInput(10).map(x => x - 20); // shift negative
    nums2.sort((a, b) => a - b);
    const target2 = nums2[2] + nums2[4];
    testCases.push({
        input: JSON.stringify({ nums: nums2, target: target2 }),
        output: JSON.stringify([nums2[2], nums2[4]]),
        isHidden: true
    });

    // Description
    const description = `${story}\n\nGiven a **sorted** array of integers, find two numbers such that they add up to a specific target number.\n\nReturn the two numbers as an array (order doesn't matter).\n\n**Input:** \n- \`nums\`: Sorted integer array\n- \`target\`: Integer\n**Output:** Array [val1, val2]\n\n**Constraints:**\n- 2 <= nums.length <= ${size + 20}\n- Guaranteed one solution exists.`;

    const variantId = Math.random().toString(36).substring(7).toUpperCase();

    return {
        title: `Pair Sum Target - ${story.split(' ').slice(2, 4).join(' ')} (#${variantId})`,
        description,
        difficulty,
        tags: ["Array", "Two Pointers", "Sorted"],
        testCases
    };
}
