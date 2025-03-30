/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // Remove the custom distDir to use Next.js default ".next"
  // distDir: 'dist',
  
  // Environment variables should be set in Vercel dashboard for production
  // These will be used for local development only
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/gf-ev-fms',
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || 'your-secret-key',
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  },
  
  // Keep the onDemandEntries config
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;