/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ApplicationStatusSelect from "./ApplicationStatusSelect";
import { safeHttpsUrl } from "../../../../lib/validate";

type Application = {
  _id: string;
  jobTitle: string;
  name: string;
  email: string;
  phone?: string;
  linkedin?: string;
  resumeUrl?: string;
  coverMessage?: string;
  status: "NEW" | "REVIEWED" | "SHORTLISTED" | "REJECTED" | "HIRED";
  createdAt: string;
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ApplicationsTable({
  applications: initial,
}: {
  applications: Application[];
}) {
  const [applications, setApplications] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this application permanently?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/applications/${id}`, { method: "DELETE" });
    setApplications((prev) => prev.filter((a) => a._id !== id));
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, job title…"
          className="flex-1 px-4 py-2.5 rounded-xl text-sm"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          <option value="ALL" style={{ background: "#0a0a0a" }}>
            All Statuses
          </option>
          {["NEW", "REVIEWED", "SHORTLISTED", "REJECTED", "HIRED"].map((s) => (
            <option key={s} value={s} style={{ background: "#0a0a0a" }}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-gray-600">
        Showing {filtered.length} of {applications.length} applications
      </p>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center border border-white/5">
          <p className="text-gray-500">No applications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => (
            <div
              key={a._id}
              className="glass-panel rounded-xl border border-white/5 overflow-hidden"
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {a.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {a.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {a.jobTitle} · {a.email}
                  </p>
                </div>
                <div className="flex-shrink-0 hidden sm:block">
                  <ApplicationStatusSelect id={a._id} initial={a.status} />
                </div>
                <div className="flex-shrink-0 hidden md:block text-xs text-gray-600">
                  {fmt(a.createdAt)}
                </div>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === a._id ? null : a._id)
                  }
                  className="flex-shrink-0 text-gray-500 hover:text-primary transition-colors p-1"
                >
                  <svg
                    className={`w-4 h-4 transition-transform ${expandedId === a._id ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(a._id)}
                  disabled={deletingId === a._id}
                  className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1 disabled:opacity-40"
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

              {expandedId === a._id && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 bg-white/[0.01] space-y-3">
                  <div className="sm:hidden">
                    <ApplicationStatusSelect id={a._id} initial={a.status} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <p className="text-gray-400">
                      Phone:{" "}
                      <span className="text-white">{a.phone || "—"}</span>
                    </p>
                    <p className="text-gray-400">
                      LinkedIn:{" "}
                      {safeHttpsUrl(a.linkedin) ? (
                        <a
                          href={safeHttpsUrl(a.linkedin)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {a.linkedin}
                        </a>
                      ) : a.linkedin ? (
                        // Not a valid https link: show as plain text, never as a clickable link
                        <span className="text-white break-all">{a.linkedin}</span>
                      ) : (
                        "—"
                      )}
                    </p>
                    <p className="text-gray-400">
                      Resume:{" "}
                      {safeHttpsUrl(a.resumeUrl) ? (
                        <a
                          href={safeHttpsUrl(a.resumeUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Resume
                        </a>
                      ) : a.resumeUrl ? (
                        <span className="text-red-400">Invalid link (blocked)</span>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                  {a.coverMessage && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">
                        Cover Message
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.03] rounded-lg p-4 border border-white/5">
                        {a.coverMessage}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
