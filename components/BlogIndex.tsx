/** @format */

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBlogPage, type BlogPage } from "../lib/blogQueries";
import { formatDateMedium as fmt } from "../lib/utils";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "../lib/seo";

// Shared by /blog, /blog/page/[page], /blog/category/[category] and
// /blog/category/[category]/page/[page]. Pagination lives in the path (not ?page=) so every
// page is a cacheable, indexable URL.

export function parsePage(raw: string | undefined): number | null {
  if (raw === undefined) return 1;
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  // "/blog/page/1" would duplicate "/blog": only page 2+ has a /page/ URL
  return n >= 2 && n <= 10000 ? n : null;
}

const SAFE_EMPTY: BlogPage = { posts: [], total: 0, totalPages: 1, categories: [], category: null };

async function load(page: number, categorySlug?: string): Promise<BlogPage> {
  try {
    return await getBlogPage(page, categorySlug);
  } catch (error) {
    console.error("Blog index query failed:", error);
    // The main /blog page still renders (empty) if the database is unreachable, like the About
    // page. Deeper pages rethrow instead, so a temporary outage is never cached as a 404.
    if (page === 1 && !categorySlug) return SAFE_EMPTY;
    throw error;
  }
}

function pathFor(categorySlug: string | undefined, page: number) {
  const base = categorySlug ? `/blog/category/${categorySlug}` : "/blog";
  return page <= 1 ? base : `${base}/page/${page}`;
}

export async function blogIndexMetadata(page: number, categorySlug?: string): Promise<Metadata> {
  const data = await load(page, categorySlug);
  const catName = data.category?.name;
  const base = catName ? `${catName} Articles` : "Blog";
  const title = page > 1 ? `${base}, Page ${page}` : base;
  const description = catName
    ? `Articles about ${catName} from SetupGram: practical guidance on AI, apps, marketing and growing your business online.`
    : "Articles from SetupGram on AI chatbots, app development, digital marketing and growing your business online.";
  return {
    title,
    description,
    alternates: { canonical: pathFor(categorySlug, page) },
    openGraph: { title: `${title} | SetupGram`, description, url: pathFor(categorySlug, page), type: "website", images: [DEFAULT_OG_IMAGE] },
  };
}

export default async function BlogIndex({ page, categorySlug }: { page: number; categorySlug?: string }) {
  const data = await load(page, categorySlug);
  const { posts, categories, category, totalPages } = data;

  // Unknown category, or a page past the end, is a real 404 (but an empty blog's first page is fine)
  if (categorySlug && !category) notFound();
  if (page > totalPages) notFound();

  const heading = category ? category.name : "Insights & Articles";

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          ...(category ? [{ name: category.name, path: `/blog/category/${category.slug}` }] : []),
        ])}
      />

      <section className="relative z-10 pt-32 pb-10 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-6 text-xs text-gray-400">
            <ol className="flex items-center justify-center gap-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li>
                {category ? <Link href="/blog" className="hover:text-primary">Blog</Link> : <span aria-current="page">Blog</span>}
              </li>
              {category && (
                <>
                  <li aria-hidden="true">/</li>
                  <li><span aria-current="page">{category.name}</span></li>
                </>
              )}
            </ol>
          </nav>
          <p className="text-xs text-secondary-light font-semibold tracking-widest uppercase mb-3">The SetupGram Blog</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{heading}</h1>
          <p className="text-gray-400 leading-relaxed">
            Practical guidance on AI, app development, digital marketing and growing your business online.
          </p>
        </div>
      </section>

      {categories.length > 0 && (
        <nav aria-label="Blog categories" className="relative z-10 px-6 pb-10">
          <ul className="max-w-4xl mx-auto flex flex-wrap justify-center gap-2">
            <li>
              <Link
                href="/blog"
                aria-current={!category ? "page" : undefined}
                className={`inline-block px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  !category ? "bg-primary text-dark border-primary font-semibold" : "border-white/20 text-gray-300 hover:border-primary hover:text-primary"
                }`}
              >
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/blog/category/${c.slug}`}
                  aria-current={category?.slug === c.slug ? "page" : undefined}
                  className={`inline-block px-4 py-1.5 rounded-full text-sm border transition-colors ${
                    category?.slug === c.slug ? "bg-primary text-dark border-primary font-semibold" : "border-white/20 text-gray-300 hover:border-primary hover:text-primary"
                  }`}
                >
                  {c.name} <span className="opacity-70">({c.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <section className="relative z-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No articles published yet. Check back soon.</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <li key={post._id} className="flex">
                  <article className="glass-panel rounded-2xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 flex flex-col w-full">
                    <Link href={`/blog/${post.slug}`} className="flex flex-col flex-1">
                      <div className="h-48 relative bg-gradient-to-br from-primary/15 to-dark">
                        {post.coverImage && (
                          <Image
                            src={post.coverImage}
                            alt=""
                            fill
                            priority={page === 1 && i < 3}
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">{post.category}</p>
                        <h2 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                        {post.excerpt && <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>}
                        <p className="text-xs text-gray-400 mt-auto">{fmt(post.createdAt)}</p>
                      </div>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-14">
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {page > 1 && (
                  <li>
                    <Link href={pathFor(categorySlug, page - 1)} rel="prev" className="px-4 py-2 rounded-full border border-white/20 text-sm text-gray-200 hover:border-primary hover:text-primary">
                      ← Previous
                    </Link>
                  </li>
                )}
                {Array.from({ length: totalPages }, (_, k) => k + 1).map((n) => (
                  <li key={n}>
                    <Link
                      href={pathFor(categorySlug, n)}
                      aria-label={`Page ${n}`}
                      aria-current={n === page ? "page" : undefined}
                      className={`inline-flex w-10 h-10 items-center justify-center rounded-full text-sm border ${
                        n === page ? "bg-primary text-dark border-primary font-bold" : "border-white/20 text-gray-200 hover:border-primary hover:text-primary"
                      }`}
                    >
                      {n}
                    </Link>
                  </li>
                ))}
                {page < totalPages && (
                  <li>
                    <Link href={pathFor(categorySlug, page + 1)} rel="next" className="px-4 py-2 rounded-full border border-white/20 text-sm text-gray-200 hover:border-primary hover:text-primary">
                      Next →
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
