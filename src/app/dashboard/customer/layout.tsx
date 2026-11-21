
import { Suspense } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/require-role";

const links = [
  {
    label: "Overview",
    href: "/dashboard/customer",
  },
  {
    label: "My Bookings",
    href: "/dashboard/customer/bookings",
  },
  {
    label: "Payment History",
    href: "/dashboard/customer/payments",
  },
];;

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center">
          Loading customer dashboard...
        </div>
      }
    >
      <ProtectedCustomerLayout>
        {children}
      </ProtectedCustomerLayout>
    </Suspense>
  );
}

async function ProtectedCustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("customer");

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="fixmate-container py-8">
        <div className="mb-8 rounded-2xl border border-border bg-card p-5">
          <h2 className="text-lg font-bold">
            Customer Workspace
          </h2>

          <nav
            aria-label="Customer navigation"
            className="mt-4 flex flex-wrap gap-3"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-primary"
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
