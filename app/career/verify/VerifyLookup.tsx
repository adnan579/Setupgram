/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyLookup() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/careers/verify-lookup?q=${encodeURIComponent(query.trim())}`,
      );
      const data = await res.json();
      if (data.success && data.slug) {
        router.push(`/career/verify/${data.slug}`);
      } else {
        setError(
          "No certificate found matching that ID. Please check and try again.",
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-2xl p-6 border border-white/10"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SG-INT-2026-4821"
          className="flex-1 px-4 py-3 rounded-lg text-sm font-mono"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-3 rounded-lg bg-primary text-dark font-bold text-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all disabled:opacity-50"
        >
          {loading ? "Checking…" : "Verify"}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
    </form>
  );
}
