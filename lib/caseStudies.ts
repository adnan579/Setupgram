/** @format */

// Case studies for the /work section. Intentionally EMPTY.
//
// Add a case study only when it is real and the client has agreed to be shown, and only state
// results you can document. Until at least one entry exists, /work is hidden from the navigation,
// the sitemap and search engines.
//
// To add one, uncomment and edit the example below. Put images in /public/work/.

export type CaseStudy = {
  slug: string;
  title: string;
  client: string;
  /** Slugs from lib/services.ts, e.g. ["app-development"] */
  services: string[];
  summary: string;
  challenge: string;
  solution: string;
  /** Only results you can prove, e.g. "Launched in 8 weeks" */
  results: string[];
  image?: string;
  imageAlt?: string;
  year?: string;
  link?: string;
};

export const caseStudies: CaseStudy[] = [
  // {
  //   slug: "example-client-app",
  //   title: "Booking app for Example Co.",
  //   client: "Example Co.",
  //   services: ["app-development"],
  //   summary: "One-sentence summary.",
  //   challenge: "What the client needed.",
  //   solution: "What we built.",
  //   results: ["A real, provable result"],
  //   image: "/work/example.jpg",
  //   imageAlt: "Screenshot of the booking app",
  //   year: "2026",
  // },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}
