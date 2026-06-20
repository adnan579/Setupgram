"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Post = {
  _id: string;
  title: string;
  category: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
  updatedAt?: string | null;
};

export default function BlogsTable({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleToggle(id: string, currentStatus: "DRAFT" | "PUBLISHED") {
    setTogglingId(id);
    const next = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: next } : p))
      );
    }
    setTogglingId(null);
    router.refresh();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p._id !== id));
    setDeletingId(null);
    router.refresh();
  }

  function fmt(d: string) {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm cursor-pointer"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
        >
          <option value="ALL" style={{ background: "#0a0a0a" }}>All</option>
          <option value="PUBLISHED" style={{ background: "#0a0a0a" }}>Published</option>
          <option value="DRAFT" style={{ background: "#0a0a0a" }}>Drafts</option>
        </select>
      </div>

      <p className="text-xs text-gray-600">Showing {filtered.length} of {posts.length} posts</p>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center border border-white/5">
          <p className="text-gray-500 mb-4">No posts found.</p>
          <Link href="/admin/blogs/new" className="text-primary text-sm hover:underline">Create your first post →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((post) => (
            <div key={post._id} className="glass-panel rounded-xl border border-white/5 px-5 py-4 flex items-center gap-4">
              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${post.status === "PUBLISHED" ? "bg-green-400" : "bg-yellow-400"}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">{post.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-500">{post.category}</span>
                  <span className="text-gray-700">·</span>
                  <span className="text-xs text-gray-600 font-mono">/blog/{post.slug}</span>
                  <span className="text-gray-700 hidden sm:block">·</span>
                  <span className="text-xs text-gray-600 hidden sm:block">{fmt(post.createdAt)}</span>
                </div>
              </div>

              {/* Status badge */}
              <span className={`text-xs px-2.5 py-1 rounded-full border font-medium flex-shrink-0 hidden sm:block ${
                post.status === "PUBLISHED"
                  ? "text-green-400 bg-green-400/10 border-green-400/20"
                  : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
              }`}>
                {post.status}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Edit */}
                <Link
                  href={`/admin/blogs/${post._id}`}
                  className="p-2 text-gray-500 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>

                {/* Publish toggle */}
                <button
                  onClick={() => handleToggle(post._id, post.status)}
                  disabled={togglingId === post._id}
                  className={`p-2 transition-colors rounded-lg disabled:opacity-40 ${
                    post.status === "PUBLISHED"
                      ? "text-green-400 hover:text-yellow-400 hover:bg-yellow-400/10"
                      : "text-yellow-400 hover:text-green-400 hover:bg-green-400/10"
                  }`}
                  title={post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                >
                  {post.status === "PUBLISHED" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>

                {/* View live (only published) */}
                {post.status === "PUBLISHED" && (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    title="View live"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(post._id, post.title)}
                  disabled={deletingId === post._id}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-40"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
