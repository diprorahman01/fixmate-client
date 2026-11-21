import { Suspense } from "react";
import { requireRole } from "@/lib/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-12 text-center">Loading customer workspace...</div>}>
    <ProtectedLayout>{children}</ProtectedLayout>
  </Suspense>;
}

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireRole("customer");
  return <DashboardShell role="customer">{children}</DashboardShell>;
}
