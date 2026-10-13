/** @format */

"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import NavBar from "./NavBar";
import Footer from "./Footer";

// Heavy, purely decorative / interactive widgets: load them in separate chunks,
// only when the public chrome is actually rendered (never on admin or login).
const ThreeBackground = dynamic(() => import("./ThreeBackground"), { ssr: false });
const Bizzua = dynamic(() => import("./Bizzua"), { ssr: false });

// Routes that render WITHOUT the public site chrome (nav, footer, chatbot,
// particle background, analytics and tracking scripts).
const BARE_PREFIXES = ["/admin", "/login"];

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const isBare = BARE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <>
      {/* ── Google Tag Manager (noscript fallback) ── */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-TL8RP39X"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>

      {/* ── Google Tag Manager ── */}
      <Script id="gtm-head" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TL8RP39X');`}
      </Script>

      {/* ── Google Analytics ── */}
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

      {/* Ambient Glow Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none z-0" />

      {/* 3D WebGL Particle Background */}
      <ThreeBackground />

      {/* Navigation */}
      <NavBar />

      {/* Page Content */}
      <main className="relative z-10">{children}</main>

      {/* Footer */}
      <Footer />

      {/* Bizzua AI Assistant */}
      <Bizzua />

      {/* Vercel Web Analytics + Speed Insights */}
      <Analytics />
      <SpeedInsights />
    </>
  );
}
