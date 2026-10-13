/** @format */

"use client";

import Link from "next/link";
import { useEffect } from "react";

// Catches errors thrown while rendering any public page (for example a database
// timeout) so visitors see a friendly message instead of a broken screen.
export default function Error({
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
    <div className="min-h-[70vh] flex items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <p className="font-display text-6xl font-bold gradient-text mb-4">Oops</p>
        <h1 className="font-display text-2xl font-bold text-white mb-3">
          Something went wrong
        </h1>
        <p className="text-gray-400 mb-8">
          We couldn&apos;t load this page. It&apos;s usually temporary, so please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-3 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-8 py-3 rounded-full glass-panel hover:bg-white/5 transition-all border border-white/10"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
