"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import MediaUploader, { UploadedMedia } from "./MediaUploader";

type BlogPost = {
  _id?: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED";
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

const CATEGORIES = [
  "Technology & AI",
  "Marketing",
  "Development",
  "Business Consulting",
  "CRM",
  "Advertising",
  "Case Study",
  "General",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogEditor({ initial }: { initial?: BlogPost }) {
  const router = useRouter();
  const isEdit = !!initial?._id;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<BlogPost>(
    initial || {
      title: "",
      category: "Technology & AI",
      excerpt: "",
      content: "",
      slug: "",
      status: "DRAFT",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    }
  );

  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "media" | "seo">("content");
  const [showMediaPanel, setShowMediaPanel] = useState(false);
  const [mediaInsertTarget, setMediaInsertTarget] = useState<"content" | "cover">("content");

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManual && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugManual]);

  function set(field: keyof BlogPost, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Insert HTML at cursor position in the content textarea
  const insertAtCursor = useCallback((html: string) => {
    const el = textareaRef.current;
    if (!el) {
      setForm((f) => ({ ...f, content: f.content + "\n" + html }));
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    const updated = before + "\n" + html + "\n" + after;
    setForm((f) => ({ ...f, content: updated }));
    // Restore cursor after inserted content
    setTimeout(() => {
      el.focus();
      const pos = start + html.length + 2;
      el.setSelectionRange(pos, pos);
    }, 0);
  }, [form.content]);

  // Called when admin picks media from the uploader panel
  const handleMediaInsert = useCallback((media: UploadedMedia) => {
    if (mediaInsertTarget === "cover") {
      set("coverImage", media.url);
      setShowMediaPanel(false);
      return;
    }
    // Insert into content
    if (media.type === "video") {
      insertAtCursor(
        `<video controls style="width:100%;max-width:800px;border-radius:8px;margin:1rem 0">\n  <source src="${media.url}" type="video/${media.format || "mp4"}">\n  Your browser does not support the video tag.\n</video>`
      );
    } else {
      insertAtCursor(
        `<img src="${media.url}" alt="" style="width:100%;max-width:800px;border-radius:8px;margin:1rem 0" loading="lazy" />`
      );
    }
    setShowMediaPanel(false);
  }, [mediaInsertTarget, insertAtCursor]);

  // Quick-insert toolbar buttons
  function insertTag(tag: string, attrs = "") {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = form.content.substring(start, end);
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    const html = selected
      ? `<${tag}${attrs}>${selected}</${tag}>`
      : `<${tag}${attrs}></${tag}>`;
    const updated = before + html + after;
    setForm((f) => ({ ...f, content: updated }));
    setTimeout(() => {
      el.focus();
      const pos = start + html.length - (selected ? 0 : tag.length + 3);
      el.setSelectionRange(pos, pos);
    }, 0);
  }

  function insertBlock(html: string) {
    insertAtCursor(html);
  }

  async function handleSave(status: "DRAFT" | "PUBLISHED") {
    setError("");
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.slug.trim()) { setError("Slug is required."); return; }
    if (!form.content.trim()) { setError("Content is required."); return; }

    setSaving(true);
    try {
      const payload = { ...form, status };
      const url = isEdit ? `/api/admin/blogs/${initial!._id}` : "/api/admin/blogs";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Something went wrong."); return; }
      router.push("/admin/blogs");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const wordCount = form.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const TABS = [
    { id: "content" as const, label: "Content" },
    { id: "media" as const, label: "Media" },
    { id: "seo" as const, label: "SEO" },
  ];

  return (
    <div className="space-y-5">
      {/* ── Top Toolbar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-600 hidden sm:block">{wordCount} words · ~{readTime} min read</span>
          <button
            onClick={() => handleSave("DRAFT")}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/30 text-sm transition-all disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave("PUBLISHED")}
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-primary text-dark font-bold text-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving…
              </>
            ) : isEdit ? "Update & Publish" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-1 p-1 glass-panel rounded-xl w-fit border border-white/5">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.id
                ? "bg-primary/20 text-primary border border-primary/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════
          CONTENT TAB
      ════════════════════════════════════════════ */}
      {activeTab === "content" && (
        <div className="space-y-5">
          {/* Post meta */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Post Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-lg font-bold"
                placeholder="Write a compelling headline…"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Slug */}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Slug *</label>
                <div className="flex">
                  <span className="px-3 py-3 text-xs text-gray-600 bg-white/[0.02] border border-r-0 border-white/10 rounded-l-lg">/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => { setSlugManual(true); set("slug", slugify(e.target.value)); }}
                    className="flex-1 px-3 py-3 rounded-l-none rounded-r-lg text-sm font-mono"
                    placeholder="my-post-slug"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: "#0a0a0a" }}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                placeholder="A short summary shown on blog cards…"
              />
            </div>

            {/* Cover image preview */}
            {form.coverImage && (
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Cover Image</label>
                <div className="relative rounded-xl overflow-hidden border border-white/10 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="Cover" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => { setMediaInsertTarget("cover"); setShowMediaPanel(true); setActiveTab("media"); }}
                      className="px-3 py-1.5 bg-primary text-dark text-xs font-bold rounded-lg"
                    >
                      Change
                    </button>
                    <button
                      onClick={() => set("coverImage", "")}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!form.coverImage && (
              <button
                onClick={() => { setMediaInsertTarget("cover"); setShowMediaPanel(true); setActiveTab("media"); }}
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors border border-dashed border-white/10 hover:border-primary/30 rounded-lg px-4 py-3 w-full justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Add Cover Image
              </button>
            )}
          </div>

          {/* Content editor */}
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            {/* Format Toolbar */}
            <div className="flex items-center gap-1 px-4 py-2.5 border-b border-white/5 bg-white/[0.01] flex-wrap">
              <span className="text-xs text-gray-600 mr-1 hidden sm:block">Format:</span>

              {[
                { label: "H2", title: "Heading 2", action: () => insertBlock("<h2></h2>") },
                { label: "H3", title: "Heading 3", action: () => insertBlock("<h3></h3>") },
              ].map(({ label, title, action }) => (
                <button key={label} onClick={action} title={title}
                  className="px-2.5 py-1 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all">
                  {label}
                </button>
              ))}

              <div className="w-px h-4 bg-white/10 mx-1" />

              <button onClick={() => insertTag("strong")} title="Bold"
                className="px-2.5 py-1 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all">
                B
              </button>
              <button onClick={() => insertTag("em")} title="Italic"
                className="px-2.5 py-1 text-xs italic text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all">
                I
              </button>
              <button onClick={() => insertTag("a", ' href=""')} title="Link"
                className="px-2.5 py-1 text-xs text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </button>
              <button onClick={() => insertTag("code")} title="Inline code"
                className="px-2.5 py-1 text-xs font-mono text-gray-400 hover:text-primary hover:bg-primary/10 rounded transition-all">
                {"</>"}
              </button>

              <div className="w-px h-4 bg-white/10 mx-1" />

              <button onClick={() => insertBlock("<ul>\n  <li></li>\n  <li></li>\n</ul>")} title="Bullet list"
                className="px-2.5 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
              <button onClick={() => insertBlock("<ol>\n  <li></li>\n  <li></li>\n</ol>")} title="Numbered list"
                className="px-2.5 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </button>
              <button onClick={() => insertBlock('<blockquote style="border-left:3px solid #00f0ff;padding-left:1rem;color:#64748b;font-style:italic"></blockquote>')} title="Blockquote"
                className="px-2.5 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all">
                "
              </button>
              <button onClick={() => insertBlock("<hr />")} title="Divider"
                className="px-2.5 py-1 text-xs text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all">
                ─
              </button>

              <div className="w-px h-4 bg-white/10 mx-1" />

              {/* Media buttons */}
              <button
                onClick={() => { setMediaInsertTarget("content"); setActiveTab("media"); setShowMediaPanel(true); }}
                title="Insert image"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-primary hover:bg-primary/10 rounded transition-all font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Image</span>
              </button>
              <button
                onClick={() => { setMediaInsertTarget("content"); setActiveTab("media"); setShowMediaPanel(true); }}
                title="Insert video"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-secondary hover:bg-secondary/10 rounded transition-all font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Video</span>
              </button>
            </div>

            {/* Textarea */}
            <div className="p-4">
              <textarea
                ref={textareaRef}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                rows={24}
                className="w-full px-4 py-3 rounded-lg text-sm font-mono resize-y leading-relaxed"
                placeholder={`<h2>Introduction</h2>\n<p>Your post content here…</p>\n\n<h2>Section Two</h2>\n<p>More content…</p>\n\n<!-- Images and videos inserted from the toolbar above -->`}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-600">HTML supported · Use toolbar or Media tab to insert images/videos</p>
                <span className="text-xs text-gray-600">{wordCount} words · ~{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          MEDIA TAB
      ════════════════════════════════════════════ */}
      {activeTab === "media" && (
        <div className="space-y-5">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-5">
            <div>
              <p className="text-white font-semibold mb-1">Media Manager</p>
              <p className="text-gray-500 text-sm">
                Upload images and videos to Cloudinary. They are auto-optimised and served via CDN.
                {mediaInsertTarget === "cover" && (
                  <span className="ml-2 text-primary font-medium">← Selecting cover image</span>
                )}
              </p>
            </div>

            {/* Insert target toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setMediaInsertTarget("content")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  mediaInsertTarget === "content"
                    ? "bg-primary/20 text-primary border-primary/30"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Insert into Content
              </button>
              <button
                onClick={() => setMediaInsertTarget("cover")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  mediaInsertTarget === "cover"
                    ? "bg-secondary/20 text-secondary border-secondary/30"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                Set as Cover Image
              </button>
            </div>

            <MediaUploader onInsert={handleMediaInsert} accept="both" />

            {/* Current cover preview */}
            {form.coverImage && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Current Cover Image</p>
                <div className="relative rounded-xl overflow-hidden border border-white/10 group w-full max-w-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="Cover" className="w-full h-32 object-cover" />
                  <button
                    onClick={() => set("coverImage", "")}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
                    title="Remove cover image"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="glass-panel rounded-xl p-5 border border-white/5">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">Tips</p>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Cloudinary auto-compresses images and serves them via global CDN for fast load times.</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Images are resized to max 1600px wide. Videos are capped at 1280px.</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> After uploading, click <strong className="text-gray-300">Insert into Content</strong> — the HTML tag is placed at your cursor position in the editor.</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">→</span> Use <strong className="text-gray-300">From URL</strong> to embed YouTube, Vimeo, or any external media directly.</li>
              <li className="flex items-start gap-2"><span className="text-secondary mt-0.5">→</span> Max file size: <strong className="text-gray-300">Images 10MB · Videos 50MB</strong></li>
            </ul>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          SEO TAB
      ════════════════════════════════════════════ */}
      {activeTab === "seo" && (
        <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-5">
          <div>
            <p className="text-white font-medium mb-1">SEO Settings</p>
            <p className="text-gray-500 text-sm">These fields are injected into the HTML &lt;head&gt; for Google crawlers.</p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Meta Title <span className="text-gray-600 font-normal normal-case">(recommended: 50–60 chars)</span>
            </label>
            <input
              type="text"
              value={form.metaTitle || ""}
              onChange={(e) => set("metaTitle", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              placeholder={form.title || "Post Title | SetupGram"}
            />
            <p className={`text-xs mt-1 ${(form.metaTitle || "").length > 60 ? "text-red-400" : "text-gray-600"}`}>
              {(form.metaTitle || "").length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Meta Description <span className="text-gray-600 font-normal normal-case">(recommended: 140–160 chars)</span>
            </label>
            <textarea
              value={form.metaDescription || ""}
              onChange={(e) => set("metaDescription", e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm resize-none"
              placeholder={form.excerpt || "A concise summary for Google search results…"}
            />
            <p className={`text-xs mt-1 ${(form.metaDescription || "").length > 160 ? "text-red-400" : "text-gray-600"}`}>
              {(form.metaDescription || "").length}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
              Meta Keywords <span className="text-gray-600 font-normal normal-case">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={form.metaKeywords || ""}
              onChange={(e) => set("metaKeywords", e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              placeholder="AI chatbot, customer support, automation, SetupGram"
            />
          </div>

          {/* Google SERP Preview */}
          {(form.metaTitle || form.title) && (
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-5">
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-3 font-semibold">Google SERP Preview</p>
              <div className="space-y-0.5">
                <p className="text-lg leading-tight font-medium hover:underline cursor-default" style={{ color: "#8ab4f8" }}>
                  {form.metaTitle || form.title}
                </p>
                <p className="text-xs" style={{ color: "#34a853" }}>
                  https://setupgram.com/blog/{form.slug || "your-post-slug"}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {form.metaDescription || form.excerpt || "No description provided yet."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
