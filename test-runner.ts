
import { runCodeLocal } from "./src/lib/execution/runner";

const code = `
function solution(nums) {
    console.log("Debug: input size", nums.length);
    console.log({ msg: "Complex object", val: 123 });
    return nums.reduce((a,b) => a+b, 0);
}
`;

const testCases = [
    { input: JSON.stringify([1, 2, 3]), output: "6", id: "1" }
];

async function test() {
    try {
        const res = await runCodeLocal(code, "javascript", testCases);
        console.log("Runner Result:", JSON.stringify(res, null, 2));
    } catch (e) {
        console.error(e);
    }
}
test();
