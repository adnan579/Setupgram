/** @format */
import { MetadataRoute } from "next";
import { getDb } from "../lib/mongodb";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://setupgram.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/career`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    const db = await getDb();

    const posts = await db
      .collection("blogs")
      .find({ status: "PUBLISHED" }, { projection: { slug: 1, updatedAt: 1 } })
      .toArray();
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    const jobs = await db
      .collection("jobs")
      .find({ status: "OPEN" }, { projection: { slug: 1, updatedAt: 1 } })
      .toArray();
    const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${base}/career/jobs/${job.slug}`,
      lastModified: job.updatedAt ? new Date(job.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...blogRoutes, ...jobRoutes];
  } catch {
    return staticRoutes;
  }
}
