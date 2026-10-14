/** @format */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getService, services } from "../../../lib/services";
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "../../../lib/seo";
import { siteConfig } from "../../../lib/siteConfig";
import JsonLd from "../../../components/JsonLd";
import ServiceCta from "../../../components/ServiceCta";

type Props = { params: { slug: string } };

// Static content: every service page is generated at build time. Unknown slugs 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const s = getService(params.slug);
  if (!s) return { title: "Service Not Found" };
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    keywords: s.keywords,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.metaTitle} | SetupGram`, description: s.metaDescription, url: `/services/${s.slug}`, type: "website", images: [DEFAULT_OG_IMAGE] },
  };
}

export default function ServicePage({ params }: Props) {
  const s = getService(params.slug);
  if (!s) notFound();
  const related = s.related.map((r) => getService(r)).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: s.name, path: `/services/${s.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.name,
            serviceType: s.name,
            description: s.metaDescription,
            url: absoluteUrl(`/services/${s.slug}`),
            provider: { "@id": absoluteUrl("/#organization"), "@type": "Organization", name: siteConfig.legalName, url: siteConfig.url },
            areaServed: [{ "@type": "Country", name: "India" }, "Worldwide"],
          },
        ]}
      />

      <section className="relative z-10 pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-gray-400">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/services" className="hover:text-primary">Services</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{s.name}</li>
            </ol>
          </nav>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">{s.name}</h1>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">{s.intro}</p>
          <Link href="/contact" className="inline-block px-8 py-4 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all">
            Book a Free Consultation
          </Link>
        </div>
      </section>

      <section className="relative z-10 py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white mb-10">What&apos;s included</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {s.includes.map((item) => (
              <li key={item.title} className="glass-panel rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative z-10 py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white mb-10">How we work</h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {s.process.map((step, i) => (
              <li key={step.title} className="glass-panel rounded-xl p-6">
                <span aria-hidden="true" className="block font-display text-3xl font-bold text-primary mb-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative z-10 py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white mb-6">Who it&apos;s for</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            {s.idealFor.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>

      <section className="relative z-10 py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-white mb-6">Frequently asked questions</h2>
          <div className="space-y-3">
            {s.faqs.map((f) => (
              <details key={f.q} className="glass-panel rounded-xl p-5 group">
                <summary className="cursor-pointer font-semibold text-white list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span aria-hidden="true" className="text-primary group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-gray-400 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="relative z-10 py-16 px-6 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-white mb-6">Related services</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/services/${r.slug}`} className="block glass-panel rounded-xl p-5 h-full hover:border-primary/30 transition-colors">
                    <span className="font-bold text-white block mb-1">{r.name}</span>
                    <span className="text-sm text-gray-400">{r.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ServiceCta heading={`Talk to us about ${s.name.toLowerCase()}`} />
    </>
  );
}
