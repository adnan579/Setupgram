/** @format */

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SetupGram Infotech Solutions | AI-Driven Business Solutions",
  description:
    "SetupGram helps businesses grow online with AI chatbots, custom app development, CRM, advertising campaigns, and strategic digital consulting.",
};

const services = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "primary",
    title: "App Development",
    description: "End-to-end building of fast, scalable Web, Android, and iOS applications tailored to your business needs.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    color: "secondary",
    title: "Digital Marketing",
    description: "Data-driven SEO, social media campaigns, and performance marketing strategies designed to drive real ROI.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    color: "white",
    title: "CRM Solutions",
    description: "Streamline your operations and manage customer relationships effortlessly with custom CRM integrations.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    color: "gradient",
    core: true,
    title: "AI Chatbots",
    description: "Intelligent AI chatbot integration for existing and new applications or websites to automate support and sales.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    color: "advertising",
    title: "Advertising",
    description: "High-impact paid ad campaigns across Google, Meta, Instagram, LinkedIn, YouTube & more — full-funnel strategy from creative to conversions.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "white",
    title: "Business Consulting",
    description: "Strategic roadmaps and market-entry plans for businesses transitioning online and scaling their digital footprint.",
  },
];

const testimonials = [
  {
    quote: "SetupGram transformed our brick-and-mortar store into a thriving e-commerce brand in under 3 months. Their team truly understood our vision.",
    name: "Rohan Mehta",
    role: "Founder, Kalakar Crafts",
    accent: "primary",
  },
  {
    quote: "The AI chatbot they deployed reduced our support tickets by 60%. We now handle 3× the customer volume with the same team size.",
    name: "Priya Sharma",
    role: "COO, NovaPay Fintech",
    accent: "secondary",
  },
  {
    quote: "Their Google and Meta ad campaigns delivered 4× ROAS in the first month. Best advertising investment we've made.",
    name: "Vikram Joshi",
    role: "Marketing Head, GrowFast D2C",
    accent: "primary",
  },
];

const stats = [
  { value: "100+", label: "Projects Delivered" },
  { value: "4×", label: "Avg. Ad Campaign ROAS" },
  { value: "24/7", label: "Support Availability" },
  { value: "60%", label: "Avg. Support Cost Reduction" },
];

