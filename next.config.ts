import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles Next.js natively — no need for "export" mode.
  // Pages are statically generated at build via generateStaticParams().

  // Environment variables available at build time
  env: {
    SITE_URL: "https://rentledger.ca",
  },
};

export default nextConfig;
