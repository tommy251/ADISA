import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // <--- ADD THIS LINE HERE
  images: {
    unoptimized: true, // This is perfect for static sites!
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "drive.google.com" },
      { protocol: "https", hostname: "ucUiwmlcxllpkmqxqb.supabase.co" },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;