const adPlatforms = [
  { name: "Google Ads", color: "#4285F4" },
  { name: "Meta", color: "#0866FF" },
  { name: "Instagram", color: "#E1306C" },
  { name: "LinkedIn", color: "#0A66C2" },
  { name: "YouTube", color: "#FF0000" },
  { name: "Twitter / X", color: "#FFFFFF" },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section id="home" className="relative z-10 flex items-center justify-center min-h-screen px-6 text-center pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-secondary/50 bg-secondary/10 text-secondary text-sm font-medium tracking-wide">
            Cutting-Edge AI Technological Solutions
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            Perfect Place For <br />
            <span className="gradient-text">Business Solutions.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            We integrate next-generation artificial intelligence with strategic consulting to create a roadmap for your success — from day one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#services" className="px-8 py-4 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all w-full sm:w-auto">
              Explore Services
            </Link>
            <Link href="/#consulting" className="px-8 py-4 rounded-full glass-panel hover:bg-white/5 transition-all w-full sm:w-auto">
              Strategic Consulting
            </Link>
          </div>
          <div className="mt-20 flex flex-col items-center gap-2 text-gray-600 text-xs tracking-widest animate-pulse-slow">
            <span>SCROLL</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative z-10 py-8 px-6 border-y border-white/5 bg-dark/60">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-white/10">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center px-6 py-2">
              <p className="font-display text-3xl font-bold text-primary mb-1">{value}</p>
              <p className="text-xs text-gray-500 tracking-wide uppercase">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="relative z-10 py-24 px-6 bg-dark/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs text-primary font-semibold tracking-widest uppercase mb-3">What We Do</p>
          <h2 className="font-display text-4xl font-bold mb-4 text-white text-center">
            Tech-Driven <span className="text-primary">Services</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            Future-proof your business with our comprehensive suite of digital, marketing, and AI solutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className={`glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group relative overflow-hidden ${s.core ? "border-primary/30" : ""}`}
              >
                {s.core && (
                  <div className="absolute top-0 right-0 p-2 bg-primary text-dark text-xs font-bold rounded-bl-lg">CORE</div>
                )}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                  s.color === "gradient"
                    ? "bg-gradient-to-br from-primary to-secondary text-white"
                    : s.color === "advertising"
                    ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 text-orange-400"
                    : s.color === "primary"
                    ? "bg-primary/20 text-primary"
                    : s.color === "secondary"
                    ? "bg-secondary/20 text-secondary"
                    : "bg-white/10 text-white"
                }`}>
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Advertising Section ── */}
      <section id="advertising" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <p className="text-xs text-orange-400 font-semibold tracking-widest uppercase mb-4">Paid Advertising</p>
            <h2 className="font-display text-4xl font-bold mb-6 text-white">
              Run Ads That <br /><span className="text-orange-400">Actually Convert.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              We manage high-ROI paid campaigns across every major platform — from strategy and creative to targeting, A/B testing, and daily optimization. No fluff, just results.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { stat: "4×", label: "Average ROAS" },
                { stat: "2×", label: "Conversion Rate Lift" },
                { stat: "30%", label: "Lower Cost Per Lead" },
                { stat: "All", label: "Major Platforms" },
              ].map(({ stat, label }) => (
                <div key={label} className="glass-panel rounded-xl p-4 border border-white/5">
                  <p className="font-display text-2xl font-bold text-orange-400">{stat}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <Link href="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-dark font-bold hover:shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all">
              Launch a Campaign →
            </Link>
          </div>

          <div className="lg:w-1/2">
            <div className="glass-panel rounded-2xl p-8 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-6">Platforms We Advertise On</p>
              <div className="grid grid-cols-2 gap-3">
                {adPlatforms.map(({ name, color }) => (
                  <div key={name} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-sm text-gray-300 font-medium">{name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-white/5">
                <p className="text-xs text-gray-600 text-center">Full-funnel: strategy → creative → targeting → optimization → reporting</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Consulting ── */}
      <section id="consulting" className="relative z-10 py-24 px-6 bg-dark/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 border border-secondary/30 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-4 border border-primary/40 rounded-full animate-[spin_15s_linear_infinite_reverse] border-dashed" />
              <div className="absolute inset-8 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center glass-panel rounded-full m-12">
                <div className="text-center">
                  <span className="block font-display text-4xl text-white font-bold">Strategy</span>
                  <span className="block text-primary tracking-widest mt-2">+ Action</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <p className="text-xs text-secondary font-semibold tracking-widest uppercase mb-4">Business Consulting</p>
            <h2 className="font-display text-4xl font-bold mb-6 text-white">
              Strategic Consulting for <br /><span className="text-secondary">Future-Ready</span> Ventures
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              SetupGram isn't just about code — it's about business growth. We provide strategic advice rooted in market realities, not templates.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                { strong: "Expert Team:", text: "Highly experienced professionals bringing a wide range of expertise and knowledge." },
                { strong: "Roadmap to Success:", text: "From market analysis to operations, we craft best-practice strategies." },
                { strong: "Customized Solutions:", text: "We tailor our advice based on the individual needs of your specific business." },
              ].map(({ strong, text }) => (
                <li key={strong} className="flex items-start">
                  <svg className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-300"><strong className="text-white">{strong}</strong> {text}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="inline-flex items-center text-primary font-bold hover:text-white transition-colors group">
              Schedule a Consultation
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-xs text-secondary font-semibold tracking-widest uppercase mb-3">Client Stories</p>
          <h2 className="font-display text-4xl font-bold text-white text-center mb-4">
            Results That <span className="text-secondary">Speak</span>
          </h2>
          <p className="text-center text-gray-400 max-w-xl mx-auto mb-16">
            Don't take our word for it — here's what our clients say after working with us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ quote, name, role, accent }) => (
              <div key={name} className="glass-panel p-8 rounded-2xl flex flex-col gap-6 hover:-translate-y-1 transition-transform duration-300">
                <svg className={`w-8 h-8 ${accent === "primary" ? "text-primary" : "text-secondary"} opacity-50`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-300 leading-relaxed flex-1 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-dark text-sm ${accent === "primary" ? "bg-primary" : "bg-secondary"}`}>
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-gray-500 text-xs">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-panel rounded-3xl p-12 md:p-16 border border-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl" />
            <div className="relative z-10">
              <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-4">Ready to Start?</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Let's Build Something <span className="gradient-text">Remarkable.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Whether it's a mobile app, an AI integration, a paid ad campaign, or a complete digital strategy — we're here to make it happen.
              </p>
              <Link href="/contact" className="inline-flex items-center px-10 py-4 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all text-lg gap-2">
                Start the Conversation
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
