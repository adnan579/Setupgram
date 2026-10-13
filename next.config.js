/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework in the X-Powered-By header.
  poweredByHeader: false,
  images: {
    // All content images live on Cloudinary, which resizes and converts them on its
    // own CDN (see lib/cloudinaryLoader.ts). This avoids Vercel image-optimization limits.
    loader: "custom",
    loaderFile: "./lib/cloudinaryLoader.ts",
  },
  // NOTE: File uploads go directly from the browser to Cloudinary (signed upload),
  // so there is no server-side body size limit to worry about.
};

module.exports = nextConfig;
