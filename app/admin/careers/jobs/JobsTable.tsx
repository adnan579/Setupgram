/** @format */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDateShort as fmt } from "../../../../lib/utils";

type Job = {
  _id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  slug: string;
  status: "DRAFT" | "OPEN" | "CLOSED";
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  OPEN: "text-green-400 bg-green-400/10 border-green-400/20",
  CLOSED: "text-red-400 bg-red-400/10 border-red-400/20",
  DRAFT: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export default function JobsTable({ jobs: initial }: { jobs: Job[] }) {
  const [jobs, setJobs] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function cycleStatus(id: string, current: string) {
    const next =
      current === "OPEN" ? "CLOSED" : current === "CLOSED" ? "DRAFT" : "OPEN";
    setTogglingId(id);
    const res = await fetch(`/api/admin/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok)
      setJobs((prev) =>
        prev.map((j) =>
          j._id === id ? { ...j, status: next as Job["status"] } : j,
        ),
      );
    setTogglingId(null);
    router.refresh();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j._id !== id));
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
          placeholder="Search by title, department, location…"
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
            All
          </option>
          <option value="OPEN" style={{ background: "#0a0a0a" }}>
            Open
          </option>
          <option value="CLOSED" style={{ background: "#0a0a0a" }}>
            Closed
          </option>
          <option value="DRAFT" style={{ background: "#0a0a0a" }}>
            Drafts
          </option>
        </select>
      </div>

      <p className="text-xs text-gray-500">
        Showing {filtered.length} of {jobs.length} jobs
      </p>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center border border-white/5">
          <p className="text-gray-500 mb-4">No jobs found.</p>
          <Link
            href="/admin/careers/jobs/new"
            className="text-primary text-sm hover:underline"
          >
            Post your first job →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((job) => (
            <div
              key={job._id}
              className="glass-panel rounded-xl border border-white/5 px-5 py-4 flex items-center gap-4"
            >
              <button
                onClick={() => cycleStatus(job._id, job.status)}
                disabled={togglingId === job._id}
                title="Click to cycle status"
                aria-label="Click to cycle status"
                className={`text-xs px-2.5 py-1 rounded-full border font-medium flex-shrink-0 disabled:opacity-40 ${STATUS_COLORS[job.status]}`}
              >
                {job.status}
              </button>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-white text-sm truncate">
                  {job.title}
                </p>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-500">
                    {job.department}
                  </span>
                  <span className="text-gray-500">·</span>
                  <span className="text-xs text-gray-500">{job.location}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-xs text-gray-500">
                    {job.employmentType}
                  </span>
                  <span className="text-gray-500 hidden sm:block">·</span>
                  <span className="text-xs text-gray-500 hidden sm:block">
                    {fmt(job.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href={`/admin/careers/jobs/${job._id}`}
                  className="p-2 text-gray-500 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                  title="Edit"
                  aria-label="Edit"
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
                {job.status === "OPEN" && (
                  <Link
                    href={`/career/jobs/${job.slug}`}
                    target="_blank"
                    className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                    title="View live"
                    aria-label="View live"
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
                )}
                <button type="button" aria-label="Delete"
                  onClick={() => handleDelete(job._id, job.title)}
                  disabled={deletingId === job._id}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-40"
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
