import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname)
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com'
      },
      {
        protocol: 'https',
        hostname: 'thesvg.org'
      }
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/admin',
          destination: '/dashboard/overview'
        },
        {
          source: '/admin/:path*',
          destination: '/dashboard/:path*'
        }
      ]
    };
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/admin',
        permanent: false
      },
      {
        source: '/dashboard/:path*',
        destination: '/admin/:path*',
        permanent: false
      }
    ];
  }
};

export default nextConfig;
