
import { generateDailyBatch } from "./src/lib/generators/advanced/batch-engine";

console.log("Testing Batch Engine...");
try {
    const questions = generateDailyBatch(5);
    console.log("Generated Count:", questions.length);
    console.log("First Question:", JSON.stringify(questions[0], null, 2));
} catch (e) {
    console.error("Batch Engine Failed:", e);
}
