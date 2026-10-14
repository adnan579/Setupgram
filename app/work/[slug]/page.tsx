/** @format */

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { caseStudies, getCaseStudy } from "../../../lib/caseStudies";
import { getService } from "../../../lib/services";
import { breadcrumbJsonLd, DEFAULT_OG_IMAGE } from "../../../lib/seo";
import JsonLd from "../../../components/JsonLd";
import ServiceCta from "../../../components/ServiceCta";

type Props = { params: { slug: string } };

export const dynamicParams = false;
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const c = getCaseStudy(params.slug);
  if (!c) return { title: "Case Study Not Found" };
  return {
    title: `${c.title} | Case Study`,
    description: c.summary,
    alternates: { canonical: `/work/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.summary,
      url: `/work/${c.slug}`,
      type: "article",
      images: [c.image ? { url: c.image, alt: c.imageAlt ?? c.title } : DEFAULT_OG_IMAGE],
    },
  };
}

export default function CaseStudyPage({ params }: Props) {
  const c = getCaseStudy(params.slug);
  if (!c) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: c.title, path: `/work/${c.slug}` },
        ])}
      />
      <article className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-gray-400">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/work" className="hover:text-primary">Work</Link></li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{c.title}</li>
            </ol>
          </nav>
          <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-3">
            {c.client}{c.year ? ` · ${c.year}` : ""}
          </p>
          <h1 className="font-display text-4xl font-bold text-white mb-6">{c.title}</h1>
          <p className="text-lg text-gray-300 mb-8">{c.summary}</p>
          {c.image && (
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
              <Image src={c.image} alt={c.imageAlt ?? ""} fill unoptimized sizes="768px" className="object-cover" priority />
            </div>
          )}
          <h2 className="font-display text-2xl font-bold text-white mb-3">The challenge</h2>
          <p className="text-gray-300 leading-relaxed mb-8">{c.challenge}</p>
          <h2 className="font-display text-2xl font-bold text-white mb-3">What we did</h2>
          <p className="text-gray-300 leading-relaxed mb-8">{c.solution}</p>
          {c.results.length > 0 && (
            <>
              <h2 className="font-display text-2xl font-bold text-white mb-3">Results</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-8">
                {c.results.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </>
          )}
          <p className="text-sm text-gray-400">
            Services:{" "}
            {c.services.map((sl, i) => {
              const sv = getService(sl);
              return sv ? (
                <span key={sl}>
                  {i > 0 && ", "}
                  <Link href={`/services/${sl}`} className="text-primary underline underline-offset-2">{sv.name}</Link>
                </span>
              ) : null;
            })}
          </p>
        </div>
      </article>
      <ServiceCta />
    </>
  );
}
