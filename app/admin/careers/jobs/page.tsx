/** @format */
import { getDb } from "../../../../lib/mongodb";
import type { Metadata } from "next";
import Link from "next/link";
import JobsTable from "./JobsTable";

export const metadata: Metadata = { title: "Job Postings" };
export const dynamic = "force-dynamic";

export default async function AdminJobsPage() {
  const db = await getDb();
  const jobs = await db
    .collection("jobs")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = jobs.map((j: any) => ({
    ...j,
    _id: j._id.toString(),
    createdAt:
      j.createdAt instanceof Date ? j.createdAt.toISOString() : j.createdAt,
    closingDate:
      j.closingDate instanceof Date
        ? j.closingDate.toISOString()
        : j.closingDate || null,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Job Postings
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {serialized.filter((j) => j.status === "OPEN").length} open ·{" "}
            {serialized.filter((j) => j.status === "CLOSED").length} closed ·{" "}
            {serialized.filter((j) => j.status === "DRAFT").length} drafts
          </p>
        </div>
        <Link
          href="/admin/careers/jobs/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-dark font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all text-sm"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Job
        </Link>
      </div>
      <JobsTable jobs={serialized} />
    </div>
  );
}
