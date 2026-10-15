/** @format */
import { getDb } from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import JobEditor from "../../../../../components/admin/JobEditor";

export const metadata: Metadata = { title: "Edit Job Posting" };
export const dynamic = "force-dynamic";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let job;
  try {
    const db = await getDb();
    job = await db.collection("jobs").findOne({ _id: new ObjectId(id) });
  } catch {
    notFound();
  }

  if (!job) notFound();

  const serialized = {
    _id: job._id.toString(),
    title: job.title || "",
    slug: job.slug || "",
    department: job.department || "General",
    location: job.location || "Remote",
    employmentType: job.employmentType || "Full-time",
    experience: job.experience || "",
    salaryRange: job.salaryRange || "",
    excerpt: job.excerpt || "",
    description: job.description || "",
    responsibilities: job.responsibilities || [],
    requirements: job.requirements || [],
    benefits: job.benefits || [],
    status: job.status || "DRAFT",
    applyEmail: job.applyEmail || "",
    closingDate: job.closingDate
      ? new Date(job.closingDate).toISOString().slice(0, 10)
      : "",
    metaTitle: job.metaTitle || "",
    metaDescription: job.metaDescription || "",
    metaKeywords: job.metaKeywords || "",
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">
          Edit Job Posting
        </h1>
        <p className="text-gray-500 mt-1 text-sm truncate">"{job.title}"</p>
      </div>
      <JobEditor initial={serialized} />
    </div>
  );
}
