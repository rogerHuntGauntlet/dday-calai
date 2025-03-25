import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    // These are necessary for react-webcam to work properly
    config.resolve.fallback = { 
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
};

export default nextConfig;
