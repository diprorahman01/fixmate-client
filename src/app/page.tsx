
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Laptop,
  MapPin,
  Refrigerator,
  Search,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Sparkles,
  Tv,
  WashingMachine,
  Wrench,
  Zap,
} from "lucide-react";

import { getServices } from "@/lib/services";
import { ServiceCard } from "@/components/services/service-card";

// ===================================================
// FIXMATE SERVICE CATEGORIES
// ===================================================

const categories = [
  {
    name: "Smartphone",
    icon: Smartphone,
  },
  {
    name: "Laptop & PC",
    icon: Laptop,
  },
  {
    name: "AC",
    icon: Snowflake,
  },
  {
    name: "Refrigerator",
    icon: Refrigerator,
  },
  {
    name: "TV",
    icon: Tv,
  },
  {
    name: "Washing Machine",
    icon: WashingMachine,
  },
  {
    name: "Electrical",
    icon: Zap,
  },
];

// ===================================================
// HOW FIXMATE WORKS
// ===================================================

const steps = [
  {
    icon: Search,
    title: "Find a Service",
    description:
      "Explore approved repair services for your device or home appliance.",
  },
  {
    icon: CalendarDays,
    title: "Send a Request",
    description:
      "Share the problem, your address, and your preferred repair date.",
  },
  {
    icon: Wrench,
    title: "Technician Fixes It",
    description:
      "Your technician accepts the request and updates the repair progress.",
  },
  {
    icon: CreditCard,
    title: "Pay After Completion",
    description:
      "Pay securely through Stripe only after your repair is completed.",
  },
];

// ===================================================
// WHY CHOOSE FIXMATE
// ===================================================

const benefits = [
  {
    icon: ShieldCheck,
    title: "Approved Repair Services",
    description:
      "Find repair services reviewed and approved by the platform admin.",
  },
  {
    icon: MapPin,
    title: "Convenient Service",
    description:
      "Choose repair services based on your location and service needs.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent Job Tracking",
    description:
      "Follow your repair request from booking to completion.",
  },
  {
    icon: CreditCard,
    title: "Pay After Repair",
    description:
      "Complete your payment only when the repair work is finished.",
  },
];

// ===================================================
// MAIN HOMEPAGE
// ===================================================

