
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Users,
  UserRoundCheck,
  Clock3,
  ArrowRight,
  LayoutDashboard,
  Loader2,
  ShieldCheck,
  ClipboardList,
  CreditCard,
} from "lucide-react";

import {
  getAdminStats,
  type AdminStats,
} from "@/lib/admin";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(
    null
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAdminStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((err: unknown) => {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load statistics"
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-8 pb-12">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
          <LayoutDashboard className="size-4" />
          Administrator Workspace
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Admin Overview
        </h1>

        <p className="mt-3 text-muted-foreground">
          Manage users, approve repair services,
          monitor bookings and review transactions.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-8">
          <Loader2 className="size-5 animate-spin text-primary" />
          Loading statistics...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/30 bg-card p-6 text-destructive"
        >
          {error}
        </div>
      ) : stats ? (
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<Users className="size-6" />}
          />

          <StatCard
            title="Total Technicians"
            value={stats.totalTechnicians}
            icon={<UserRoundCheck className="size-6" />}
          />

          <StatCard
            title="Pending Services"
            value={stats.pendingServices}
            icon={<Clock3 className="size-6" />}
          />
        </div>
      ) : null}

      <div>
        <h2 className="mb-5 text-xl font-bold">
          Admin Management
        </h2>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Shortcut
            href="/dashboard/admin/services"
            title="Service Approval"
            description="Review, approve or reject repair services submitted by technicians."
            label="Review Services"
            icon={<ShieldCheck className="size-6" />}
          />

          <Shortcut
            href="/dashboard/admin/users"
            title="Manage Users"
            description="View registered accounts and manage user roles."
            label="View Users"
            icon={<Users className="size-6" />}
          />

          <Shortcut
            href="/dashboard/admin/bookings"
            title="All Bookings"
            description="Monitor customer bookings and repair progress across the platform."
            label="View Bookings"
            icon={<ClipboardList className="size-6" />}
          />

          <Shortcut
            href="/dashboard/admin/transactions"
            title="Transactions"
            description="Review verified payments and total platform revenue."
            label="View Transactions"
            icon={<CreditCard className="size-6" />}
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/40">
      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-sm text-muted-foreground">
        {title}
      </p>

      <p className="mt-3 text-4xl font-extrabold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function Shortcut({
  href,
  title,
  description,
  label,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        {label}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
