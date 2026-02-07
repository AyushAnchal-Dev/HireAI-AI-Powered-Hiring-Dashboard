const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const users = await prisma.user.findMany();
        console.log('Users found:', JSON.stringify(users, null, 2));
    } catch (e) {
        console.error('Error details:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
