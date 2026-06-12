import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "png.pngtree.com",
      },
      // tambah domain lain kalau nanti butuh, contoh:
      // { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatar
      // { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub avatar
    ],
  },
};

export default nextConfig;