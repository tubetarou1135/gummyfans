import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'gummyfans.vercel.app' }],
        destination: 'https://www.gummyfans.jp/:path*',
        permanent: true,
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'thumbnail.image.rakuten.co.jp' },
      { protocol: 'https', hostname: '*.image.rakuten.co.jp' },
      { protocol: 'https', hostname: 'hupatepgpagxsukkajrp.supabase.co' },
    ],
  },
};

export default nextConfig;
