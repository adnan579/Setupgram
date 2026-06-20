/** @format */

import { getDb } from "../../lib/mongodb";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

async function getStats() {
  const db = await getDb();

  const [leads, posts] = await Promise.all([
    db.collection("leads").find({}).toArray(),
    db.collection("blogs").find({}).toArray(),
  ]);

  const total = leads.length;
  const statusCount = { NEW: 0, CONTACTED: 0, CONVERTED: 0, LOST: 0 } as Record<string, number>;
  leads.forEach((l) => { if (l.status) statusCount[l.status] = (statusCount[l.status] || 0) + 1; });

  const serviceCount: Record<string, number> = {};
  leads.forEach((l) => {
    if (l.service) serviceCount[l.service] = (serviceCount[l.service] || 0) + 1;
  });
  const topService = Object.entries(serviceCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

  const recentLeads = leads
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED").length;
  const draftPosts = posts.filter((p) => p.status === "DRAFT").length;
  const recentPosts = posts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return { total, statusCount, topService, recentLeads, publishedPosts, draftPosts, recentPosts };
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "text-primary bg-primary/10 border-primary/20",
  CONTACTED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  CONVERTED: "text-green-400 bg-green-400/10 border-green-400/20",
  LOST: "text-red-400 bg-red-400/10 border-red-400/20",
};

function fmt(d: Date | string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminDashboard() {
  const { total, statusCount, topService, recentLeads, publishedPosts, draftPosts, recentPosts } = await getStats();

  const kpis = [
    { label: "Total Leads", value: total, sub: "All time", color: "text-primary", icon: "👥" },
    { label: "Converted", value: statusCount.CONVERTED || 0, sub: `${total ? Math.round(((statusCount.CONVERTED || 0) / total) * 100) : 0}% conversion`, color: "text-green-400", icon: "✅" },
    { label: "Active Pipeline", value: (statusCount.NEW || 0) + (statusCount.CONTACTED || 0), sub: "New + Contacted", color: "text-yellow-400", icon: "🔥" },
    { label: "Published Posts", value: publishedPosts, sub: `${draftPosts} drafts`, color: "text-secondary", icon: "📝" },
  ];

  const pipeline = [
    { label: "New", key: "NEW", color: "bg-primary", textColor: "text-primary" },
    { label: "Contacted", key: "CONTACTED", color: "bg-yellow-400", textColor: "text-yellow-400" },
    { label: "Converted", key: "CONVERTED", color: "bg-green-400", textColor: "text-green-400" },
    { label: "Lost", key: "LOST", color: "bg-red-400", textColor: "text-red-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Welcome back. Here's what's happening at SetupGram.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, sub, color, icon }) => (
          <div key={label} className="glass-panel rounded-2xl p-5 border border-white/5">
            <div className="text-2xl mb-3">{icon}</div>
            <div className={`font-display text-3xl font-bold ${color} mb-1`}>{value}</div>
            <div className="text-sm font-medium text-white">{label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold text-white mb-5 flex items-center justify-between">
            Lead Pipeline
            <Link href="/admin/leads" className="text-xs text-primary hover:underline">View all →</Link>
          </h2>
          <div className="space-y-3">
            {pipeline.map(({ label, key, color, textColor }) => {
              const count = statusCount[key] || 0;
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`font-medium ${textColor}`}>{label}</span>
                    <span className="text-gray-400">{count} <span className="text-gray-600">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-white/5 text-xs text-gray-500">
            Top service: <span className="text-white font-medium capitalize">{topService.replace(/-/g, " ")}</span>
          </div>
        </div>

        {/* Recent Leads */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/5">
          <h2 className="font-bold text-white mb-5 flex items-center justify-between">
            Recent Leads
            <Link href="/admin/leads" className="text-xs text-primary hover:underline">Manage →</Link>
          </h2>
          {recentLeads.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No leads yet. They'll appear here when the contact form is submitted.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div key={lead._id.toString()} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {lead.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{lead.name}</p>
                      <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[lead.status] || "text-gray-400"}`}>
                      {lead.status}
                    </span>
                    <span className="text-xs text-gray-600 hidden sm:block">{fmt(lead.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Blog Posts */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <h2 className="font-bold text-white mb-5 flex items-center justify-between">
          Recent Blog Posts
          <Link href="/admin/blogs" className="text-xs text-primary hover:underline">Manage →</Link>
        </h2>
        {recentPosts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">No blog posts yet.</p>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            {recentPosts.map((post) => (
              <Link
                key={post._id.toString()}
                href={`/admin/blogs/${post._id}`}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{post.category}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${post.status === "PUBLISHED" ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"}`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors line-clamp-2">{post.title}</p>
                <p className="text-xs text-gray-600 mt-2">{fmt(post.createdAt)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
