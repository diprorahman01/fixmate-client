import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/layout/site-chrome";
import "./globals.css";
import "./visual-upgrade.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "FixMate | Smart Repair Services", template: "%s | FixMate" },
  description: "Book trusted technicians for device and home appliance repairs. Track your repair and pay after completion.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body className={inter.className}>
    <ThemeProvider>
      <Suspense fallback={<div className="min-h-screen animate-pulse bg-muted"/>}>
        <SiteChrome>{children}</SiteChrome>
      </Suspense>
      <Toaster richColors closeButton position="top-right"/>
    </ThemeProvider>
  </body></html>;
}
