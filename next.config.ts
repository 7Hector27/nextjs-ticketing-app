import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com", // ✅ match any bucket in AWS S3
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com", // ✅ match regional buckets like s3.us-east-1.amazonaws.com
      },
    ],
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
