/** @format */

import type { Metadata } from "next";
import ContactForm from "../../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with SetupGram Infotech Solutions to discuss your app, AI chatbot, CRM, or digital strategy project.",
};

const contactInfo = [
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "info@setupgram.com",
    href: "mailto:info@setupgram.com",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
  {
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Location",
    value: "India (Remote Worldwide)",
    href: null,
  },
];

export default function Contact() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative z-10 pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-4">Reach Out</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-white">
            Let's Start a <br />
            <span className="gradient-text">Conversation.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Whether you need a new app, a custom AI chatbot, or a roadmap for
            digital transformation — we're here to help you grow online.
          </p>
        </div>
      </section>

      {/* ── Contact Grid ── */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div className="flex flex-col gap-8">
            {/* Contact Details */}
            <div className="glass-panel rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">Contact Details</h2>
              <div className="space-y-5">
                {contactInfo.map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className="text-gray-300 hover:text-primary transition-colors text-sm font-medium">
                          {value}
                        </a>
                      ) : (
                        <p className="text-gray-300 text-sm font-medium">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to expect */}
            <div className="glass-panel rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-6">What Happens Next</h2>
              <ol className="space-y-4">
                {[
                  "We review your message and goals within 24 hours.",
                  "A team member reaches out to schedule a discovery call.",
                  "We put together a tailored proposal — no obligation.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="w-7 h-7 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-400 text-sm leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: Form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
