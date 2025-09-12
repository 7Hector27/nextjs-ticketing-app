import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
  },
};

export default nextConfig;
