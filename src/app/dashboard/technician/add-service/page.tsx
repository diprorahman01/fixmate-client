
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireRole } from "@/lib/require-role";
import { ServiceForm } from "@/components/technician/service-form";

export default function AddServicePage() {
  return (
    <Suspense fallback={<p className="p-8">Loading...</p>}>
      <AddServiceContent />
    </Suspense>
  );
}

async function AddServiceContent() {
  await requireRole("technician");

  return (
    <section className="min-h-screen bg-muted/30 py-12">
      <div className="fixmate-container max-w-4xl">
        <Link
          href="/dashboard/technician/my-services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          My Services
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">
            Add New Service
          </h1>

          <p className="mt-3 text-muted-foreground">
            Create a repair service and submit it
            for admin approval.
          </p>
        </div>

        <ServiceForm />
      </div>
    </section>
  );
}
