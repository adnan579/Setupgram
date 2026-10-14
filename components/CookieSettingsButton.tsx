/** @format */

"use client";

import { resetConsent } from "../lib/consent";

// Footer link that re-opens the cookie banner so visitors can change their choice.
export default function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={resetConsent} className={className}>
      Cookie settings
    </button>
  );
}
