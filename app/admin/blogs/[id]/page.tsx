/** @format */

import { getDb } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogEditor from "../../../../components/admin/BlogEditor";

export const metadata: Metadata = { title: "Edit Post" };
export const dynamic = "force-dynamic";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  let post;
  try {
    const db = await getDb();
    post = await db.collection("blogs").findOne({ _id: new ObjectId(params.id) });
  } catch {
    notFound();
  }

  if (!post) notFound();

  const serialized = {
    _id: post._id.toString(),
    title: post.title || "",
    category: post.category || "General",
    excerpt: post.excerpt || "",
    content: post.content || "",
    slug: post.slug || "",
    status: (post.status as "DRAFT" | "PUBLISHED") || "DRAFT",
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
    metaKeywords: post.metaKeywords || "",
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">Edit Post</h1>
        <p className="text-gray-500 mt-1 text-sm truncate">"{post.title}"</p>
      </div>
      <BlogEditor initial={serialized} />
    </div>
  );
}
