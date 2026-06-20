/** @format */

import type { Metadata } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "../globals.css";
import AdminShell from "../../components/admin/AdminShell";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | SetupGram Admin" },
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${spaceGrotesk.variable} font-sans antialiased bg-dark`}
      >
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
