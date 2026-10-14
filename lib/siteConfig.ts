/** @format */

// Single place for the business contact details shown across the site.
//
// Phone, WhatsApp and social links are NOT hard-coded: set them as environment variables
// in Vercel (Project -> Settings -> Environment Variables) and redeploy. Anything left empty
// is simply not shown, so the site never displays a dead or placeholder contact detail.
//
//   NEXT_PUBLIC_CONTACT_PHONE     e.g.  +91 98765 43210
//   NEXT_PUBLIC_WHATSAPP_NUMBER   e.g.  919876543210   (country code + number, digits only)
//   NEXT_PUBLIC_LINKEDIN_URL      e.g.  https://www.linkedin.com/company/setupgram
//   NEXT_PUBLIC_INSTAGRAM_URL
//   NEXT_PUBLIC_X_URL
//   NEXT_PUBLIC_YOUTUBE_URL
//   NEXT_PUBLIC_FACEBOOK_URL
//
// NOTE: each variable must be referenced literally (process.env.NEXT_PUBLIC_...) so Next.js
// can inline it into the browser bundle at build time.

import { safeHttpsUrl } from "./validate";

const clean = (value: string | undefined) => (value ?? "").trim();

const phone = clean(process.env.NEXT_PUBLIC_CONTACT_PHONE);
const whatsapp = clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER).replace(/\D/g, "");

const socialCandidates = [
  { label: "LinkedIn", href: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL) },
  { label: "Instagram", href: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL) },
  { label: "X (Twitter)", href: clean(process.env.NEXT_PUBLIC_X_URL) },
  { label: "YouTube", href: clean(process.env.NEXT_PUBLIC_YOUTUBE_URL) },
  { label: "Facebook", href: clean(process.env.NEXT_PUBLIC_FACEBOOK_URL) },
];

export const siteConfig = {
  name: "SetupGram",
  legalName: "SetupGram Infotech Solutions",
  url: "https://setupgram.com",
  email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL) || "info@setupgram.com",
  /** Display form, e.g. "+91 98765 43210". Empty string when not configured. */
  phone,
  /** tel: link target, e.g. "tel:+919876543210". Empty when no phone is configured. */
  phoneHref: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : "",
  /** Digits only, e.g. "919876543210". Empty when not configured. */
  whatsapp,
  /** Only valid https:// links are kept; anything else is dropped. */
  social: socialCandidates
    .map((s) => ({ label: s.label, href: safeHttpsUrl(s.href) }))
    .filter((s) => s.href !== ""),
};

/** Click-to-chat link, or "" when no WhatsApp number is configured. */
export function whatsappHref(message = "Hi SetupGram, I'd like to discuss a project."): string {
  if (!siteConfig.whatsapp) return "";
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Shown at the top of the Privacy Policy and Terms pages. Update when you change them. */
export const LEGAL_LAST_UPDATED = "14 October 2026";
