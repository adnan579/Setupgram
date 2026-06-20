/** @format */

import { getDb } from "../../../lib/mongodb";
import type { Metadata } from "next";
import LeadsTable from "./LeadsTable";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const db = await getDb();
  const leads = await db
    .collection("leads")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const serialized = leads.map((l) => ({
    ...l,
    _id: l._id.toString(),
    createdAt: l.createdAt instanceof Date ? l.createdAt.toISOString() : l.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Leads</h1>
          <p className="text-gray-500 mt-1 text-sm">{serialized.length} total leads in the CRM</p>
        </div>
      </div>
      <LeadsTable leads={serialized} />
    </div>
  );
}
