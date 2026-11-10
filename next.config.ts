import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Site 100% estático: roda no Firebase Hosting (plano gratuito).
  // Os dados vêm do Firebase direto no navegador (Auth + Firestore).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
