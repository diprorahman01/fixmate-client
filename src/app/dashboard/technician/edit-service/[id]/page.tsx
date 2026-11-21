
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import type { RepairService } from "@/lib/services";
import { getMyService } from "@/lib/technician-services";
import { ServiceForm } from "@/components/technician/service-form";

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [service, setService] =
    useState<RepairService | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadService() {
      try {
        const result = await getMyService(id);

        if (active) {
          setService(result);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load service";

        if (active) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadService();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading service details...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-10 text-center">
        <p className="text-red-500">
          {error || "Service not found"}
        </p>

        <Link
          href="/dashboard/technician/my-services"
          className="mt-5 inline-block text-primary"
        >
          Back to My Services
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-muted/30 py-12">
      <div className="fixmate-container max-w-4xl">
        <Link
          href="/dashboard/technician/my-services"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          My Services
        </Link>

        <h1 className="mb-3 text-3xl font-extrabold">
          Edit Service
        </h1>

        <p className="mb-8 text-muted-foreground">
          Update your repair service information.
          Changes require fresh admin approval.
        </p>

        <ServiceForm service={service} />
      </div>
    </section>
  );
}
