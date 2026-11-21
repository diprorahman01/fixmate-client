
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Loader2,
  PlusCircle,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { getMyServices } from "@/lib/technician-services";
import {
  getTechnicianRequests,
  type Booking,
} from "@/lib/bookings";
import type { RepairService } from "@/lib/services";

export default function TechnicianOverviewPage() {
  const [services, setServices] = useState<
    RepairService[]
  >([]);
  const [requests, setRequests] = useState<
    Booking[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      getMyServices(),
      getTechnicianRequests(),
    ])
      .then(([serviceData, bookingData]) => {
        if (!active) return;

        setServices(serviceData);
        setRequests(bookingData);
      })
      .catch((err: unknown) => {
        if (!active) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard"
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const approved = services.filter(
    (service) =>
      service.approvalStatus === "approved"
  ).length;

  const pendingApproval = services.filter(
    (service) =>
      service.approvalStatus === "pending"
  ).length;

  const available = services.filter(
    (service) =>
      service.approvalStatus === "approved" &&
      service.isAvailable
  ).length;

  const pendingRequests = requests.filter(
    (booking) => booking.status === "requested"
  ).length;

  const inProgress = requests.filter(
    (booking) => booking.status === "in-progress"
  ).length;

  const completed = requests.filter(
    (booking) => booking.status === "completed"
  ).length;

  const recent = [...requests]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      label: "Total Services",
      value: services.length,
      icon: Wrench,
    },
    {
      label: "Approved Services",
      value: approved,
      icon: ShieldCheck,
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      icon: ClipboardList,
    },
    {
      label: "Pending Approval",
      value: pendingApproval,
      icon: Clock3,
    },
  ];

  return (
    <section className="space-y-8 pb-12">
      <div>
        <p className="text-sm font-semibold text-primary">
          Technician Workspace
        </p>

        <h1 className="mt-2 text-3xl font-extrabold">
          Technician Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your services and repair requests.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-10">
          <Loader2 className="size-6 animate-spin text-primary" />
          Loading dashboard...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive bg-card p-6 text-destructive"
        >
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-extrabold tabular-nums">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/technician/add-service"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <PlusCircle className="size-4" />
              Add Service
            </Link>

            <Link
              href="/dashboard/technician/my-services"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              My Services
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/dashboard/technician/requests"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              Manage Requests
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold">
                Recent Repair Requests
              </h2>

              {recent.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    No repair requests yet.
                  </p>

                  <Link
                    href="/dashboard/technician/requests"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    View Requests
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {recent.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between gap-3 py-4"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {booking.serviceTitle}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {booking.customerName}
                          {" · "}
                          {booking.preferredDate.slice(
                            0,
                            10
                          )}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-semibold capitalize">
                        {booking.status.replace(
                          "-",
                          " "
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold">
                Job Snapshot
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-3xl font-extrabold text-primary">
                    {inProgress}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Repairs in progress
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-extrabold text-primary">
                    {completed}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Completed repairs
                  </p>
                </div>

                <div>
                  <p className="flex items-center gap-2 text-3xl font-extrabold text-primary">
                    <CheckCircle2 className="size-6" />
                    {available}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Approved and available services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
