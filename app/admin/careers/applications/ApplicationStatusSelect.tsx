/** @format */

"use client";

import { useState } from "react";

const STATUSES = [
  "NEW",
  "REVIEWED",
  "SHORTLISTED",
  "REJECTED",
  "HIRED",
] as const;
type Status = (typeof STATUSES)[number];

const COLORS: Record<Status, string> = {
  NEW: "text-primary border-primary/40 bg-primary/10",
  REVIEWED: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
  SHORTLISTED: "text-secondary border-secondary/40 bg-secondary/10",
  REJECTED: "text-red-400 border-red-400/40 bg-red-400/10",
  HIRED: "text-green-400 border-green-400/40 bg-green-400/10",
};

export default function ApplicationStatusSelect({
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
      const res = await fetch(`/api/admin/applications/${id}`, {
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
    <select
      value={status}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value as Status)}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border cursor-pointer appearance-none pr-7 disabled:opacity-50 transition-all ${COLORS[status]}`}
      style={{ background: "transparent" }}
    >
      {STATUSES.map((s) => (
        <option
          key={s}
          value={s}
          style={{ background: "#0a0a0a", color: "#e2e8f0" }}
        >
          {s}
        </option>
      ))}
    </select>
  );
}
