/** @format */

// Helpers for serving Cloudinary images at the size actually needed.
// Cloudinary does the resizing + format conversion (f_auto picks WebP/AVIF per
// browser, q_auto picks the quality) and serves the result from its CDN.
// Pure functions only (safe in server and client components).

const IMAGE_UPLOAD = "/image/upload/";

function isCloudinaryImage(src: string) {
  return src.startsWith("https://res.cloudinary.com/") && src.includes(IMAGE_UPLOAD);
}

/** Returns a resized/optimized URL for a Cloudinary image. Any other URL is returned unchanged. */
export function cloudinaryUrl(
  src: string,
  width: number,
  quality: number | "auto" = "auto",
): string {
  if (!src || !isCloudinaryImage(src)) return src;
  const index = src.indexOf(IMAGE_UPLOAD) + IMAGE_UPLOAD.length;
  // c_limit = only ever shrink, never upscale
  return `${src.slice(0, index)}f_auto,q_${quality},w_${Math.round(width)},c_limit/${src.slice(index)}`;
}

/**
 * Rewrites every <img src="https://res.cloudinary.com/.../image/upload/..."> inside
 * stored blog/job HTML so full-size originals (often several MB) are served resized.
 */
export function optimizeCloudinaryHtml(html: string, width = 1200): string {
  if (!html) return html;
  return html.replace(
    /(\bsrc=["'])(https:\/\/res\.cloudinary\.com\/[^"']*?\/image\/upload\/)([^"']*)/g,
    (_match, prefix: string, base: string, rest: string) =>
      `${prefix}${base}f_auto,q_auto,w_${width},c_limit/${rest}`,
  );
}
