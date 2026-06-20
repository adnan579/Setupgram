"use client";

import { useState } from "react";

const STATUSES = ["NEW", "CONTACTED", "CONVERTED", "LOST"] as const;
type Status = (typeof STATUSES)[number];

const COLORS: Record<Status, string> = {
  NEW: "text-primary border-primary/40 bg-primary/10",
  CONTACTED: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  CONVERTED: "text-green-400 border-green-400/40 bg-green-400/10",
  LOST: "text-red-400 border-red-400/40 bg-red-400/10",
};

export default function LeadStatusSelect({
  id,
  initial,
}: {
  id: string;
  initial: Status;
}) {
  const [status, setStatus] = useState<Status>(initial);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: Status) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) setStatus(next);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative">
      <select
        value={status}
        disabled={saving}
        onChange={(e) => handleChange(e.target.value as Status)}
        className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer appearance-none pr-7 disabled:opacity-50 transition-all ${COLORS[status]}`}
        style={{ background: "transparent" }}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} style={{ background: "#0a0a0a", color: "#e2e8f0" }}>
            {s}
          </option>
        ))}
      </select>
      {saving && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <svg className="animate-spin w-3 h-3 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
    </div>
  );
}
