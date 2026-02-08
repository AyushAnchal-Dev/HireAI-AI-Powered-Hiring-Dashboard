/** @type {import('next').NextConfig} */
// Force restart
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "pdf2json"],
  },
  output: "standalone",
};

module.exports = nextConfig;
