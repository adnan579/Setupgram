/** @format */
import { getDb } from "../../../../lib/mongodb";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import JobApplyForm from "../../JobApplyForm";
import { formatDateLong as fmt } from "../../../../lib/utils";
import { DEFAULT_OG_IMAGE } from "../../../../lib/seo";

interface Props {
  params: { slug: string };
}

// Cached and refreshed at most every 60s; admin saves refresh it instantly (lib/revalidate.ts)
export const revalidate = 60;

// Pages are generated on the first visit (none at build time) and then cached,
// instead of hitting the database on every single request.
export async function generateStaticParams() {
  return [];
}

// cache(): generateMetadata() and the page both need the job - fetch it once per request.
const getJob = cache(async (slug: string) => {
  const db = await getDb();
  return db.collection("jobs").findOne({ slug, status: "OPEN" });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob(params.slug);
  if (!job) return { title: "Position Not Found" };
  return {
    title: job.metaTitle || `${job.title} | Careers`,
    description: job.metaDescription || job.excerpt,
    keywords: job.metaKeywords || "",
    openGraph: {
      title: job.metaTitle || job.title,
      description: job.metaDescription || job.excerpt,
      type: "website",
      url: `https://setupgram.com/career/jobs/${job.slug}`,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: { canonical: `https://setupgram.com/career/jobs/${job.slug}` },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getJob(params.slug);
  if (!job) notFound();

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted:
      job.createdAt instanceof Date
        ? job.createdAt.toISOString()
        : job.createdAt,
    ...(job.closingDate
      ? { validThrough: new Date(job.closingDate).toISOString() }
      : {}),
    employmentType: (job.employmentType || "FULL_TIME")
      .toUpperCase()
      .replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: "SetupGram Infotech Solutions",
      sameAs: "https://setupgram.com",
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
        addressCountry: "IN",
      },
    },
    ...(job.salaryRange
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: { "@type": "QuantitativeValue", value: job.salaryRange },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="pt-32 pb-0 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-8">
            <Link
              href="/career"
              className="hover:text-primary transition-colors"
            >
              Careers
            </Link>
            <span>/</span>
            <span className="text-gray-500 truncate">{job.title}</span>
          </div>

          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <span className="text-xs font-bold tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              {job.department}
            </span>
            <span className="text-xs text-gray-500">
              {job.employmentType} · {job.location} · {job.experience}
            </span>
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {job.title}
          </h1>
          {job.excerpt && (
            <p className="text-xl text-gray-400 leading-relaxed border-l-2 border-primary/40 pl-5 mb-6">
              {job.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 mb-8">
            <span>Posted {fmt(job.createdAt)}</span>
            {job.salaryRange && <span>· {job.salaryRange}</span>}
            {job.closingDate && <span>· Apply by {fmt(job.closingDate)}</span>}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-primary/30 via-secondary/30 to-transparent" />
      </div>

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-8">
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />

            {job.responsibilities?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Responsibilities
                </h3>
                <ul className="space-y-2">
                  {job.responsibilities.map((r: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-400 text-sm"
                    >
                      <span className="text-primary mt-1">→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((r: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-400 text-sm"
                    >
                      <span className="text-secondary-light mt-1">→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.benefits?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Benefits</h3>
                <ul className="space-y-2">
                  {job.benefits.map((b: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-gray-400 text-sm"
                    >
                      <svg
                        className="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-24">
              <JobApplyForm
                jobId={job._id.toString()}
                jobTitle={job.title}
                applyEmail={job.applyEmail}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
