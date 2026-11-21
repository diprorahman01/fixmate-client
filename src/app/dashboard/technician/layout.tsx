
import { Suspense } from "react";

import { requireRole } from "@/lib/require-role";

type Props = {
  children: React.ReactNode;
};

export default function TechnicianLayout({
  children,
}: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-10 text-center">
          Loading technician workspace...
        </div>
      }
    >
      <ProtectedTechnicianLayout>
        {children}
      </ProtectedTechnicianLayout>
    </Suspense>
  );
}

async function ProtectedTechnicianLayout({
  children,
}: Props) {
  await requireRole("technician");

  return <>{children}</>;
}
