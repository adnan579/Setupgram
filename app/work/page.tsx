/** @format */

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { caseStudies } from "../../lib/caseStudies";
import { getService } from "../../lib/services";
import ServiceCta from "../../components/ServiceCta";

// While there are no case studies the page is kept out of search results (a thin page hurts SEO).
const hasWork = caseStudies.length > 0;

export const metadata: Metadata = {
  title: "Our Work: Case Studies",
  description: "Selected projects and results from SetupGram.",
  alternates: { canonical: "/work" },
  robots: hasWork ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  return (
    <>
      <section className="relative z-10 pt-32 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-4">Our Work</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">Case Studies</h1>
          <p className="text-gray-400 text-lg leading-relaxed">Selected projects and what we achieved with our clients.</p>
        </div>
      </section>

      <section className="relative z-10 pb-24 px-6">
        {hasWork ? (
          <ul className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((c) => (
              <li key={c.slug} className="flex">
                <Link href={`/work/${c.slug}`} className="glass-panel rounded-2xl overflow-hidden w-full hover:-translate-y-1 transition-transform group">
                  {c.image && (
                    <div className="relative h-52">
                      <Image src={c.image} alt={c.imageAlt ?? ""} fill unoptimized sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">
                      {c.services.map((s) => getService(s)?.name).filter(Boolean).join(" · ")}
                    </p>
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{c.title}</h2>
                    <p className="text-sm text-gray-400">{c.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="max-w-xl mx-auto text-center text-gray-400">
            We&apos;re preparing our first case studies. In the meantime, tell us about your project and we&apos;ll
            walk you through how we would approach it.
          </p>
        )}
      </section>

      <ServiceCta />
    </>
  );
}
