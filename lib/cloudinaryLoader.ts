/** @format */

// Custom next/image loader (wired up in next.config.js).
// Instead of Vercel's image optimizer, images are resized by Cloudinary's CDN.
import { cloudinaryUrl } from "./cloudinary";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  return cloudinaryUrl(src, width, quality ?? "auto");
}
