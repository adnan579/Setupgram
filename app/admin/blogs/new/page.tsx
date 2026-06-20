/** @format */

import type { Metadata } from "next";
import BlogEditor from "../../../../components/admin/BlogEditor";

export const metadata: Metadata = { title: "New Post" };

export default function NewBlogPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">
          New Blog Post
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Write, preview, and publish a new article.
        </p>
      </div>
      <BlogEditor />
    </div>
  );
}
