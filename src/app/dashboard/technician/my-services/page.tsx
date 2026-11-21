
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Wrench,
  Loader2,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

import type { RepairService } from "@/lib/services";

import {
  getMyServices,
  deleteService,
  setServiceAvailability,
} from "@/lib/technician-services";

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong";
}

function getStatusClass(status: string): string {
  switch (status) {
    case "approved":
      return "bg-green-500/10 text-green-700 dark:text-green-400";

    case "rejected":
      return "bg-red-500/10 text-red-700 dark:text-red-400";

    default:
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
  }
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "approved":
      return <CheckCircle2 className="size-4" />;

    case "rejected":
      return <XCircle className="size-4" />;

    default:
      return <Clock3 className="size-4" />;
  }
}

// ==========================================
// MAIN MY SERVICES PAGE
// ==========================================

export default function MyServicesPage() {
  // ========================================
  // STATES
  // ========================================

  const [services, setServices] = useState<
    RepairService[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState<
    string | null
  >(null);

  const [deleteTarget, setDeleteTarget] =
    useState<RepairService | null>(null);

  const [error, setError] = useState("");

  // ========================================
  // INITIAL DATA LOADING
  // ========================================

  useEffect(() => {
    let active = true;

    getMyServices()
      .then((data) => {
        if (!active) return;

        setServices(data);
        setError("");
      })
      .catch((err: unknown) => {
        if (!active) return;

        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!active) return;

        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // ========================================
  // REFRESH SERVICES
  // ========================================

  async function loadServices() {
    setLoading(true);
    setError("");

    try {
      const data = await getMyServices();

      setServices(data);
    } catch (err) {
      const message = getErrorMessage(err);

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // TOGGLE SERVICE AVAILABILITY
  // ========================================

  async function toggleAvailability(
    service: RepairService
  ) {
    if (busyId) return;

    setBusyId(service._id);

    try {
      const newAvailability =
        !service.isAvailable;

      await setServiceAvailability(
        service._id,
        newAvailability
      );

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? {
                ...item,
                isAvailable: newAvailability,
              }
            : item
        )
      );

      toast.success(
        newAvailability
          ? "Service is now available"
          : "Service is now unavailable"
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  // ========================================
  // DELETE SERVICE
  // ========================================

  async function confirmDelete() {
    if (!deleteTarget || busyId) return;

    const serviceId = deleteTarget._id;

    setBusyId(serviceId);

    try {
      await deleteService(serviceId);

      setServices((previous) =>
        previous.filter(
          (service) => service._id !== serviceId
        )
      );

      setDeleteTarget(null);

      toast.success(
        "Service deleted successfully"
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  // ========================================
  // SERVICE COUNTS
  // ========================================

  const totalServices = services.length;

  const approvedServices = services.filter(
    (service) =>
      service.approvalStatus === "approved"
  ).length;

  const pendingServices = services.filter(
    (service) =>
      service.approvalStatus === "pending"
  ).length;

  const availableServices = services.filter(
    (service) => service.isAvailable
  ).length;

  // ========================================
  // PAGE UI
  // ========================================

  return (
    <section className="min-h-screen bg-muted/30 py-8 sm:py-12">
      <div className="fixmate-container">

        {/* ==================================
            PAGE HEADER
        ================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-primary">
              Technician Workspace
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              My Services
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Create, update and manage your
              repair service listings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                void loadServices();
              }}
              disabled={loading || busyId !== null}
              aria-label="Refresh services"
              title="Refresh services"
              className="inline-flex size-12 items-center justify-center rounded-xl border border-border bg-card transition-colors hover:bg-muted disabled:opacity-50"
            >
              <RefreshCw
                className={`size-5 ${
                  loading ? "animate-spin" : ""
                }`}
              />
            </button>

            <Link
              href="/dashboard/technician/add-service"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="size-5" />
              Add Service
            </Link>
          </div>
        </div>

        {/* ==================================
            SUMMARY CARDS
        ================================== */}

        {!loading && !error && (
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <SummaryCard
              label="Total Services"
              value={totalServices}
              icon={<Wrench className="size-5" />}
            />

            <SummaryCard
              label="Approved"
              value={approvedServices}
              icon={
                <CheckCircle2 className="size-5" />
              }
            />

            <SummaryCard
              label="Pending"
              value={pendingServices}
              icon={<Clock3 className="size-5" />}
            />

            <SummaryCard
              label="Available"
              value={availableServices}
              icon={
                <CheckCircle2 className="size-5" />
              }
            />
          </div>
        )}

        {/* ==================================
            LOADING STATE
        ================================== */}

        {loading ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <Loader2 className="mx-auto mb-5 size-10 animate-spin text-primary" />

            <h2 className="text-lg font-semibold">
              Loading your services...
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Fetching your repair service listings.
            </p>
          </div>
        ) : error ? (
          /* ================================
             ERROR STATE
          ================================= */

          <div
            role="alert"
            className="rounded-3xl border border-red-500/30 bg-card p-10 text-center"
          >
            <XCircle className="mx-auto mb-4 size-10 text-red-500" />

            <h2 className="text-xl font-bold">
              Unable to load services
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadServices();
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              <RefreshCw className="size-4" />
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          /* ================================
             EMPTY STATE
          ================================= */

          <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center">
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Wrench className="size-10" />
            </div>

            <h2 className="text-2xl font-bold">
              No Services Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              You have not created any repair services.
              Add your first listing and submit it
              for admin approval.
            </p>

            <Link
              href="/dashboard/technician/add-service"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              <Plus className="size-5" />
              Add Your First Service
            </Link>
          </div>
        ) : (
          /* ================================
             SERVICE LIST
          ================================= */

          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
              >
                {/* SERVICE IMAGE AND DETAILS */}

                <div className="flex flex-col gap-5 p-5 sm:flex-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-48 w-full rounded-2xl bg-muted object-cover sm:h-40 sm:w-44"
                  />

                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusClass(
                        service.approvalStatus
                      )}`}
                    >
                      <StatusIcon
                        status={service.approvalStatus}
                      />

                      {service.approvalStatus}
                    </span>

                    <h2 className="mt-3 text-lg font-bold">
                      {service.title}
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {service.category}
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {service.serviceMode}
                    </p>

                    <p className="mt-3 text-2xl font-extrabold text-primary">
                      ${service.basePrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* APPROVAL INFORMATION */}

                {service.approvalStatus ===
                  "pending" && (
                  <div className="mx-5 mb-4 rounded-xl bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
                    This service is waiting for
                    admin approval.
                  </div>
                )}

                {service.approvalStatus ===
                  "rejected" && (
                  <div className="mx-5 mb-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-400">
                    This service was rejected.
                    You can edit and resubmit it.
                  </div>
                )}

                {/* AVAILABILITY TOGGLE */}

                <div className="flex items-center justify-between border-t border-border px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Service Availability
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {service.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-label={`Availability for ${service.title}`}
                    aria-checked={service.isAvailable}
                    disabled={busyId !== null}
                    onClick={() => {
                      void toggleAvailability(service);
                    }}
                    className={`relative h-7 w-12 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                      service.isAvailable
                        ? "bg-primary"
                        : "bg-muted-foreground/40"
                    }`}
                  >
                    <span
                      className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-all ${
                        service.isAvailable
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* ACTION BUTTONS */}

                <div className="flex gap-3 border-t border-border p-5">
                  <Link
                    href={`/dashboard/technician/edit-service/${service._id}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() =>
                      setDeleteTarget(service)
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* ==================================
          DELETE CONFIRMATION DIALOG
      ================================== */}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-2xl"
          >
            <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <Trash2 className="size-7" />
            </div>

            <h2
              id="delete-title"
              className="text-xl font-bold"
            >
              Delete Service?
            </h2>

            <p
              id="delete-description"
              className="mt-3 text-sm leading-7 text-muted-foreground"
            >
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.title}</strong>?
              {" "}This action cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => {
                  void confirmDelete();
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busyId ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="size-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// ==========================================
// REUSABLE SUMMARY CARD
// ==========================================

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>

      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold">
        {value}
      </p>
    </div>
  );
}
