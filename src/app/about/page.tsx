
import type { Metadata } from "next";
import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how FixMate helps customers book and track repair services.",
};

const steps = [
  {
    icon: Search,
    title: "01. Find a Service",
    description:
      "Browse approved repair services, compare service areas, and choose a suitable technician.",
  },
  {
    icon: CalendarDays,
    title: "02. Submit Your Request",
    description:
      "Provide your contact details, address, preferred date and a description of the problem.",
  },
  {
    icon: Wrench,
    title: "03. Track Your Repair",
    description:
      "The technician accepts your request, starts work and marks the repair completed.",
  },
  {
    icon: CreditCard,
    title: "04. Pay After Completion",
    description:
      "Once the technician has completed the repair, pay securely through Stripe.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-muted/40 py-20 text-center">
        <div className="fixmate-container">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="size-8" />
          </div>

          <p className="mb-4 text-sm font-bold tracking-widest text-primary">
            ABOUT FIXMATE
          </p>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Making Repairs Simpler,
            Safer and More Transparent
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            FixMate is a platform that connects customers
            with technicians offering device and home
            appliance repair services.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="fixmate-container">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">
              How It Works
            </h2>

            <p className="mt-3 text-muted-foreground">
              From repair requests to secure payment.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-border bg-card p-8 shadow-sm"
                >
                  <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-7" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="leading-8 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-20">
        <div className="fixmate-container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">
              Why FixMate?
            </h2>

            <p className="mt-5 leading-8 text-muted-foreground">
              Repairing a device should not be confusing.
              FixMate provides a structured booking
              process where customers can request repairs,
              follow their progress, and pay after
              completion.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Admin-approved repair service listings",
                "Clear booking and repair statuses",
                "Customer and technician dashboards",
                "Secure post-completion payments",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex min-h-80 flex-col items-center justify-center rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 to-card p-10 text-center">
            <ShieldCheck className="size-20 text-primary" />

            <h3 className="mt-6 text-2xl font-bold">
              Trust Through Transparency
            </h3>

            <p className="mt-4 max-w-sm leading-7 text-muted-foreground">
              Every repair follows a defined workflow,
              helping customers understand where their
              request stands.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <div className="fixmate-container">
          <h2 className="text-3xl font-bold">
            Find Your Repair Service
          </h2>

          <p className="mt-4 text-muted-foreground">
            Browse available services and get started.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Browse Services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
