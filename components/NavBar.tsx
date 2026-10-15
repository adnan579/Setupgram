/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { caseStudies } from "../lib/caseStudies";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/services", label: "SERVICES" },
  // Shown only once real case studies exist (lib/caseStudies.ts)
  ...(caseStudies.length > 0 ? [{ href: "/work", label: "WORK" }] : []),
  { href: "/blog", label: "BLOG" },
  { href: "/career", label: "CAREERS" },
];

// A section is "current" for its own page and everything beneath it (e.g. a blog post)
const isCurrent = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      aria-label="Main"
      className={`fixed w-full z-50 glass-nav border-b-0 border-white/10 transition-all duration-300 ${
        scrolled ? "py-3 shadow-lg" : "py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-2xl tracking-wider text-white hover:opacity-80 transition-opacity"
        >
          SETUP<span className="text-primary">GRAM</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-sm font-semibold tracking-wide items-center">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isCurrent(pathname, href) ? (pathname === href ? "page" : "true") : undefined}
              className={`hover:text-primary transition-colors ${
                isCurrent(pathname, href) ? "text-primary" : ""
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={`px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-dark transition-all ${
              pathname === "/contact" ? "bg-primary text-dark" : ""
            }`}
          >
            BOOK A FREE CALL
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded"
        >
          <span
            aria-hidden="true"
            className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {/* While closed the drawer is hidden from assistive tech and unreachable by Tab (inert) */}
      <div
        id="mobile-menu"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 flex flex-col gap-4 border-t border-white/5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isCurrent(pathname, href) ? (pathname === href ? "page" : "true") : undefined}
              className={`text-sm font-semibold tracking-wide hover:text-primary transition-colors py-1 ${
                isCurrent(pathname, href)
                  ? "text-primary"
                  : "text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 w-full text-center px-5 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-dark transition-all font-bold text-sm"
          >
            BOOK A FREE CALL
          </Link>
        </div>
      </div>
    </nav>
  );
}
