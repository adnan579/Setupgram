/** @format */

import { getDb } from "../../../lib/mongodb";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string) {
  const db = await getDb();
  return db.collection("blogs").findOne({ slug, status: "PUBLISHED" });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.metaKeywords || "",
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      url: `https://setupgram.com/blog/${post.slug}`,
      ...(post.coverImage && { images: [{ url: post.coverImage }] }),
    },
    alternates: { canonical: `https://setupgram.com/blog/${post.slug}` },
  };
}

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readTime(content: string) {
  const words = content
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const db = await getDb();
  const related = await db
    .collection("blogs")
    .find({ status: "PUBLISHED", slug: { $ne: params.slug } })
    .sort({ createdAt: -1 })
    .limit(2)
    .toArray();

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-0 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/about#blog"
              className="hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-500 truncate">{post.title}</span>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-xs text-gray-600">
              {fmt(post.createdAt)} · {readTime(post.content)} min read
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-400 leading-relaxed border-l-2 border-primary/40 pl-5 mb-8">
              {post.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="px-6 mb-0">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full max-h-[480px] object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-6 mt-8">
        <div className="h-px bg-gradient-to-r from-primary/30 via-secondary/30 to-transparent" />
      </div>

      {/* Article Body */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      {/* Tags */}
      {post.metaKeywords && (
        <div className="px-6 pb-10">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            {post.metaKeywords.split(",").map((kw: string) => (
              <span
                key={kw}
                className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400"
              >
                #{kw.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-6 pb-16">
        <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-8 border border-primary/10 text-center">
          <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-3">
            Ready to grow?
          </p>
          <h2 className="font-display text-2xl font-bold text-white mb-3">
            Let's Build Something Remarkable Together
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Whether it's AI, an app, or a full digital strategy — SetupGram has
            you covered.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            Start the Conversation →
          </Link>
        </div>
      </div>

      {/* Read Next */}
      {related.length > 0 && (
        <div className="px-6 pb-20 border-t border-white/5 pt-12">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-display text-xl font-bold text-white mb-6">
              Read Next
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link
                  key={r._id.toString()}
                  href={`/blog/${r.slug}`}
                  className="glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all group"
                >
                  {r.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.coverImage}
                      alt={r.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <span className="text-xs text-primary font-semibold uppercase tracking-wide">
                      {r.category}
                    </span>
                    <p className="text-white font-medium mt-1 group-hover:text-primary transition-colors line-clamp-2 text-sm">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      {fmt(r.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
