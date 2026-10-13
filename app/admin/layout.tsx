/** @format */

import type { Metadata } from "next";
import AdminShell from "../../components/admin/AdminShell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | SetupGram Admin" },
  robots: "noindex, nofollow",
};

// No <html>/<body> here: the root layout (app/layout.tsx) provides them.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
