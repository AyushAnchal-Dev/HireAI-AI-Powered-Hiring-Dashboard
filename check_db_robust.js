const { PrismaClient } = require('@prisma/client');

console.log('Initializing PrismaClient...');
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Connecting...');

    // Set a timeout for the connection
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timed out after 5s')), 5000);
    });

    try {
        const usersPromise = prisma.user.findMany();
        const users = await Promise.race([usersPromise, timeout]);
        console.log('Users found:', users);
    } catch (error) {
        console.error('Error querying users:', error);
    }
}

main()
    .catch((e) => {
        console.error('Main error:', e);
    })
    .finally(async () => {
        console.log('Disconnecting...');
        await prisma.$disconnect();
        console.log('Done.');
    });
