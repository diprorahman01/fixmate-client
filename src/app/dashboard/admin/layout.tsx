
import { Suspense } from "react";
import Link from "next/link";

import { requireRole } from "@/lib/require-role";

// ==========================================
// ADMIN NAVIGATION
// ==========================================

const links = [
  {
    label: "Overview",
    href: "/dashboard/admin",
  },
  {
    label: "Service Approval",
    href: "/dashboard/admin/services",
  },
  {
    label: "Manage Users",
    href: "/dashboard/admin/users",
  },
  {
    label: "All Bookings",
    href: "/dashboard/admin/bookings",
  },
  {
    label: "Transactions",
    href: "/dashboard/admin/transactions",
  },
];

// ==========================================
// ADMIN LAYOUT
// ==========================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">
          Loading admin workspace...
        </div>
      }
    >
      <ProtectedAdminLayout>
        {children}
      </ProtectedAdminLayout>
    </Suspense>
  );
}

async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="fixmate-container py-8">
        <div className="mb-8 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4">
            <h2 className="text-lg font-extrabold">
              FixMate Admin
            </h2>
            <p className="text-sm text-muted-foreground">
              Platform Management
            </p>
          </div>

          <nav
            aria-label="Admin navigation"
            className="flex flex-wrap gap-2"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {children}
      </div>
    </div>
  );
}
