/** @format */

"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NavBar from "./NavBar";
import Footer from "./Footer";
import ConsentBanner from "./ConsentBanner";
import { useConsent } from "../lib/consent";

// Heavy, purely decorative / interactive widgets: load them in separate chunks,
// only when the public chrome is actually rendered (never on admin or login).
const ThreeBackground = dynamic(() => import("./ThreeBackground"), { ssr: false });
const Bizzua = dynamic(() => import("./Bizzua"), { ssr: false });

// Routes that render WITHOUT the public site chrome (nav, footer, chatbot,
// particle background, analytics and tracking scripts).
const BARE_PREFIXES = ["/admin", "/login"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const consent = useConsent();
  const isBare = BARE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Lets keyboard and screen-reader users jump past the navigation (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10001] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-dark focus:font-bold"
      >
        Skip to main content
      </a>

      {/* ── Google Tag Manager + Google Analytics ──
          Loaded ONLY after the visitor accepts (see ConsentBanner). Until then nothing is
          requested from Google. There is deliberately no <noscript> GTM iframe: it would
          load GTM for people who never had the chance to consent. */}
      {consent === "granted" && (
        <>
          <Script id="gtm-head" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TL8RP39X');`}
          </Script>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-46M4BN1HJ9"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-46M4BN1HJ9');
        `}
          </Script>
        </>
      )}

      {/* The one decorative effect: a particle field, on the home page only */}
      {pathname === "/" && <ThreeBackground />}

      {/* Navigation */}
      <NavBar />

      {/* Page Content */}
      <main id="main-content" tabIndex={-1} className="relative z-10 outline-none">
        {children}
      </main>

      {/* Footer */}
      <Footer />

      {/* Bizzua AI Assistant */}
      <Bizzua />

      {/* Cookie notice */}
      <ConsentBanner />

      {/* Vercel Web Analytics + Speed Insights (aggregate metrics, no advertising cookies) */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
