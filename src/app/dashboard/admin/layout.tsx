import { Suspense } from "react";
import { requireRole } from "@/lib/require-role";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-12 text-center">Loading admin workspace...</div>}>
    <ProtectedLayout>{children}</ProtectedLayout>
  </Suspense>;
}

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin");
  return <DashboardShell role="admin">{children}</DashboardShell>;
}
