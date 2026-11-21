
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Activity,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";

import {
  getMyBookings,
  type Booking,
} from "@/lib/bookings";

export default function CustomerDashboard() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getMyBookings()
      .then((data) => {
        if (active) setBookings(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load bookings"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const activeJobs = bookings.filter(
    (booking) =>
      ["requested", "accepted", "in-progress"].includes(
        booking.status
      )
  ).length;

  const completedJobs = bookings.filter(
    (booking) =>
      booking.status === "completed"
  ).length;

  const stats = [
    {
      label: "Total Requests",
      value: bookings.length,
      icon: ClipboardList,
    },
    {
      label: "Active Jobs",
      value: activeJobs,
      icon: Activity,
    },
    {
      label: "Completed Jobs",
      value: completedJobs,
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="pb-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">
          Customer Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-extrabold">
          Repair Overview
        </h1>

        <p className="mt-3 text-muted-foreground">
          Track your repair requests and completed jobs.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-8">
          <Loader2 className="size-5 animate-spin" />
          Loading booking statistics...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-xl border border-red-500/30 bg-card p-6 text-red-600"
        >
          {error}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" />
                </div>

                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <p className="mt-3 text-4xl font-extrabold">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-border bg-card p-7">
        <h2 className="text-xl font-bold">
          Manage Your Repairs
        </h2>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          View current booking statuses, cancel
          pending requests and track your repairs.
        </p>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          My Bookings
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
