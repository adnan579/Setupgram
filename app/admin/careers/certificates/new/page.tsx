/** @format */
import type { Metadata } from "next";
import CertificateEditor from "../../../../components/admin/CertificateEditor";

export const metadata: Metadata = { title: "Issue Certificate" };

export default function NewCertificatePage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">
          Issue Certificate
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Create a verifiable certificate for a candidate.
        </p>
      </div>
      <CertificateEditor />
    </div>
  );
}
