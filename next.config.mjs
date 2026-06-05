
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'react-markdown',
      '@google/genai',
      'framer-motion',
    ],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
