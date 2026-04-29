import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Mocks: fotos de Unsplash usadas hasta tener Storage propio
      { protocol: "https", hostname: "images.unsplash.com" },
      // Supabase Storage del proyecto atrio (se completa el host real cuando creemos el proyecto)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
