import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "https://preview-chat-c12b1c52-555c-4bf1-8d38-fda8735ae2c7.space-z.ai",
  ],
};

export default nextConfig;
