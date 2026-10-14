/** @format */

import Link from "next/link";
import { siteConfig, whatsappHref } from "../lib/siteConfig";
import CookieSettingsButton from "./CookieSettingsButton";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#services", label: "Services" },
  { href: "/#consulting", label: "Consulting" },
  { href: "/career", label: "Careers" },
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
              <span aria-hidden="true">→</span>
            </Link>

            <ul className="mt-6 space-y-1.5 text-sm text-gray-400">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.phone && (
                <li>
                  <a href={siteConfig.phoneHref} className="hover:text-primary transition-colors">
                    {siteConfig.phone}
                  </a>
                </li>
              )}
              {whatsappHref() && (
                <li>
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    WhatsApp us
                  </a>
                </li>
              )}
            </ul>

            {siteConfig.social.length > 0 && (
              <ul aria-label="Social media" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 md:justify-end text-sm text-gray-400">
                {siteConfig.social.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
          <span>
            &copy; {new Date().getFullYear()} SetupGram Infotech Solutions. All
            rights reserved.
          </span>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs">
            <li>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <CookieSettingsButton className="hover:text-primary transition-colors" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
