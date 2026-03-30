import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/writting",
        destination: "/writing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
