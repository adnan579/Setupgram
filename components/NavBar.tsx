/** @format */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/#services", label: "SERVICES" },
  { href: "/#consulting", label: "CONSULTING" },
];

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
      className={`fixed w-full z-50 glass-panel border-b-0 border-white/10 transition-all duration-300 ${
        scrolled ? "py-3 shadow-[0_4px_30px_rgba(0,240,255,0.05)]" : "py-4"
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
              className={`hover:text-primary transition-colors ${
                pathname === href && !href.includes("#") ? "text-primary" : ""
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className={`px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-dark transition-all ${
              pathname === "/contact" ? "bg-primary text-dark" : ""
            }`}
          >
            LET'S TALK
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={isOpen}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-all duration-300 origin-center ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 pt-2 flex flex-col gap-4 border-t border-white/5">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-semibold tracking-wide hover:text-primary transition-colors py-1 ${
                pathname === href && !href.includes("#") ? "text-primary" : "text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-2 w-full text-center px-5 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-dark transition-all font-bold text-sm"
          >
            LET'S TALK
          </Link>
        </div>
      </div>
    </nav>
  );
}
