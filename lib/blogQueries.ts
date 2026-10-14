/** @format */

import { cache } from "react";
import { getDb } from "./mongodb";
import { slugify } from "./utils";

export const POSTS_PER_PAGE = 9;

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverImage: string;
  createdAt: string;
};

export type CategoryInfo = { name: string; slug: string; count: number };

const toIso = (d: unknown) => (d instanceof Date ? d.toISOString() : String(d ?? ""));

/** All categories that have at least one published post, most posts first. */
export const getCategories = cache(async (): Promise<CategoryInfo[]> => {
  const db = await getDb();
  const rows = await db
    .collection("blogs")
    .aggregate<{ _id: string; count: number }>([
      { $match: { status: "PUBLISHED" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
    ])
    .toArray();
  return rows
    .filter((r) => typeof r._id === "string" && r._id.trim() !== "")
    .map((r) => ({ name: r._id, slug: slugify(r._id), count: r.count }));
});

export type BlogPage = {
  posts: PostCard[];
  total: number;
  totalPages: number;
  categories: CategoryInfo[];
  category: CategoryInfo | null;
};

/** One page of published posts, newest first, optionally limited to a category slug. */
export async function getBlogPage(page: number, categorySlug?: string): Promise<BlogPage> {
  const db = await getDb();
  const categories = await getCategories();
  const category = categorySlug ? (categories.find((c) => c.slug === categorySlug) ?? null) : null;

  const filter: Record<string, unknown> = { status: "PUBLISHED" };
  if (category) filter.category = category.name;

  const col = db.collection("blogs");
  const total = await col.countDocuments(filter);
  const raw = await col
    .find(filter, { projection: { content: 0 } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * POSTS_PER_PAGE)
    .limit(POSTS_PER_PAGE)
    .toArray();

  return {
    posts: raw.map((p) => ({
      _id: p._id.toString(),
      title: p.title ?? "",
      slug: p.slug ?? "",
      category: p.category ?? "",
      excerpt: p.excerpt ?? "",
      coverImage: p.coverImage ?? "",
      createdAt: toIso(p.createdAt),
    })),
    total,
    totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)),
    categories,
    category,
  };
}

/** Related posts: same category first, then the newest others to fill the list. */
export async function getRelatedPosts(slug: string, category: string, limit = 2): Promise<PostCard[]> {
  const db = await getDb();
  const col = db.collection("blogs");
  const projection = { title: 1, slug: 1, category: 1, coverImage: 1, excerpt: 1, createdAt: 1 };

  const same = await col
    .find({ status: "PUBLISHED", slug: { $ne: slug }, category }, { projection })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  let rows = same;
  if (rows.length < limit) {
    const have = rows.map((r) => r.slug as string);
    const more = await col
      .find({ status: "PUBLISHED", slug: { $nin: [slug, ...have] } }, { projection })
      .sort({ createdAt: -1 })
      .limit(limit - rows.length)
      .toArray();
    rows = [...rows, ...more];
  }
  return rows.map((p) => ({
    _id: p._id.toString(),
    title: p.title ?? "",
    slug: p.slug ?? "",
    category: p.category ?? "",
    excerpt: p.excerpt ?? "",
    coverImage: p.coverImage ?? "",
    createdAt: toIso(p.createdAt),
  }));
}
