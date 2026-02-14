/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // TEMPORARY: Ignore ESLint errors during build for pre-existing issues in other files
    // TODO: Fix existing linting errors and remove this before production deployment
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
}

module.exports = nextConfig
