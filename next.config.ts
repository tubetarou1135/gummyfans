import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thumbnail.image.rakuten.co.jp' },
      { protocol: 'https', hostname: '*.image.rakuten.co.jp' },
      { protocol: 'https', hostname: 'hupatepgpagxsukkajrp.supabase.co' },
    ],
  },
};

export default nextConfig;
