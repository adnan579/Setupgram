/** @format */
import { getDb } from "../../../../lib/mongodb";
import type { Metadata } from "next";
import Link from "next/link";
import CertificatesTable from "./CertificatesTable";

export const metadata: Metadata = { title: "Certificates" };
export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const db = await getDb();
  const certificates = await db
    .collection("certificates")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = certificates.map((c: any) => ({
    ...c,
    _id: c._id.toString(),
    issueDate:
      c.issueDate instanceof Date ? c.issueDate.toISOString() : c.issueDate,
    createdAt:
      c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Certificates
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {serialized.length} certificates issued
          </p>
        </div>
        <Link
          href="/admin/careers/certificates/new"
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
          Issue Certificate
        </Link>
      </div>
      <CertificatesTable certificates={serialized} />
    </div>
  );
}
