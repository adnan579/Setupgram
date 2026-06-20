/** @format */

import { getDb } from "../../../lib/mongodb";
import type { Metadata } from "next";
import LeadsTable from "./LeadsTable";

export const metadata: Metadata = { title: "Leads" };
export const dynamic = "force-dynamic";

type SerializedLead = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  createdAt: string;
};

export default async function LeadsPage() {
  const db = await getDb();
  const leads = await db
    .collection("leads")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const serialized: SerializedLead[] = leads.map((l) => ({
    _id: l._id.toString(),
    name: l.name ?? "",
    email: l.email ?? "",
    phone: l.phone ?? "",
    service: l.service ?? "",
    message: l.message ?? "",
    status: (l.status as SerializedLead["status"]) ?? "NEW",
    createdAt:
      l.createdAt instanceof Date
        ? l.createdAt.toISOString()
        : (l.createdAt ?? new Date().toISOString()),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Leads</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {serialized.length} total leads in the CRM
          </p>
        </div>
      </div>
      <LeadsTable leads={serialized} />
    </div>
  );
}
