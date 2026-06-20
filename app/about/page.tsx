/** @format */

import Link from "next/link";
import type { Metadata } from "next";
import { getDb } from "../../lib/mongodb";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about SetupGram Infotech Solutions — our mission, our team, and how we help businesses thrive in the digital world.",
};

export const dynamic = "force-dynamic";

const stats = [
  { value: "100+", label: "Projects Delivered", color: "text-primary" },
  { value: "AI", label: "Driven Solutions", color: "text-secondary" },
  { value: "24/7", label: "Support Availability", color: "text-white" },
  { value: "ROI", label: "Focused Growth", color: "text-primary" },
];

const team = [
  {
    name: "Adnan",
    role: "Founder & CTO",
    bio: "Full-stack engineer with 3+ years building scalable SaaS products across fintech and e-commerce.",
    accent: "primary",
    initial: "A",
  },
  {
    name: "Maqsood Ali",
    role: "Co-Founder & Strategy Lead",
    bio: "Former McKinsey consultant turned tech entrepreneur, specializing in digital transformation roadmaps.",
    accent: "secondary",
    initial: "S",
  },
  {
    name: "Dev Nair",
    role: "Head of AI & Integrations",
    bio: "AI/ML specialist with a focus on deploying practical, revenue-generating automation for SMEs.",
    accent: "primary",
    initial: "D",
  },
];

const values = [
  {
    icon: "⚡",
    title: "Speed Without Shortcuts",
    description:
      "We move fast and ship on time — but never at the cost of code quality or strategic soundness.",
  },
  {
    icon: "🎯",
    title: "Outcome-First Thinking",
    description:
      "Every feature, every recommendation is measured against one question: does this grow your business?",
  },
  {
    icon: "🤝",
    title: "True Partnership",
    description:
      "We don't disappear after delivery. We stay involved, measure results, and iterate alongside you.",
  },
];

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function About() {
  // Fetch 3 most recent published posts from MongoDB
  let posts: Array<{
    _id: string;
    title: string;
    category: string;
    excerpt: string;
    slug: string;
    coverImage?: string;
    createdAt: string;
  }> = [];
  try {
    const db = await getDb();
    const raw = await db
      .collection("blogs")
      .find({ status: "PUBLISHED" })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray();
    posts = raw.map((p) => ({
      _id: p._id.toString(),
      title: p.title,
      category: p.category,
      excerpt: p.excerpt || "",
      slug: p.slug,
      coverImage: p.coverImage || "",
      createdAt:
        p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    }));
  } catch {
    // silently fall back to empty — site still renders
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-4">
            Who We Are
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-white">
            About <span className="gradient-text">SetupGram</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            A cutting-edge technological solution provider and business
            consulting firm with a singular focus: giving you strategic advice
            to grow and scale your ventures online.
          </p>
        </div>
      </section>

      {/* Mission + Stats */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 glass-panel p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Our <span className="text-primary">Mission</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Our aim is to help businesses seamlessly transition into the
              digital realm. A highly experienced team of professionals brings a
              wide range of expertise and knowledge to the table, ensuring
              custom strategies fit your exact operational needs.
            </p>
            <p className="text-gray-400 leading-relaxed">
              From creating stunning mobile applications to deploying futuristic
              AI Chatbot integrations, we don't just build software — we
              engineer roadmaps for your success.
            </p>
          </div>
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
            {stats.map(({ value, label, color }) => (
              <div
                key={label}
                className="glass-panel p-6 text-center rounded-2xl"
              >
                <h3 className={`text-4xl font-display font-bold mb-2 ${color}`}>
                  {value}
                </h3>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs text-secondary font-semibold tracking-widest uppercase mb-3">
            How We Work
          </p>
          <h2 className="font-display text-4xl font-bold text-white text-center mb-12">
            Our Core <span className="text-secondary">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon, title, description }) => (
              <div
                key={title}
                className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
              >
                <span className="text-4xl mb-5 block">{icon}</span>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertising Callout */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-2xl p-8 md:p-12 border border-orange-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-2xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-xs text-orange-400 font-semibold tracking-widest uppercase mb-3">
                  New Service
                </p>
                <h2 className="font-display text-3xl font-bold text-white mb-3">
                  Paid Advertising{" "}
                  <span className="text-orange-400">Across Every Platform</span>
                </h2>
                <p className="text-gray-400 max-w-xl leading-relaxed">
                  We now run high-impact paid ad campaigns on Google, Meta,
                  Instagram, LinkedIn, YouTube, and more — with full-funnel
                  strategy, creative production, and daily optimisation for
                  maximum ROI.
                </p>
              </div>
              <div className="flex-shrink-0">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-dark font-bold hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all whitespace-nowrap"
                >
                  Launch a Campaign →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-dark/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs text-primary font-semibold tracking-widest uppercase mb-3">
            The People Behind It
          </p>
          <h2 className="font-display text-4xl font-bold text-white text-center mb-4">
            Meet the <span className="text-primary">Team</span>
          </h2>
          <p className="text-center text-gray-400 max-w-xl mx-auto mb-16">
            A small, focused group of builders and strategists who care deeply
            about your results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map(({ name, role, bio, accent, initial }) => (
              <div
                key={name}
                className="glass-panel rounded-2xl p-8 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-3xl text-dark mb-5 ${accent === "primary" ? "bg-gradient-to-br from-primary to-primary/60" : "bg-gradient-to-br from-secondary to-secondary/60"}`}
                >
                  {initial}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
                <p
                  className={`text-xs font-semibold tracking-wide uppercase mb-4 ${accent === "primary" ? "text-primary" : "text-secondary"}`}
                >
                  {role}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog — Live from MongoDB */}
      <section id="blog" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs text-secondary font-semibold tracking-widest uppercase mb-3">
              From the Blog
            </p>
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Latest <span className="text-secondary">Insights</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stay up-to-date with our latest thoughts on AI, web development,
              and digital marketing.
            </p>
          </div>

          {posts.length === 0 ? (
            <p className="text-center text-gray-600 py-12">
              No posts published yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <article
                  key={post._id}
                  className="glass-panel rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col"
                >
                  <div
                    className={`h-48 relative ${i === 0 ? "bg-gradient-to-br from-primary/20 to-dark" : i === 1 ? "bg-gradient-to-br from-secondary/20 to-dark" : "bg-gradient-to-br from-primary/10 via-dark to-secondary/10"}`}
                  >
                    {post.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-primary/30 group-hover:text-primary/60 transition-colors">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs text-primary font-semibold mb-2 uppercase tracking-wide">
                      {post.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="text-xs text-gray-500 flex justify-between items-center mt-auto">
                      <span>{fmt(post.createdAt)}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-white hover:text-primary transition-colors font-medium"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Want to work with us?
          </h2>
          <p className="text-gray-400 mb-8">
            Let's have a conversation about your goals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            Get in Touch →
          </Link>
        </div>
      </section>
    </>
  );
}
