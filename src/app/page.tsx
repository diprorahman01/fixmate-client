
import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  CheckCircle2,
  CreditCard,
  Laptop,
  Refrigerator,
  Search,
  ShieldCheck,
  Smartphone,
  Snowflake,
  Tv,
  WashingMachine,
  Wrench,
  Zap,
} from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Smartphone", icon: Smartphone },
  { name: "Laptop & PC", icon: Laptop },
  { name: "AC", icon: Snowflake },
  { name: "Refrigerator", icon: Refrigerator },
  { name: "TV", icon: Tv },
  { name: "Washing Machine", icon: WashingMachine },
  { name: "Electrical", icon: Zap },
];

const steps = [
  {
    title: "Find a Service",
    description:
      "Browse approved repair services and choose the one you need.",
    icon: Search,
  },
  {
    title: "Send a Request",
    description:
      "Describe your problem, enter your address, and choose a date.",
    icon: CalendarCheck2,
  },
  {
    title: "Technician Fixes It",
    description:
      "A technician accepts your request and completes the repair.",
    icon: Wrench,
  },
  {
    title: "Pay After Completion",
    description:
      "Make a secure payment only after the repair is finished.",
    icon: CreditCard,
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="fixmate-container relative grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-7">
              <Badge
                variant="secondary"
                className="gap-2 rounded-full px-4 py-2"
              >
                <ShieldCheck className="size-4 text-primary" />
                Trusted Repair Service Platform
              </Badge>

              <h1 className="max-w-2xl text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                Broken Devices?
                <br />
                Get Them Fixed by{" "}
                <span className="fixmate-gradient-text">
                  Trusted Technicians.
                </span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Book trusted repair services for smartphones,
                laptops, and home appliances. Track your repair
                and pay only after the job is completed.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2"
                  )}
                >
                  Explore Services
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  href="/about"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                  })}
                >
                  How It Works
                </Link>
              </div>

              <div className="flex flex-wrap gap-5 pt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <BadgeCheck className="size-4 text-primary" />
                  Verified Technicians
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  Job Tracking
                </span>

                <span className="flex items-center gap-2">
                  <CreditCard className="size-4 text-primary" />
                  Pay After Completion
                </span>
              </div>
            </div>

            {/* Hero Illustration Placeholder */}
            <div className="relative">
              <div className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary p-8 shadow-xl sm:p-12">
                <div className="mx-auto flex aspect-square max-w-sm flex-col items-center justify-center rounded-[2rem] border border-primary/15 bg-card/80 p-8 text-center shadow-lg backdrop-blur">
                  <div className="mb-8 flex size-28 items-center justify-center rounded-3xl bg-primary/10">
                    <Wrench className="size-14 text-primary" />
                  </div>

                  <h2 className="text-2xl font-bold">
                    FixMate
                  </h2>

                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    Smart Device & Home Appliance
                    Repair Services
                  </p>

                  <div className="mt-8 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                    <ShieldCheck className="size-4" />
                    Reliable Repairs, Simple Booking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-16 sm:py-20">
          <div className="fixmate-container">
            <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-semibold text-primary">
                  OUR SERVICES
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                  Browse by Category
                </h2>

                <p className="mt-2 text-muted-foreground">
                  Find the right repair service for your device.
                </p>
              </div>

              <Link
                href="/services"
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                View All Services
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link
                    key={category.name}
                    href={`/services?category=${encodeURIComponent(category.name)}`}
                    className="group block"
                  >
                    <Card className="h-full transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                      <CardContent className="flex min-h-36 flex-col items-center justify-center gap-4 p-5 text-center">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-7" />
                        </div>

                        <h3 className="text-sm font-semibold">
                          {category.name}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-muted/40 py-20">
          <div className="fixmate-container">
            <div className="mb-12 text-center">
              <p className="mb-2 text-sm font-semibold text-primary">
                EASY & TRANSPARENT
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                How FixMate Works
              </h2>

              <p className="mt-3 text-muted-foreground">
                Get your repair done in four simple steps.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <Card key={step.title} className="h-full">
                    <CardContent className="space-y-5 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="size-6" />
                        </div>

                        <span className="text-sm font-bold text-muted-foreground">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold">
                        {step.title}
                      </h3>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* TEMPORARY FOOTER */}
      <footer className="border-t py-8">
        <div className="fixmate-container flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} FixMate.
            All rights reserved.
          </p>

          <p>Smart repairs. Trusted service.</p>
        </div>
      </footer>
    </>
  );
}