export default function HomePage() {
  return (
    <>
      {/* ============================================
          HERO SECTION
      ============================================ */}

      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 lg:pt-20">
        {/* Background Glow */}
        <div className="pointer-events-none absolute -top-24 -right-20 size-[450px] rounded-full bg-primary/10 blur-3xl" />

        <div className="fixmate-container relative grid items-center gap-12 lg:grid-cols-2">
          {/* Hero Content */}
          <div className="space-y-7">
            {/* Small Heading */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="size-4" />
              Smart Repair Service Platform
            </div>

            {/* Main Heading */}
            <h1 className="max-w-2xl text-4xl leading-[1.15] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Broken Device?
              <br />
              Let the{" "}
              <span className="fixmate-gradient-text">
                Experts Fix It.
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              From smartphones and laptops to home
              appliances, FixMate helps you find trusted
              repair technicians. Book a service, track
              your repair, and pay only after the job
              is completed.
            </p>

            {/* Search Form */}
            <form
              action="/services"
              method="GET"
              className="flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg sm:flex-row"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <Search className="size-5 shrink-0 text-muted-foreground" />

                <input
                  type="search"
                  name="search"
                  placeholder="Search AC, laptop, phone repair..."
                  aria-label="Search repair services"
                  className="h-12 min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Find Services
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground sm:text-sm">
              <span className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                Approved Services
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                Repair Tracking
              </span>

              <span className="flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                Pay After Completion
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-transparent to-cyan-400/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-card shadow-2xl">
              <Image
                src="/assets/images/hero-technician.png"
                alt="Technician repairing a laptop in a modern workshop"
                width={1200}
                height={800}
                priority
                className="aspect-[5/4] w-full object-cover"
              />

              {/* Floating Trust Card */}
              <div className="absolute right-4 bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-background/95 p-4 shadow-lg backdrop-blur">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-6" />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Professional Repair Services
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Transparent booking and job tracking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          REPAIR CATEGORIES
      ============================================ */}

      <section className="py-16">
        <div className="fixmate-container">
          <SectionHeading
            eyebrow="EXPLORE CATEGORIES"
            title="What Needs Fixing?"
            description="Choose your device or appliance to find a suitable repair service."
          />

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.name}
                  href={`/services?category=${encodeURIComponent(
                    category.name
                  )}`}
                  className="group flex min-h-40 flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                >
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-7" />
                  </span>

                  <span className="text-sm font-semibold">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED SERVICES
          Next.js 16 Suspense Boundary
      ============================================ */}

      <section className="bg-muted/35 py-20">
        <div className="fixmate-container">
          <Suspense fallback={<FeaturedServicesSkeleton />}>
            <FeaturedServices />
          </Suspense>
        </div>
      </section>

      {/* ============================================
          HOW FIXMATE WORKS
      ============================================ */}

      <section className="py-20">
        <div className="fixmate-container">
          <div className="text-center">
            <SectionHeading
              eyebrow="SIMPLE PROCESS"
              title="How FixMate Works"
              description="Four simple steps from finding a repair service to completing your payment."
            />
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-7" />
                    </div>

                    <span className="text-3xl font-black text-primary/20">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mb-3 text-lg font-bold">
                    {step.title}
                  </h3>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================
          WHY CHOOSE FIXMATE
      ============================================ */}

      <section className="bg-muted/35 py-20">
        <div className="fixmate-container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="THE FIXMATE DIFFERENCE"
              title="Repair Services With More Confidence"
              description="Find technicians, follow your repair progress, and pay securely after the job is finished."
            />

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
                  >
                    <Icon className="mb-4 size-7 text-primary" />

                    <h3 className="mb-2 font-bold">
                      {benefit.title}
                    </h3>

                    <p className="text-sm leading-7 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Repair Status Preview */}
          <div className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary p-8 sm:p-12">
            <div className="rounded-2xl border border-border bg-background p-7 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Wrench className="size-6" />
                </div>

                <div>
                  <p className="font-bold">
                    Your Repair Journey
                  </p>

                  <p className="text-xs text-muted-foreground">
                    A clear process from start to finish
                  </p>
                </div>
              </div>

              {[
                "Request Submitted",
                "Technician Accepted",
                "Repair In Progress",
                "Repair Completed",
                "Secure Payment",
              ].map((status, index) => (
                <div
                  key={status}
                  className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </div>

                  <span className="text-sm font-medium">
                    {status}
                  </span>

                  <CheckCircle2 className="ml-auto size-4 text-primary/60" />
                </div>
              ))}

              <p className="mt-5 text-xs text-muted-foreground">
                Illustrative workflow. Actual progress
                is based on each repair booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FINAL CALL TO ACTION
      ============================================ */}

      <section className="py-20">
        <div className="fixmate-container">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-8 py-14 text-center text-primary-foreground sm:px-14">
            <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full border border-current opacity-10" />

            <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">
              Ready to Get It Fixed?
            </h2>

            <p className="relative mx-auto mt-4 max-w-xl text-sm leading-7 opacity-90 sm:text-base">
              Explore available repair services and
              find a technician for your device or
              home appliance.
            </p>

            <Link
              href="/services"
              className="relative mt-8 inline-flex items-center gap-2 rounded-xl bg-background px-6 py-3 font-semibold text-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore Repair Services
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ===================================================
// DYNAMIC FEATURED SERVICES
// ===================================================
//
// This component performs the dynamic API request.
// It is rendered inside Suspense to avoid blocking
// the whole homepage during Next.js prerendering.
//

async function FeaturedServices() {
  const featuredServices = await getServices({
    sort: "newest",
    limit: 6,
  });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionHeading
          eyebrow="REPAIR SERVICES"
          title="Featured Repair Services"
          description="Discover the latest approved and available repair services."
        />

        <Link
          href="/services"
          className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
        >
          View All Services
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {featuredServices.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
            />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="size-8" />
          </div>

          <h3 className="text-xl font-bold">
            Services Are Being Prepared
          </h3>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-muted-foreground">
            Approved repair services will appear
            here once technicians add their
            services and the admin approves them.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Browse Services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </>
  );
}

// ===================================================
// FEATURED SERVICES LOADING SKELETON
// ===================================================

function FeaturedServicesSkeleton() {
  return (
    <div>
      <SectionHeading
        eyebrow="REPAIR SERVICES"
        title="Featured Repair Services"
        description="Discover the latest repair services."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse overflow-hidden rounded-2xl border border-border bg-card"
          >
            <div className="aspect-[16/10] bg-muted" />

            <div className="space-y-4 p-5">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-10 rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================================================
// REUSABLE SECTION HEADING
// ===================================================

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-bold tracking-widest text-primary">
        {eyebrow}
      </p>

      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}
