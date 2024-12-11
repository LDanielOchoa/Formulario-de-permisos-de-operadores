/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, 
        path: false, 
        sqlite3: false, 
      };
    }
    return config;
  },
}

module.exports = nextConfig;
