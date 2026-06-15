import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    serverActions:{
      bodySizeLimit:"100MB"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
      {
        protocol:"https",
        hostname:"lottie.host"
      },
      {
        protocol:"https",
        hostname:"cdn-icons-png.flaticon.com"
      },
      {
        protocol:"https",
        hostname:"sgp.cloud.appwrite.io"
      }
      // tambah domain lain kalau nanti butuh, contoh:
      // { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatar
      // { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub avatar
    ],
  },
};

export default nextConfig;