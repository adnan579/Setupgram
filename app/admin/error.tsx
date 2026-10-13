/** @format */

"use client";

import { useEffect } from "react";

// Keeps the admin sidebar visible when a page fails to load.
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-lg mx-auto glass-panel rounded-2xl p-8 border border-red-400/20 text-center">
      <h1 className="font-display text-xl font-bold text-white mb-2">
        This page couldn&apos;t load
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        The database may be waking up (the free MongoDB tier pauses when idle).
        Wait a few seconds and try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-xl bg-primary text-dark font-bold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
      >
        Try again
      </button>
    </div>
  );
}
