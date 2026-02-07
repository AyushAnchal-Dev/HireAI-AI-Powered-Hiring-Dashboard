import { prisma } from "../src/lib/prisma";

async function main() {
    console.log("Checking Prisma Client...");

    if (!prisma) {
        console.error("Prisma instance is null/undefined");
        return;
    }

    if (!prisma.questionPack) {
        console.error("ERROR: prisma.questionPack is UNDEFINED. Client is stale.");
        console.log("Available keys on prisma:", Object.keys(prisma));
    } else {
        console.log("SUCCESS: prisma.questionPack exists.");
        try {
            const packs = await prisma.questionPack.findMany({ take: 1 });
            console.log("DB Connection OK. Packs found:", packs.length);
        } catch (e) {
            console.error("DB Query Failed:", e);
        }
    }
}

main();
