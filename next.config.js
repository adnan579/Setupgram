/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allows multiple root layouts (admin has its own)
  },
  // NOTE: api.bodyParser here is Pages Router config ONLY — ignored in App Router.
  // File uploads now go directly from the browser to Cloudinary (signed upload).
  // This means there is NO server-side body size limit to worry about.
};

module.exports = nextConfig;