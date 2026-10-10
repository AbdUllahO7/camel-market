import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.Camels.market",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "api.Camels.market",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "Camels.market",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.Camels.market",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
