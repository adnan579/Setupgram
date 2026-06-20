"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LeadStatusSelect from "./LeadStatusSelect";

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "LOST";
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "text-primary bg-primary/10 border-primary/20",
  CONTACTED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  CONVERTED: "text-green-400 bg-green-400/10 border-green-400/20",
  LOST: "text-red-400 bg-red-400/10 border-red-400/20",
};

const SERVICE_LABELS: Record<string, string> = {
  "app-development": "App Dev",
  "ai-chatbot": "AI Chatbot",
  crm: "CRM",
  "digital-marketing": "Marketing",
  consulting: "Consulting",
  advertising: "Advertising",
  other: "Other",
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function LeadsTable({ leads: initial }: { leads: Lead[] }) {
  const [leads, setLeads] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.service || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
    setLeads((prev) => prev.filter((l) => l._id !== id));
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, service…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm cursor-pointer"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
        >
          <option value="ALL" style={{ background: "#0a0a0a" }}>All Statuses</option>
          <option value="NEW" style={{ background: "#0a0a0a" }}>New</option>
          <option value="CONTACTED" style={{ background: "#0a0a0a" }}>Contacted</option>
          <option value="CONVERTED" style={{ background: "#0a0a0a" }}>Converted</option>
          <option value="LOST" style={{ background: "#0a0a0a" }}>Lost</option>
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-gray-600">Showing {filtered.length} of {leads.length} leads</p>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-16 text-center border border-white/5">
          <p className="text-gray-500">No leads found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((lead) => (
            <div key={lead._id} className="glass-panel rounded-xl border border-white/5 overflow-hidden">
              {/* Row */}
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {lead.name[0]?.toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-white text-sm">{lead.name}</p>
                    {lead.service && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                        {SERVICE_LABELS[lead.service] || lead.service}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{lead.email} {lead.phone ? `· ${lead.phone}` : ""}</p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0 hidden sm:block">
                  <LeadStatusSelect id={lead._id} initial={lead.status} />
                </div>

                {/* Date */}
                <div className="flex-shrink-0 hidden md:block text-xs text-gray-600">{fmt(lead.createdAt)}</div>

                {/* Expand */}
                <button
                  onClick={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
                  className="flex-shrink-0 text-gray-500 hover:text-primary transition-colors p-1"
                  aria-label="Toggle details"
                >
                  <svg className={`w-4 h-4 transition-transform ${expandedId === lead._id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(lead._id)}
                  disabled={deletingId === lead._id}
                  className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors p-1 disabled:opacity-40"
                  aria-label="Delete lead"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Expanded Details */}
              {expandedId === lead._id && (
                <div className="px-5 pb-5 pt-1 border-t border-white/5 bg-white/[0.01]">
                  <div className="sm:hidden mb-3">
                    <LeadStatusSelect id={lead._id} initial={lead.status} />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Message</p>
                  <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.03] rounded-lg p-4 border border-white/5">
                    {lead.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
