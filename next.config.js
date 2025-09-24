const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   appDir: true,
  // },
  images: {
    domains: [
      'world.openfoodfacts.org',
      'images.openfoodfacts.org',
      'static.openfoodfacts.org'
    ],
  },
  // Performance optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  async rewrites() {
    return [
      {
        source: '/api/food/:path*',
        destination: 'https://world.openfoodfacts.org/api/v0/:path*',
      },
      {
        source: '/api/foodb/:path*',
        destination: 'https://foodb.ca/api/v1/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
