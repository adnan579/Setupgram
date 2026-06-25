/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allows multiple root layouts (admin has its own)
  },
  // FIX: Increase body size limit for Cloudinary image/video uploads
  // Default is 4MB which is too small for blog images
  // Images up to 10MB + base64 overhead (~33%) = need ~14MB
  // Videos up to 50MB + base64 overhead = need ~70MB
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
    responseLimit: false,
  },
};

module.exports = nextConfig;