/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Certificate = {
  _id: string;
  candidateName: string;
  slug: string;
  certificateId: string;
  type: string;
  program: string;
  issueDate: string;
  verificationStatus: "VALID" | "REVOKED";
  createdAt: string;
};

const TYPE_LABELS: Record<string, string> = {
  internship: "Internship",
  training: "Training",
  hackathon: "Hackathon",
  event: "Event",
  "tech-camp": "Tech Camp",
};

export default function CertificatesTable({
  certificates: initial,
}: {
  certificates: Certificate[];
}) {
  const [certificates, setCertificates] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = certificates.filter((c) => {
    const matchSearch =
      c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      c.program.toLowerCase().includes(search.toLowerCase()) ||
      c.certificateId.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || c.type === filterType;
    return matchSearch && matchType;
  });

  async function toggleStatus(id: string, current: string) {
    const next = current === "VALID" ? "REVOKED" : "VALID";
    await fetch(`/api/admin/certificates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationStatus: next }),
    });
    setCertificates((prev) =>
      prev.map((c) =>
        c._id === id
          ? { ...c, verificationStatus: next as "VALID" | "REVOKED" }
          : c,
      ),
    );
    router.refresh();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete certificate for "${name}"? This cannot be undone.`))
      return;
    setDeletingId(id);
    await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
    setCertificates((prev) => prev.filter((c) => c._id !== id));
    setDeletingId(null);
    router.refresh();
  }

  function copyLink(slug: string, id: string) {
    const url = `${window.location.origin}/career/verify/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function fmt(d: string) {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, program, certificate ID…"
          className="flex-1 px-4 py-2.5 rounded-xl text-sm"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          <option value="ALL" style={{ background: "#0a0a0a" }}>
            All Types
          </option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k} style={{ background: "#0a0a0a" }}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-600">
        Showing {filtered.length} of {certificates.length} certificates
      </p>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center border border-white/5">
          <p className="text-gray-500 mb-4">No certificates found.</p>
          <Link
            href="/admin/careers/certificates/new"
            className="text-primary text-sm hover:underline"
          >
            Issue your first certificate →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="glass-panel rounded-xl border border-white/5 px-5 py-4 flex items-center gap-4"
            >
              <div className="w-9 h-9 rounded-full bg-secondary/20 text-secondary font-bold text-sm flex items-center justify-center flex-shrink-0">
                {c.candidateName[0]?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-white text-sm truncate">
                    {c.candidateName}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                    {TYPE_LABELS[c.type] || c.type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {c.program} ·{" "}
                  <span className="font-mono">{c.certificateId}</span>
                </p>
              </div>

              <button
                onClick={() => toggleStatus(c._id, c.verificationStatus)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium flex-shrink-0 hidden sm:block ${
                  c.verificationStatus === "VALID"
                    ? "text-green-400 bg-green-400/10 border-green-400/20"
                    : "text-red-400 bg-red-400/10 border-red-400/20"
                }`}
              >
                {c.verificationStatus}
              </button>

              <div className="flex-shrink-0 hidden md:block text-xs text-gray-600">
                {fmt(c.issueDate)}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => copyLink(c.slug, c._id)}
                  className="p-2 text-gray-500 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  title="Copy verification link"
                >
                  {copiedId === c._id ? (
                    <span className="text-xs text-primary font-bold px-1">
                      Copied!
                    </span>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  )}
                </button>
                <Link
                  href={`/admin/careers/certificates/${c._id}`}
                  className="p-2 text-gray-500 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  title="Edit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Link>
                <Link
                  href={`/career/verify/${c.slug}`}
                  target="_blank"
                  className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                  title="View verification page"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
                <button
                  onClick={() => handleDelete(c._id, c.candidateName)}
                  disabled={deletingId === c._id}
                  className="p-2 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-40"
                  title="Delete"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
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
