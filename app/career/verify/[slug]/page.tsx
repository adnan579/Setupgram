/** @format */
import { getDb } from "../../../../lib/mongodb";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { cloudinaryUrl } from "../../../../lib/cloudinary";
import ShareButton from "./ShareButton";
import { formatDateLong as fmt } from "../../../../lib/utils";

interface Props {
  params: { slug: string };
}

const TYPE_LABELS: Record<string, string> = {
  internship: "Internship",
  training: "Training Program",
  hackathon: "Hackathon",
  event: "Event",
  "tech-camp": "Tech Camp",
};

// Cached and refreshed at most every 60s. Revoking/editing a certificate in the admin
// panel refreshes this page instantly (lib/revalidate.ts), so a revoked certificate
// is never shown as valid.
export const revalidate = 60;

// Pages are generated on the first visit (none at build time) and then cached,
// instead of hitting the database on every single request.
export async function generateStaticParams() {
  return [];
}

// cache(): generateMetadata() and the page both need the certificate - fetch it once per request.
const getCertificate = cache(async (slug: string) => {
  const db = await getDb();
  return db.collection("certificates").findOne({ slug });
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cert = await getCertificate(params.slug);
  if (!cert) return { title: "Certificate Not Found" };

  const title = `${cert.candidateName} — ${cert.program} | SetupGram Certificate`;
  const description = `Verified ${TYPE_LABELS[cert.type] || cert.type} certificate issued by SetupGram Infotech Solutions to ${cert.candidateName} for ${cert.program}.`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "profile",
      url: `https://setupgram.com/career/verify/${cert.slug}`,
      ...(cert.certificateImage
        ? { images: [{ url: cert.certificateImage, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(cert.certificateImage ? { images: [cert.certificateImage] } : {}),
    },
    alternates: {
      canonical: `https://setupgram.com/career/verify/${cert.slug}`,
    },
  };
}

export default async function VerifyCertificatePage({ params }: Props) {
  const cert = await getCertificate(params.slug);
  if (!cert) notFound();

  const isValid = cert.verificationStatus === "VALID";
  const issueDate = new Date(cert.issueDate);
  const verifyUrl = `https://setupgram.com/career/verify/${cert.slug}`;

  const linkedInParams = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: cert.program,
    organizationName: "SetupGram Infotech Solutions",
    issueYear: String(issueDate.getFullYear()),
    issueMonth: String(issueDate.getMonth() + 1),
    certUrl: verifyUrl,
    certId: cert.certificateId,
  });
  const linkedInAddUrl = `https://www.linkedin.com/profile/add?${linkedInParams.toString()}`;

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div
          className={`flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-8 w-fit mx-auto border ${
            isValid
              ? "text-green-400 bg-green-400/10 border-green-400/20"
              : "text-red-400 bg-red-400/10 border-red-400/20"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isValid ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
          {isValid
            ? "Verified Certificate"
            : "This certificate has been revoked"}
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
          {cert.certificateImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cloudinaryUrl(cert.certificateImage, 1600)}
              alt={`${cert.candidateName} certificate`}
              decoding="async"
              className="w-full h-auto object-cover"
            />
          )}

          <div className="p-8">
            <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-2">
              {TYPE_LABELS[cert.type] || cert.type}
            </p>
            <h1 className="font-display text-3xl font-bold text-white mb-1">
              {cert.candidateName}
            </h1>
            <p className="text-gray-400 mb-6">has successfully completed</p>
            <p className="text-xl text-secondary font-semibold mb-6">
              {cert.program}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Certificate ID
                </p>
                <p className="font-mono text-white">{cert.certificateId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Issued On
                </p>
                <p className="text-white">{fmt(cert.issueDate)}</p>
              </div>
              {cert.startDate && cert.endDate && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Duration
                  </p>
                  <p className="text-white">
                    {fmt(cert.startDate)} – {fmt(cert.endDate)}
                  </p>
                </div>
              )}
              {cert.grade && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Performance
                  </p>
                  <p className="text-white">{cert.grade}</p>
                </div>
              )}
              {cert.mentor && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Mentor
                  </p>
                  <p className="text-white">{cert.mentor}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Issued By
                </p>
                <p className="text-white">SetupGram Infotech Solutions</p>
              </div>
            </div>

            {cert.description && (
              <p className="text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-5">
                {cert.description}
              </p>
            )}

            {isValid && (
              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-white/5">
                <a
                  href={linkedInAddUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#0A66C2] text-white font-bold text-sm hover:opacity-90 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 11.001-4.124 2.062 2.062 0 01-.001 4.124zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Add to LinkedIn Profile
                </a>
                <ShareButton
                  url={verifyUrl}
                  title={`${cert.candidateName} — ${cert.program}`}
                />
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          This page independently confirms the authenticity of this certificate.{" "}
          <Link href="/career/verify" className="text-primary hover:underline">
            Verify another certificate →
          </Link>
        </p>
      </div>
    </section>
  );
}
