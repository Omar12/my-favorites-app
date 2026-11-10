import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "A personal directory of products, places, and experiences worth recommending.",
  openGraph: { siteName: SITE_NAME, type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-8 pb-16 sm:pt-12">{children}</main>
        <footer className="pb-8 text-center text-xs text-muted">{SITE_NAME}</footer>
      </body>
    </html>
  );
}
