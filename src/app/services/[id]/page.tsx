
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  Clock3,
  CreditCard,
  MapPin,
  ShieldCheck,
  UserRound,
  Wrench,
  CheckCircle2,
} from "lucide-react";

import {
  getServiceById,
  type ServiceDetails,
} from "@/lib/services";

import { RequestRepair } from "@/components/bookings/request-repair";

// ==========================================
// TYPES
// ==========================================

type Props = {
  params: Promise<{ id: string }>;
};

// ==========================================
// SERVICE DETAILS PAGE
// ==========================================

export default function ServiceDetailsPage({
  params,
}: Props) {
  return (
    <Suspense fallback={<ServiceLoading />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

// ==========================================
// FETCH SERVICE DATA
// ==========================================

async function ServiceContent({ params }: Props) {
  const { id } = await params;

  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return <ServiceView service={service} />;
}

// ==========================================
// SERVICE DETAILS UI
// ==========================================

function ServiceView({
  service,
}: {
  service: ServiceDetails;
}) {
  const technician = service.technician;

  return (
    <>
      {/* ==================================
          BREADCRUMB
      ================================== */}

      <section className="border-b border-border bg-muted/30 py-6">
        <div className="fixmate-container">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Back to Services
          </Link>
        </div>
      </section>

      {/* ==================================
          MAIN SERVICE CONTENT
      ================================== */}

      <section className="py-10 sm:py-16">
        <div className="fixmate-container grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_350px]">

          {/* LEFT CONTENT */}

          <div className="min-w-0 space-y-8">

            {/* SERVICE IMAGE */}

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-muted">
              {service.image ? (
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Wrench className="size-20 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* TITLE AND DESCRIPTION */}

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                  {service.category}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-700 dark:text-green-400">
                  <CheckCircle2 className="size-4" />
                  Approved Service
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
                {service.title}
              </h1>

              <p className="mt-5 whitespace-pre-line leading-8 text-muted-foreground">
                {service.description}
              </p>
            </div>

            {/* SERVICE INFORMATION */}

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
              <h2 className="mb-6 text-xl font-bold">
                Service Information
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                <Info
                  label="Category"
                  value={service.category}
                />

                <Info
                  label="Estimated Duration"
                  value={service.estimatedDuration}
                />

                <Info
                  label="Service Mode"
                  value={service.serviceMode}
                />

                <Info
                  label="Service Area"
                  value={service.serviceArea}
                />
              </div>
            </div>

            {/* TECHNICIAN PROFILE */}

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
              <h2 className="mb-6 text-xl font-bold">
                About the Technician
              </h2>

              <div className="flex items-center gap-4">
                <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
                  {technician?.image ? (
                    <Image
                      src={technician.image}
                      alt={
                        technician.name ||
                        service.technicianName
                      }
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <UserRound className="size-10" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold">
                    {technician?.name ||
                      service.technicianName}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    {technician?.area ||
                      service.serviceArea}
                  </p>
                </div>
              </div>

              <p className="mt-6 leading-7 text-muted-foreground">
                {technician?.bio ||
                  "This technician has not added a biography yet."}
              </p>

              <div className="mt-6 flex items-center gap-2 border-t border-border pt-5 text-sm text-muted-foreground">
                <ShieldCheck className="size-5 text-primary" />
                Admin-approved service listing
              </div>
            </div>
          </div>

          {/* ==================================
              RIGHT: PRICE & BOOKING CARD
          ================================== */}

          <aside className="lg:sticky lg:top-28">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-lg sm:p-7">

              {/* STARTING PRICE */}

              <p className="text-sm text-muted-foreground">
                Starting Price
              </p>

              <p className="mt-2 text-4xl font-extrabold text-foreground">
                ${service.basePrice.toFixed(2)}
              </p>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                This is the estimated starting
                price. The technician will confirm
                the final amount after completing
                the repair.
              </p>

              {/* SERVICE HIGHLIGHTS */}

              <div className="mt-7 space-y-5 border-t border-border pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock3 className="size-5 shrink-0 text-primary" />
                  <span>{service.estimatedDuration}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="size-5 shrink-0 text-primary" />
                  <span>{service.serviceArea}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="size-5 shrink-0 text-primary" />
                  <span>Pay after completion</span>
                </div>
              </div>

              {/* ==================================
                  SESSION 7: REQUEST REPAIR
              ================================== */}

              <RequestRepair
                serviceId={service._id}
                serviceTitle={service.title}
              />

              <p className="mt-4 text-center text-xs leading-6 text-muted-foreground">
                Only registered Customer accounts
                can submit repair requests.
              </p>

              {/* SECURITY MESSAGE */}

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />

                <p className="text-xs leading-6 text-muted-foreground">
                  Your request will be securely
                  submitted to the technician.
                  Payment is only available after
                  the repair is completed.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

// ==========================================
// REUSABLE INFORMATION COMPONENT
// ==========================================

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 font-semibold">
        {value}
      </p>
    </div>
  );
}

// ==========================================
// LOADING SKELETON
// ==========================================

function ServiceLoading() {
  return (
    <section className="py-16">
      <div className="fixmate-container grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="space-y-6">
          <div className="aspect-[16/10] rounded-3xl bg-muted" />
          <div className="h-10 w-3/4 rounded bg-muted" />
          <div className="h-28 rounded bg-muted" />
          <div className="h-48 rounded bg-muted" />
        </div>

        <div className="h-96 rounded-3xl bg-muted" />
      </div>
    </section>
  );
}
