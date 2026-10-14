/** @format */
import Link from "next/link";
import type { Metadata } from "next";
import { getDb } from "../../lib/mongodb";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join SetupGram Infotech Solutions. Explore open roles, our work culture, and why builders choose to grow their careers with us.",
  alternates: { canonical: "/career" },
};

// Cached and refreshed at most every 60s; admin saves refresh it instantly (lib/revalidate.ts)
export const revalidate = 60;

const values = [
  {
    icon: "⚖️",
    title: "Real Work-Life Balance",
    description:
      "We measure output, not hours logged. Flexible schedules, no unnecessary late nights, and the freedom to work in the rhythm that makes you most effective.",
  },
  {
    icon: "🌱",
    title: "Growth Over Titles",
    description:
      "Every team member owns real problems from day one. You'll ship production work, learn from senior engineers, and grow faster than in a rigid corporate ladder.",
  },
  {
    icon: "🌍",
    title: "Remote-First Culture",
    description:
      "Work from anywhere. We care about the quality of your work and how you treat your teammates — not which chair you're sitting in.",
  },
  {
    icon: "🤝",
    title: "Small Team, Big Ownership",
    description:
      "We're a lean, focused team. Your ideas reach production fast, and your name is on the work that ships.",
  },
  {
    icon: "🎯",
    title: "Outcome-Driven, Not Political",
    description:
      "No bureaucracy, no unnecessary meetings. Just clear goals, honest feedback, and the trust to get things done your way.",
  },
  {
    icon: "🎓",
    title: "Learning Is Built In",
    description:
      "AI, chatbots, modern web stacks, paid advertising, consulting — you'll be exposed to a wide surface area of skills most jobs never offer.",
  },
];

const perks = [
  "Flexible working hours",
  "Remote / hybrid options",
  "Real ownership on live projects",
  "Direct mentorship from founders",
  "Certificate & LinkedIn-verifiable recognition",
  "Performance-based growth, not tenure-based",
];

type SerializedJob = {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  excerpt: string;
  createdAt: string;
};

async function getOpenJobs(): Promise<SerializedJob[]> {
  try {
    const db = await getDb();
    const jobs = await db
      .collection("jobs")
      .find({ status: "OPEN" })
      .sort({ createdAt: -1 })
      .toArray();
    return jobs.map((j: any) => ({
      _id: j._id.toString(),
      title: j.title,
      slug: j.slug,
      department: j.department,
      location: j.location,
      employmentType: j.employmentType,
      experience: j.experience,
      excerpt: j.excerpt || "",
      createdAt:
        j.createdAt instanceof Date ? j.createdAt.toISOString() : j.createdAt,
    }));
  } catch {
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <>
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-4">
            Careers at SetupGram
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-white">
            Build Your Career, <br />
            <span className="gradient-text">Not Just a Job.</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
            We're a small, ambitious team building AI-driven products and
            strategy for businesses worldwide. We hire people who want to own
            real work, grow fast, and keep their life outside of work intact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a
              href="#open-roles"
              className="px-8 py-4 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
            >
              View Open Roles
            </a>
            <Link
              href="/career/verify"
              className="px-8 py-4 rounded-full glass-panel hover:bg-white/5 transition-all"
            >
              Verify a Certificate
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs text-secondary-light font-semibold tracking-widest uppercase mb-3">
            Life at SetupGram
          </p>
          <h2 className="font-display text-4xl font-bold text-white text-center mb-4">
            Why People <span className="text-secondary-light">Join Us</span>
          </h2>
          <p className="text-center text-gray-400 max-w-2xl mx-auto mb-16">
            We believe great work comes from people who are rested, trusted, and
            genuinely invested in what they're building — not from burnout.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon, title, description }) => (
              <div
                key={title}
                className="glass-panel p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300"
              >
                <span className="text-4xl mb-5 block">{icon}</span>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-dark/50 border-t border-white/5">
        <div className="max-w-5xl mx-auto glass-panel rounded-2xl p-8 md:p-12 border border-white/5">
          <h2 className="font-display text-2xl font-bold text-white mb-6 text-center">
            What You Get
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0"
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
                <span className="text-gray-300 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="open-roles" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs text-primary font-semibold tracking-widest uppercase mb-3">
            Join The Team
          </p>
          <h2 className="font-display text-4xl font-bold text-white text-center mb-4">
            Open <span className="text-primary">Positions</span>
          </h2>
          <p className="text-center text-gray-400 max-w-xl mx-auto mb-16">
            Don't see a perfect fit? Email us at{" "}
            <a
              href="mailto:careers@setupgram.com"
              className="text-primary underline underline-offset-2 hover:text-white"
            >
              careers@setupgram.com
            </a>{" "}
            — we always want to hear from good people.
          </p>

          {jobs.length === 0 ? (
            <div className="glass-panel rounded-2xl p-16 text-center border border-white/5">
              <p className="text-gray-400 mb-2">No open positions right now.</p>
              <p className="text-gray-500 text-sm">
                Check back soon, or send us your resume anyway.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  href={`/career/jobs/${job.slug}`}
                  className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all group"
                >
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {job.employmentType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {job.department} · {job.location} · {job.experience}
                    </p>
                    {job.excerpt && (
                      <p className="text-sm text-gray-400 mt-2 max-w-xl">
                        {job.excerpt}
                      </p>
                    )}
                  </div>
                  <span className="text-primary font-medium flex items-center gap-1 flex-shrink-0 group-hover:gap-2 transition-all">
                    Apply Now
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-8 md:p-12 border border-secondary/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-2xl" />
          <div className="relative z-10">
            <p className="text-xs text-secondary-light font-semibold tracking-widest uppercase mb-3">
              Alumni & Interns
            </p>
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Verify a SetupGram Certificate
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8">
              Every internship, training, hackathon, and event certificate we
              issue is verifiable online — trusted by recruiters and shareable
              directly to LinkedIn.
            </p>
            <Link
              href="/career/verify"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-secondary text-white font-bold hover:shadow-[0_0_25px_rgba(176,38,255,0.4)] transition-all"
            >
              Verify a Certificate →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
