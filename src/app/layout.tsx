import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "IgamaZi — Know the Person. Verify the Information.",
  description:
    "IgamaZi is a modern, consent-based professional identity and information directory. Find verified individuals, connect through zero-knowledge relays, and build trusted professional transparency.",
  keywords: [
    "IgamaZi",
    "verified directory",
    "consent-based identity",
    "professional profile",
    "background verification",
    "NDPR compliance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        <Suspense fallback={<header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
