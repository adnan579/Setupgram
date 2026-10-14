/** @format */

"use client";

import Link from "next/link";
import { useConsent, writeConsent } from "../lib/consent";

// Cookie notice. Shown until the visitor makes a choice. "Accept" and "Decline" are equally
// prominent on purpose (no dark patterns), and declining never limits what the site can do.
export default function ConsentBanner() {
  const choice = useConsent();

  // null = still checking the browser; granted/denied = already decided
  if (choice !== "unset") return null;

  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:max-w-md z-[10000] rounded-2xl border border-white/15 bg-[#0d0d12] p-5 shadow-2xl"
    >
      <p className="text-sm font-semibold text-white mb-1">Cookies &amp; analytics</p>
      <p className="text-sm text-gray-300 leading-relaxed mb-4">
        We&apos;d like to use Google Analytics and Tag Manager to understand how the site is used.
        They stay switched off unless you accept. You can change your mind any time from
        &ldquo;Cookie settings&rdquo; in the footer. See our{" "}
        <Link href="/privacy" className="text-primary underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => writeConsent("granted")}
          className="flex-1 px-4 py-2.5 rounded-full bg-primary text-dark font-bold text-sm"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => writeConsent("denied")}
          className="flex-1 px-4 py-2.5 rounded-full border border-white/30 text-white font-bold text-sm hover:bg-white/10 transition-colors"
        >
          Decline
        </button>
      </div>
    </section>
  );
}
