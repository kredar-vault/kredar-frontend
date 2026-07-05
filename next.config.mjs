/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a self-contained server bundle for a lean Docker image.
  output: 'standalone',
  // Don't fail the container build on lint/type issues (CI already checks these).
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api.staging.kredar.xyz/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
