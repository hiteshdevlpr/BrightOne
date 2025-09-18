import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Image optimization configuration
  images: {
    unoptimized: false,
    domains: ['localhost'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // External packages for server components
  serverExternalPackages: ['pg'],
};

export default nextConfig;
