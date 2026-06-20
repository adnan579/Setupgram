/** @format */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div className="max-w-lg">
        <p className="font-display text-[8rem] font-bold leading-none gradient-text">404</p>
        <h1 className="font-display text-3xl font-bold text-white mt-4 mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-10">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 rounded-full bg-primary text-dark font-bold hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 rounded-full glass-panel hover:bg-white/5 transition-all border border-white/10"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
