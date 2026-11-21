
import { Suspense } from "react";
import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";

import { requireRole } from "@/lib/require-role";
import type { UserRole } from "@/lib/roles";

type Props = {
  params: Promise<{
    role: string;
  }>;
};

export default function DashboardPage({
  params,
}: Props) {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent params={params} />
    </Suspense>
  );
}

async function DashboardContent({
  params,
}: Props) {
  const { role } = await params;

  if (
    role !== "customer" &&
    role !== "technician" &&
    role !== "admin"
  ) {
    notFound();
  }

  const session = await requireRole(
    role as UserRole
  );

  return (
    <section className="min-h-[70vh] bg-muted/30 py-16">
      <div className="fixmate-container">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
          <div className="mb-7 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="size-8" />
          </div>

          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            {role} Dashboard
          </p>

          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Welcome, {session.user.name}!
          </h1>

          <p className="mt-4 max-w-xl leading-8 text-muted-foreground">
            Your FixMate account is connected.
            The complete {role} dashboard,
            statistics and management tools
            will be added in the upcoming
            development sessions.
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5">
            <p className="text-sm font-semibold">
              Account information
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Email: {session.user.email}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Role: {role}
            </p>
          </div>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Browse Services
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
