
import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import "./globals.css";

// ==========================================
// FONT
// ==========================================

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// ==========================================
// METADATA
// ==========================================

export const metadata: Metadata = {
  title: {
    default: "FixMate | Smart Repair Services",
    template: "%s | FixMate",
  },
  description:
    "Book trusted technicians for device and home appliance repairs. Track your repair and pay after completion.",
};

// ==========================================
// NAVBAR LOADING FALLBACK
// ==========================================

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background">
      <div className="fixmate-container flex h-20 items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-primary"
        >
          FixMate
        </Link>

        <div className="h-10 w-28 animate-pulse rounded-xl bg-muted" />
      </div>
    </header>
  );
}

// ==========================================
// ROOT LAYOUT
// ==========================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">

            {/* NAVBAR SUSPENSE FIX */}
            <Suspense fallback={<NavbarFallback />}>
              <Navbar />
            </Suspense>

            {/* PAGE CONTENT */}
            <main className="flex-1">
              {children}
            </main>

            {/* FOOTER */}
            <Footer />
          </div>

          {/* NOTIFICATIONS */}
          <Toaster
            richColors
            closeButton
            position="top-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
