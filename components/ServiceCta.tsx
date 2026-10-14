/** @format */

import Link from "next/link";
import { siteConfig, whatsappHref } from "../lib/siteConfig";

// Closing call-to-action reused on service and work pages.
export default function ServiceCta({ heading = "Ready to talk?" }: { heading?: string }) {
  const wa = whatsappHref();
  return (
    <section className="relative z-10 px-6 pb-24">
      <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-10 text-center border border-primary/20">
        <h2 className="font-display text-3xl font-bold text-white mb-3">{heading}</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
          Book a free consultation. We reply within 24 hours, and there is no obligation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="px-8 py-4 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
            Book a Free Consultation
          </Link>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="px-8 py-4 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all">
              Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
        {siteConfig.phone && (
          <p className="mt-5 text-sm text-gray-400">
            Or call <a href={siteConfig.phoneHref} className="text-primary underline underline-offset-2">{siteConfig.phone}</a>
          </p>
        )}
      </div>
    </section>
  );
}
