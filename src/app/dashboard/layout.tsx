import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return children;
}
