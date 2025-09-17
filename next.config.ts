import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      path: require.resolve("path-browserify"),
    };
    return config;
  },
};

export default nextConfig;
