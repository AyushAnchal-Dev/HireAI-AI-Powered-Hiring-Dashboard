import fetch from 'node-fetch';

const OLLAMA_URL = "http://localhost:11434";
const CRON_URL = "http://localhost:3000/api/cron/daily?secret=MY_SECRET_KEY&force=true";

async function checkOllama() {
    console.log("🔍 Checking Ollama...");
    try {
        // 1. Check if running
        const res = await fetch(OLLAMA_URL);
        if (res.ok) {
            console.log("✅ Ollama is running!");
        } else {
            console.error("❌ Ollama detected but returned error status:", res.status);
            return false;
        }

        // 2. Check for llama3 model
        console.log("🔍 Checking for 'llama3' model...");
        const tagsRes = await fetch(`${OLLAMA_URL}/api/tags`);
        const tagsData = await tagsRes.json();
        const hasModel = tagsData.models.some(m => m.name.includes("llama3"));

        if (hasModel) {
            console.log("✅ Model 'llama3' found!");
            return true;
        } else {
            console.error("❌ Model 'llama3' NOT found. Available models:", tagsData.models.map(m => m.name));
            return false;
        }

    } catch (e) {
        console.error("❌ Ollama is NOT running or not accessible at " + OLLAMA_URL);
        console.error("   Error:", e.message);
        return false;
    }
}

async function triggerCron() {
    console.log("\n🔍 Triggering Daily Cron... (This might take time)");
    try {
        const res = await fetch(CRON_URL);
        const text = await res.text();

        console.log(`Response Status: ${res.status}`);
        try {
            const json = JSON.parse(text);
            console.log("Response Body:", JSON.stringify(json, null, 2));
            if (res.ok && json.success) {
                console.log("✅ Cron Job Success!");
            } else {
                console.log("⚠️ Cron Job returned success=false or error.");
            }
        } catch {
            console.log("Response Text:", text);
        }

    } catch (e) {
        console.error("❌ Failed to trigger Cron:", e.message);
    }
}

async function main() {
    const ollamaOk = await checkOllama();
    if (ollamaOk) {
        await triggerCron();
    } else {
        console.log("\n⚠️ Skipping Cron trigger because AI is offline (Cron would fail or use fallback).");
        console.log("   Please run 'ollama serve' and 'ollama pull llama3' in a separate terminal.");
    }
}

main();
