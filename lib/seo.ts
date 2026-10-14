/** @format */

import { siteConfig } from "./siteConfig";

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Schema.org Organization for SetupGram (only includes contact details that are configured). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.png"),
    email: siteConfig.email,
    ...(siteConfig.phone && { telephone: siteConfig.phone }),
    ...(siteConfig.social.length > 0 && { sameAs: siteConfig.social.map((s) => s.href) }),
    areaServed: "Worldwide",
    address: { "@type": "PostalAddress", addressCountry: "IN" },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteConfig.url,
    name: siteConfig.legalName,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: "en",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Default share image. A page that sets its own `openGraph` object replaces the site-wide one,
 * so each such page lists this image explicitly (the image itself is app/opengraph-image.tsx).
 */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "SetupGram Infotech Solutions",
};
