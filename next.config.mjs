/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  //Below is the code for build optimazatio
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
   images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Remove console logs in production
  },
  eslint: {
    ignoreDuringBuilds: true, // Prevent ESLint errors from breaking the production build
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true, // true means it's a permanent redirect (301)
      },
    ];
  },
};

export default nextConfig;
