import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        // TODO: move to .env
        destination: "http://localhost:4000/api/:path*", // Proxy to Backend
      },
    ];
  }
};

export default nextConfig;
