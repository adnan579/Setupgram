/** @format */

import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#consulting", label: "Consulting" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 glass-panel border-t border-white/5 py-16 px-6 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="font-display font-bold text-2xl tracking-wider text-white mb-3">
              SETUP<span className="text-primary">GRAM</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Helping businesses transition to the digital world with AI-driven
              solutions and strategic consulting.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
              Navigate
            </p>
            <ul className="space-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-left md:text-right">
            <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-4">
              Get Started
            </p>
            <p className="text-white font-medium mb-3">
              Ready to transform your business?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-dark transition-all font-bold text-sm"
            >
              Get in Touch
              <span aria-hidden>→</span>
            </Link>

            <p className="text-xs text-gray-600 mt-6">
              <a
                href="mailto:info@setupgram.com"
                className="hover:text-primary transition-colors"
              >
                info@setupgram.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-600">
          <span>
            &copy; {new Date().getFullYear()} SetupGram Infotech Solutions. All
            rights reserved.
          </span>
          <span className="text-xs text-gray-700">
            Built with Passion For Innovation & Growth{" "}
          </span>
        </div>
      </div>
    </footer>
  );
}
