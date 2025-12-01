/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      // Development only - should be removed in production
      ...(process.env.NODE_ENV === 'development' ? [
        {
          protocol: 'http',
          hostname: 'localhost',
        },
      ] : []),
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
};

module.exports = nextConfig;
