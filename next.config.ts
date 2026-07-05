import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/admin",
          destination: "/dashboard/overview",
        },
        {
          source: "/admin/:path*",
          destination: "/dashboard/:path*",
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/dashboard/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
