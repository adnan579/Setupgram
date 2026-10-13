/** @format */

// Small helpers shared across the public site, admin panel and API routes.
// Pure functions only (safe in server and client components).

/** "My Post Title!" -> "my-post-title" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

type DateInput = Date | string;

/** 05 Oct 2026 — used in admin tables */
export function formatDateShort(d: DateInput): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** 5 Oct 2026 — used on public cards */
export function formatDateMedium(d: DateInput): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** 5 October 2026 — used on public detail pages */
export function formatDateLong(d: DateInput): string {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
