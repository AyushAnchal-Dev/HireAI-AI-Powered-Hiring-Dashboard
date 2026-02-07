
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { loadEnvConfig } = require('@next/env');

const LOG_FILE = 'diagnosis.txt';

function log(msg) {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
}

async function diagnose() {
    fs.writeFileSync(LOG_FILE, 'Starting Diagnosis...\n');

    try {
        const projectDir = process.cwd();
        log(`Project Directory: ${projectDir}`);

        // 1. Check Env
        log('--- Environment Check ---');
        const { combinedEnv } = loadEnvConfig(projectDir);
        log(`NODE_ENV: ${process.env.NODE_ENV}`);
        log(`DATABASE_URL present: ${!!combinedEnv.DATABASE_URL}`);
        if (combinedEnv.DATABASE_URL) {
            // Mask the password
            const masked = combinedEnv.DATABASE_URL.replace(/:[^:@]+@/, ':***@');
            log(`DATABASE_URL value: ${masked}`);
        }
        log(`AUTH_SECRET present: ${!!combinedEnv.AUTH_SECRET}`);
        log(`NEXTAUTH_SECRET present: ${!!combinedEnv.NEXTAUTH_SECRET}`);

        // 2. Check Database Connection
        log('\n--- Database Connection Check ---');
        const prisma = new PrismaClient();
        try {
            await prisma.$connect();
            log('Prisma $connect() successful.');
            const count = await prisma.user.count();
            log(`User count in DB: ${count}`);
        } catch (dbErr) {
            log(`FATAL: Database connection failed: ${dbErr.message}`);
            log(`Details: ${JSON.stringify(dbErr, null, 2)}`);
        } finally {
            await prisma.$disconnect();
        }

        // 3. Check Modules
        log('\n--- Module Check ---');
        try {
            require.resolve('next-auth');
            log('next-auth found');
        } catch (e) {
            log('next-auth NOT found');
        }

    } catch (err) {
        log(`FATAL: Diagnostic script crashed: ${err.message}`);
        log(err.stack);
    }
}

diagnose();
