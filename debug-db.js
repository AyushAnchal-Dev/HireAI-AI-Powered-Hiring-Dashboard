require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('Testing DB connection...');
const url = process.env.DATABASE_URL;
if (!url) {
    console.error('DATABASE_URL is missing!');
    process.exit(1);
}
console.log('DATABASE_URL length:', url.length);
console.log('DATABASE_URL host:', url.split('@')[1].split('/')[0]);

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    try {
        console.log('Connecting...');
        await prisma.$connect();
        console.log('Connected!');
        const users = await prisma.user.findMany({ take: 1 });
        console.log('Query success. Users found:', users.length);
    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
