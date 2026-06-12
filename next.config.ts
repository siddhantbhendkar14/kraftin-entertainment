import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'kraftinentertainment.com' }],
        destination: 'https://www.kraftinentertainment.com/:path*',
        statusCode: 301
      }
    ];
  }
};

export default nextConfig;
