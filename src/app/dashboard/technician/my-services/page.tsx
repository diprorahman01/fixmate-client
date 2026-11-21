
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Wrench,
} from "lucide-react";

import { toast } from "sonner";
import type { RepairService } from "@/lib/services";

import {
  deleteService,
  getMyServices,
  setServiceAvailability,
} from "@/lib/technician-services";

export default function MyServicesPage() {
  const [services, setServices] =
    useState<RepairService[]>([]);

  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<RepairService | null>(null);

  const loadServices = useCallback(async () => {
    try {
      const data = await getMyServices();
      setServices(data);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load services"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices]);

  async function toggleAvailability(
    service: RepairService
  ) {
    setBusyId(service._id);

    try {
      await setServiceAvailability(
        service._id,
        !service.isAvailable
      );

      toast.success("Availability updated");
      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update availability"
      );
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setBusyId(deleteTarget._id);

    try {
      await deleteService(deleteTarget._id);

      toast.success("Service deleted successfully");
      setDeleteTarget(null);

      await loadServices();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete service"
      );
    } finally {
      setBusyId(null);
    }
  }

  const statusClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
    }
  };

  return (
    <section className="min-h-screen bg-muted/30 py-12">
      <div className="fixmate-container">
        {/* PAGE HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">
              My Services
            </h1>
            <p className="mt-2 text-muted-foreground">
              Manage your repair listings.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void loadServices();
              }}
              className="rounded-xl border border-border bg-card p-3"
              aria-label="Refresh services"
            >
              <RefreshCw className="size-5" />
            </button>

            <Link
              href="/dashboard/technician/add-service"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              <Plus className="size-5" />
              Add Service
            </Link>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          // EMPTY STATE
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <Wrench className="mx-auto mb-5 size-12 text-primary" />
            <h2 className="text-xl font-bold">
              No services yet
            </h2>
            <p className="mt-3 text-muted-foreground">
              Add your first repair service to get started.
            </p>

            <Link
              href="/dashboard/technician/add-service"
              className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
            >
              Add Your First Service
            </Link>
          </div>
        ) : (
          // SERVICE LIST
          <div className="grid gap-5 lg:grid-cols-2">
            {services.map((service) => (
              <article
                key={service._id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="flex flex-col gap-5 p-5 sm:flex-row">
                  {/* Service image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-40 w-full rounded-xl object-cover sm:w-44"
                  />

                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass(
                        service.approvalStatus
                      )}`}
                    >
                      {service.approvalStatus}
                    </span>

                    <h2 className="mt-3 text-lg font-bold">
                      {service.title}
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      {service.category}
                    </p>

                    <p className="mt-3 text-xl font-bold">
                      ${service.basePrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border px-5 py-4">
                  <span className="text-sm font-medium">
                    Available for booking
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={service.isAvailable}
                    disabled={busyId === service._id}
                    onClick={() =>
                      void toggleAvailability(service)
                    }
                    className={`relative h-7 w-12 rounded-full transition-colors ${
                      service.isAvailable
                        ? "bg-primary"
                        : "bg-muted-foreground/40"
                    }`}
                  >
                    <span
                      className={`absolute top-1 size-5 rounded-full bg-white transition-all ${
                        service.isAvailable
                          ? "left-6"
                          : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-3 border-t border-border p-5">
                  <Link
                    href={`/dashboard/technician/edit-service/${service._id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-muted"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Link>

                  <button
                    type="button"
                    disabled={busyId === service._id}
                    onClick={() =>
                      setDeleteTarget(service)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/30 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-500/10"
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

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div
          role="presentation"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-description"
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-2xl"
          >
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
              Are you sure you want to delete
              "{deleteTarget.title}"? This action
              cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="rounded-xl border border-border px-5 py-3 font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => void confirmDelete()}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {busyId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
