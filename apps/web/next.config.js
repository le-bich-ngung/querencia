/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── TypeScript ────────────────────────────────────────────────
  typescript: {
    // Type check vẫn chạy được local, chỉ bỏ qua khi build trên Vercel
    ignoreBuildErrors: true,
  },

  // ── Compiler options ─────────────────────────────────────────
  compiler: {
    // Xóa console.log trong production
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ── Security headers ─────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',   value: 'nosniff' },
          { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',       value: 'camera=(), microphone=(), geolocation=()' },
          // Không expose Next.js version
          { key: 'X-Powered-By',             value: '' },
        ],
      },
    ];
  },

  // ── API rewrites → Fly.io ─────────────────────────────────────
  async rewrites() {
    const API_URL = process.env.API_SERVICE_URL ?? 'http://localhost:3001';
    const AI_URL  = process.env.AI_SERVICE_URL  ?? 'http://localhost:8000';
    return [
      { source: '/api/v1/:path*', destination: `${API_URL}/api/v1/:path*` },
      { source: '/ai/:path*',     destination: `${AI_URL}/:path*` },
    ];
  },

  // ── Image domains ─────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'files.querencia.com.vn' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
    ],
  },

  // ── Bundle analyzer (chỉ khi ANALYZE=true) ───────────────────
  ...(process.env.ANALYZE === 'true' && {
    // pnpm add @next/bundle-analyzer
  }),

  // ── Tắt powered by header ─────────────────────────────────────
  poweredByHeader: false,

  // ── Strict mode ──────────────────────────────────────────────
  reactStrictMode: true,
};

module.exports = nextConfig;
