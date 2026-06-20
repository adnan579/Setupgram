/** @format */

import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "./globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ThreeBackground from "../components/ThreeBackground";
import Bizzua from "../components/Bizzua";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: {
    default: "SetupGram Infotech Solutions | AI-Driven Business Solutions",
    template: "%s | SetupGram",
  },
  description:
    "SetupGram is a cutting-edge tech solution provider and business consulting firm helping businesses grow online with AI, custom apps, CRM, advertising, and digital marketing.",
  keywords: [
    "AI chatbot", "app development", "CRM", "digital marketing",
    "advertising", "Google Ads", "Meta Ads", "business consulting", "SetupGram",
  ],
  openGraph: {
    title: "SetupGram Infotech Solutions",
    description: "Perfect Place For Business Solutions.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased selection:bg-primary selection:text-dark`}
      >
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

        {/* Bizzua AI Assistant — shown on all public pages */}
        <Bizzua />
      </body>
    </html>
  );
}
