/** @format */
import { getDb } from "../../../../lib/mongodb";
import type { Metadata } from "next";
import ApplicationsTable from "./ApplicationsTable";

export const metadata: Metadata = { title: "Applications" };
export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const db = await getDb();
  const applications = await db
    .collection("applications")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = applications.map((a: any) => ({
    ...a,
    _id: a._id.toString(),
    createdAt:
      a.createdAt instanceof Date ? a.createdAt.toISOString() : a.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white">
          Applications
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {serialized.length} total applications received
        </p>
      </div>
      <ApplicationsTable applications={serialized} />
    </div>
  );
}
