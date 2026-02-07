
const http = require('http');

function check(path) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:3000${path}`, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                console.log(`[${path}] Status: ${res.statusCode}`);
                console.log(`[${path}] Body: ${data.substring(0, 100)}...`);
                resolve();
            });
        });
        req.on('error', e => {
            console.error(`[${path}] Error: ${e.message}`);
            resolve();
        });
    });
}

async function main() {
    await check('/api/health'); // Check if server is up
    await check('/api/auth/providers'); // Check if auth is broken
}

main();
