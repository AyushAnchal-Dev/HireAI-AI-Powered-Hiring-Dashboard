import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import os from "os";

// Helper to execute single test case
const executeCase = async (filePath: string, input: string, timeout: number): Promise<{ output: string; error?: string; runtime: number }> => {
    return new Promise((resolve) => {
        const start = process.hrtime();

        // Escape quotes for command line safety (simplified for MVP)
        // Ideally pass input via a file or stdin to avoid shell limit/injection
        // For MVP: Passing as base64 encoded arg is safer
        const inputB64 = Buffer.from(input).toString('base64');

        exec(`node "${filePath}" "${inputB64}"`, { timeout }, (error, stdout, stderr) => {
            const end = process.hrtime(start);
            const runtime = (end[0] * 1000 + end[1] / 1e6); // ms

            if (error) {
                // Check for timeout
                if (error.signal === 'SIGTERM') {
                    return resolve({ output: "", error: "Time Limit Exceeded", runtime });
                }
                return resolve({ output: "", error: stderr || error.message, runtime });
            }
            resolve({ output: stdout.trim(), runtime });
        });
    });
};

export async function runCodeLocal(code: string, language: string, testCases: any[]) {
    if (language !== 'javascript') {
        throw new Error("Only JavaScript is supported in Local Runner MVP");
    }

    const tmpDir = os.tmpdir();
    const fileName = `solution_${Date.now()}_${Math.floor(Math.random() * 1000)}.js`;
    const filePath = path.join(tmpDir, fileName);

    // Harness: Decodes input, calls 'solution', prints output
    // Note: Implicitly assumes user function is named 'solution' or is an anonymous function assigned to variable?
    // Let's assume standard LeetCode style: "function solution(nums) { ... }"
    const harness = `
// Capture logs
const __logs = [];
const __originalLog = console.log;
console.log = (...args) => {
    __logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
};
// We can also capture error/warn if needed, but keeping it simple for now

// USER CODE START
${code}
// USER CODE END

try {
    const inputRaw = process.argv[2];
    const inputJson = Buffer.from(inputRaw, 'base64').toString('utf-8');
    const input = JSON.parse(inputJson);
    
    // Check if 'solution' exists
    if (typeof solution !== 'function') {
        throw new Error("Function 'solution' not found. Please name your function 'solution'.");
    }
    
    const result = solution(input);
    
    // Output result encapsulated with logs
    // Use __originalLog to ensure it goes to stdout
    __originalLog(JSON.stringify({ result, logs: __logs }));
} catch (e) {
    __originalLog(JSON.stringify({ error: e.message, logs: __logs }));
    process.exit(0); // Exit 0 so we can parse the error JSON
}
`;

    try {
        await fs.writeFile(filePath, harness);

        const results = [];
        for (const tc of testCases) {
            let { output, error, runtime } = await executeCase(filePath, tc.input, 2000); // 2s timeout

            // Parse Output
            let actualOutput: any = "";
            let logs: string[] = [];

            if (error) {
                // Determine if it was TLE or Runtime Error
                // Since we exit(0) on runtime error in harness now, 'error' here means TLE or node crash
                // Unless we handle TLE separately
            } else {
                try {
                    const resJson = JSON.parse(output);
                    if (resJson.error) {
                        error = resJson.error; // Detected Runtime Error
                        logs = resJson.logs || [];
                    } else {
                        actualOutput = resJson.result;
                        // Handle result type matching (stringify to compare with expected)
                        if (typeof actualOutput === 'object') actualOutput = JSON.stringify(actualOutput);
                        else actualOutput = String(actualOutput);

                        logs = resJson.logs || [];
                    }
                } catch (e) {
                    error = "Invalid Output (Non-JSON)";
                    logs = [output]; // Use raw output as log
                }
            }

            // Compare
            const passed = !error && actualOutput === tc.output;

            results.push({
                testCaseId: tc.id || "temp",
                input: tc.input,
                expectedOutput: tc.output,
                actualOutput: error ? `Error: ${error}` : actualOutput,
                logs, // Return captured logs
                passed,
                runtime,
                memory: 10
            });
        }

        return {
            status: results.every(r => r.passed) ? "Accepted" : "Wrong Answer",
            totalTests: results.length,
            passedTests: results.filter(r => r.passed).length,
            results
        };

    } catch (err) {
        console.error("Runner Error:", err);
        throw err;
    } finally {
        // Cleanup
        try { await fs.unlink(filePath); } catch (e) { }
    }
}
