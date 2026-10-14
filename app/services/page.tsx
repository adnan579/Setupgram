/** @format */

import Link from "next/link";
import type { Metadata } from "next";
import { services } from "../../lib/services";
import JsonLd from "../../components/JsonLd";
import ServiceCta from "../../components/ServiceCta";
import { absoluteUrl, breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "../../lib/seo";

export const metadata: Metadata = {
  title: "Services: AI Chatbots, App Development, CRM, Marketing & Ads",
  description:
    "Explore SetupGram's services: AI chatbot integration, app development, CRM solutions, digital marketing, advertising and business consulting.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Services | SetupGram", url: "/services", type: "website", images: [DEFAULT_OG_IMAGE] },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.name,
              url: absoluteUrl(`/services/${s.slug}`),
            })),
          },
        ]}
      />
      <section className="relative z-10 pt-32 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-4">What We Do</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            Services Built Around <span className="gradient-text">Your Growth</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            From AI chatbots and custom apps to marketing and consulting, one team helps your business grow online.
            We work with clients across India and remotely worldwide.
          </p>
        </div>
      </section>

      <section className="relative z-10 pb-24 px-6">
        <ul className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <li key={s.slug} className="flex">
              <Link
                href={`/services/${s.slug}`}
                className="glass-panel rounded-2xl p-8 w-full hover:-translate-y-1 transition-transform duration-300 group"
              >
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{s.name}</h2>
                <p className="text-gray-400 leading-relaxed mb-5">{s.summary}</p>
                <span className="text-sm font-semibold text-primary">
                  Learn more<span aria-hidden="true"> →</span>
                  <span className="sr-only"> about {s.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ServiceCta heading="Not sure which service you need?" />
    </>
  );
}
