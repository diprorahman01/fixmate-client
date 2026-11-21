"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Dashboard has its own navigation; do not duplicate the public shell.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const dashboard = pathname.startsWith("/dashboard");
  return (
    <div className="flex min-h-screen flex-col">
      {!dashboard && <Navbar />}
      <div className="flex-1">{children}</div>
      {!dashboard && <Footer />}
    </div>
  );
}
