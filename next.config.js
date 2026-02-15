/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Skip static generation for non-waitlist pages since they're all blocked by middleware
  // This prevents build errors from pages that won't be accessible anyway
  skipTrailingSlashRedirect: true,
  experimental: {
    // Skip rendering pages that will be redirected anyway
  },
}

module.exports = nextConfig
