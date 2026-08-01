import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   // Bundles the server and only the node_modules it actually uses into
   // .next/standalone, so the droplet runs the app without an npm install.
   output: "standalone",
   images: {
        unoptimized: true,
    }
};

export default nextConfig;
