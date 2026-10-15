const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy
// Every third-party origin the site talks to is listed here, and nothing else is allowed:
//   - Google Tag Manager / Analytics (loaded only after cookie consent, see components/SiteChrome.tsx)
//   - Cloudinary: images/videos served from res.cloudinary.com, direct uploads to api.cloudinary.com
// 'unsafe-inline' is needed because Next.js injects inline bootstrap scripts and the GTM/GA
// snippets are inline; a nonce-based policy would force every page to render dynamically.
// 'unsafe-eval' is only added in development (React refresh needs it).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com",
  "media-src 'self' blob: https://res.cloudinary.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.cloudinary.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://stats.g.doubleclick.net",
  // Blog posts may embed a video player; nothing else may be framed.
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Forces HTTPS for two years (no `preload`, so it can still be rolled back).
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Nobody may embed the site in a frame (clickjacking). Older-browser twin of frame-ancestors.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // NOTE: File uploads go directly from the browser to Cloudinary (signed upload),
  // so there is no server-side body size limit to worry about.
};

module.exports = nextConfig;
