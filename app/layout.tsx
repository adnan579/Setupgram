/** @format */

import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";
import SiteChrome from "../components/SiteChrome";
import { siteConfig } from "../lib/siteConfig";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  // Makes every relative URL in metadata (canonicals, Open Graph images) absolute
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SetupGram Infotech Solutions | AI-Driven Business Solutions",
    template: "%s | SetupGram",
  },
  description:
    "SetupGram is a cutting-edge tech solution provider and business consulting firm helping businesses grow online with AI, custom apps, CRM, advertising, and digital marketing.",
  keywords: [
    "AI chatbot",
    "app development",
    "CRM",
    "digital marketing",
    "advertising",
    "Google Ads",
    "Meta Ads",
    "business consulting",
    "SetupGram",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "SetupGram Infotech Solutions",
    description: "Perfect Place For Business Solutions.",
    type: "website",
    siteName: "SetupGram",
    locale: "en_IN",
    // The default share image comes from app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "SetupGram Infotech Solutions",
    description: "AI chatbots, app development, CRM, advertising and consulting.",
  },
};

// The ONE root layout: <html>, <body>, fonts and global CSS only.
// Public-site chrome (nav, footer, chatbot, particles, tracking) lives in
// <SiteChrome>, which skips itself on /admin and /login.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased selection:bg-primary selection:text-dark`}
      >
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
