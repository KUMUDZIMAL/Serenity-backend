// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ⚠️ Skips TS errors at build time (not recommended for prod)
  },

  // 1) Proxy /api/* to your standalone backend so cookies are same‑origin
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://serenity-backend-liart.vercel.app/api/:path*',
      },
    ];
  },

  // 2) Inject CORS headers on all /api/* responses
  async headers() {
    return [
      {
        // Match our proxy endpoint
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            // if you ever call your API directly from another origin,
            // you can set this to that origin instead of '*'
            value: 'https://serenity-peach.vercel.app/',
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};

export default nextConfig;
