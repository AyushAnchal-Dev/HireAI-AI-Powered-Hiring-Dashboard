
const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('AUTH_SECRET exists:', !!process.env.AUTH_SECRET);
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
