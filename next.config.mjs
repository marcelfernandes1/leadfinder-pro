/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static page generation for pages using dynamic features
  experimental: {
    // This helps with pages using useSearchParams and other dynamic hooks
    skipMiddlewareUrlNormalize: true,
  },
};

export default nextConfig;
