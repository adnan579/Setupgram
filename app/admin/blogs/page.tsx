/** @format */

import { getDb } from "../../../lib/mongodb";
import type { Metadata } from "next";
import Link from "next/link";
import BlogsTable from "./BlogsTable";

export const metadata: Metadata = { title: "Blog Posts" };
export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const db = await getDb();
  const posts = await db
    .collection("blogs")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = posts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : (p.updatedAt || null),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Blog Posts</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {serialized.filter((p) => p.status === "PUBLISHED").length} published ·{" "}
            {serialized.filter((p) => p.status === "DRAFT").length} drafts
          </p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-dark font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Post
        </Link>
      </div>
      <BlogsTable posts={serialized} />
    </div>
  );
}
