/** @format */
import type { Metadata } from "next";
import JobEditor from "../../../../../components/admin/JobEditor";

export const metadata: Metadata = { title: "New Job Posting" };

export default function NewJobPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-white">
          New Job Posting
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Create a new career opportunity.
        </p>
      </div>
      <JobEditor />
    </div>
  );
}
