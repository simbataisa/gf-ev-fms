/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    MONGODB_URI: 'mongodb://localhost:27017/ev-management',
    PAYLOAD_SECRET: 'your-secret-key',
    NEXT_PUBLIC_SERVER_URL: 'http://localhost:3001', // Updated port
  },
  // Explicitly set the output directory
  distDir: 'dist',
  // Disable file system watching for specific directories if needed
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;