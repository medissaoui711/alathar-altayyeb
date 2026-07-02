/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-markdown', '@google/genai', 'framer-motion'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  allowedDevOrigins: [
    'ais-dev-i2rqjah5yrl4eu7pxysaso-7744164901.europe-west2.run.app',
    'ais-pre-i2rqjah5yrl4eu7pxysaso-7744164901.europe-west2.run.app'
  ],
};

export default nextConfig;