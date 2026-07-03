/** @format */
import { getDb } from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CertificateEditor from "../../../../../components/admin/CertificateEditor";

export const metadata: Metadata = { title: "Edit Certificate" };
export const dynamic = "force-dynamic";

export default async function EditCertificatePage({
  params,
}: {
  params: { id: string };
}) {
  let cert;
  try {
    const db = await getDb();
    cert = await db
      .collection("certificates")
      .findOne({ _id: new ObjectId(params.id) });
  } catch {
    notFound();
  }

  if (!cert) notFound();

  const serialized = {
    _id: cert._id.toString(),
    candidateName: cert.candidateName || "",
    slug: cert.slug || "",
    certificateId: cert.certificateId || "",
    type: cert.type || "internship",
    program: cert.program || "",
    issueDate: cert.issueDate
      ? new Date(cert.issueDate).toISOString().slice(0, 10)
      : "",
    startDate: cert.startDate
      ? new Date(cert.startDate).toISOString().slice(0, 10)
      : "",
    endDate: cert.endDate
      ? new Date(cert.endDate).toISOString().slice(0, 10)
      : "",
    description: cert.description || "",
    grade: cert.grade || "",
    mentor: cert.mentor || "",
    certificateImage: cert.certificateImage || "",
    verificationStatus: cert.verificationStatus || "VALID",
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">
          Edit Certificate
        </h1>
        <p className="text-gray-500 mt-1 text-sm truncate">
          "{cert.candidateName}" · {cert.certificateId}
        </p>
      </div>
      <CertificateEditor initial={serialized} />
    </div>
  );
}
