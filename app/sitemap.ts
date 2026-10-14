/** @format */
import { MetadataRoute } from "next";
import { getDb } from "../lib/mongodb";
import { LEGAL_LAST_UPDATED, siteConfig } from "../lib/siteConfig";
import { services } from "../lib/services";
import { caseStudies } from "../lib/caseStudies";
import { slugify } from "../lib/utils";

// Without this the sitemap is generated once at build time and new posts/jobs never appear in it.
export const revalidate = 3600;

// Fixed "last modified" dates for pages whose content lives in the code, so search engines
// are not told every page changed on every crawl. Bump a date when you meaningfully edit that page.
const LAST_EDITED = {
  home: "2026-10-14",
  about: "2026-10-14",
  contact: "2026-10-14",
  career: "2026-10-14",
  services: "2026-10-14",
  blog: "2026-10-14",
  work: "2026-10-14",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(LAST_EDITED.home), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/services`, lastModified: new Date(LAST_EDITED.services), changeFrequency: "monthly", priority: 0.9 },
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: new Date(LAST_EDITED.services),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${base}/blog`, lastModified: new Date(LAST_EDITED.blog), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(LAST_EDITED.about), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: new Date(LAST_EDITED.contact), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/career`, lastModified: new Date(LAST_EDITED.career), changeFrequency: "weekly", priority: 0.7 },
    // /work only appears once there is at least one real case study
    ...(caseStudies.length > 0
      ? [
          { url: `${base}/work`, lastModified: new Date(LAST_EDITED.work), changeFrequency: "monthly" as const, priority: 0.8 },
          ...caseStudies.map((c) => ({
            url: `${base}/work/${c.slug}`,
            lastModified: new Date(LAST_EDITED.work),
            changeFrequency: "yearly" as const,
            priority: 0.6,
          })),
        ]
      : []),
    { url: `${base}/privacy`, lastModified: new Date(LEGAL_LAST_UPDATED), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(LEGAL_LAST_UPDATED), changeFrequency: "yearly", priority: 0.3 },
  ];

  try {
    const db = await getDb();

    const posts = await db
      .collection("blogs")
      .find({ status: "PUBLISHED" }, { projection: { slug: 1, category: 1, createdAt: 1, updatedAt: 1 } })
      .toArray();
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt || LAST_EDITED.blog),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // One page per category that has posts
    const categories = Array.from(
      new Set(posts.map((p) => (typeof p.category === "string" ? slugify(p.category) : "")).filter(Boolean)),
    );
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((slug) => ({
      url: `${base}/blog/category/${slug}`,
      lastModified: new Date(LAST_EDITED.blog),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    const jobs = await db
      .collection("jobs")
      .find({ status: "OPEN" }, { projection: { slug: 1, createdAt: 1, updatedAt: 1 } })
      .toArray();
    const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${base}/career/jobs/${job.slug}`,
      lastModified: new Date(job.updatedAt || job.createdAt || LAST_EDITED.career),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes, ...categoryRoutes, ...jobRoutes];
  } catch {
    return staticRoutes;
  }
}
