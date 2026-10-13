/** @format */

// Small shared helpers for validating and escaping untrusted input.
// Pure functions only (no Node/DB imports) so they are safe in both
// API routes and client components.

/** Escapes text so it can be placed safely inside HTML (element text or attribute values). */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Trims a value, caps its length, and (by default) collapses all whitespace
 * to single spaces. Non-strings become "". Use multiline: true for message bodies.
 */
export function cleanText(
  value: unknown,
  maxLength: number,
  opts: { multiline?: boolean } = {},
): string {
  if (typeof value !== "string") return "";
  const normalized = opts.multiline
    ? value.replace(/\r\n/g, "\n").trim()
    : value.replace(/\s+/g, " ").trim();
  return normalized.slice(0, maxLength);
}

/**
 * Returns a normalized https:// URL, or "" if the value is not a valid https URL.
 * Blocks javascript:, data:, http: and anything that is not parseable.
 * Pass allowedHosts to restrict to specific hostnames.
 */
export function safeHttpsUrl(value: unknown, allowedHosts?: string[]): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return "";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return "";
    if (allowedHosts && !allowedHosts.includes(url.hostname)) return "";
    return url.toString();
  } catch {
    return "";
  }
}

/**
 * Validates a post-login redirect target. Only same-site relative paths are allowed.
 * Rejects absolute URLs ("https://evil.com"), protocol-relative ("//evil.com")
 * and backslash tricks ("/\evil.com").
 */
export function safeRedirectPath(value: string | null | undefined, fallback = "/admin"): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}
