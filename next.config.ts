import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ["https://ericka-trophied-azucena.ngrok-free.dev", "localhost:3000"],
    },
  },
};

export default nextConfig;
