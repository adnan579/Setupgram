/** @format */

import { LEGAL_LAST_UPDATED } from "../lib/siteConfig";

// Shared layout for the Privacy Policy and Terms pages (readable line length, clear headings).
export default function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <article className="relative z-10 pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-4">Legal</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: {LEGAL_LAST_UPDATED}</p>
        <p className="text-gray-300 leading-relaxed mb-12">{intro}</p>
        <div className="space-y-10 text-gray-300 leading-relaxed [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mb-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-white">
          {children}
        </div>
      </div>
    </article>
  );
}
