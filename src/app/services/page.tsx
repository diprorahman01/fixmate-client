
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import {
  getAdminServices,
  reviewService,
  type AdminService,
  type ApprovalStatus,
} from "@/lib/admin";

const filters: ApprovalStatus[] = [
  "pending",
  "all",
  "approved",
  "rejected",
];

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong";
}

// ==========================================
// SERVICE APPROVAL PAGE
// ==========================================

export default function ServiceApprovalPage() {
  const [filter, setFilter] =
    useState<ApprovalStatus>("pending");

  const [services, setServices] =
    useState<AdminService[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [confirmAction, setConfirmAction] =
    useState<{
      service: AdminService;
      status: "approved" | "rejected";
    } | null>(null);

  // ========================================
  // FETCH SERVICES
  // ========================================

  useEffect(() => {
    let active = true;

    getAdminServices(filter)
      .then((data) => {
        if (!active) return;
        setServices(data);
        setError("");
      })
      .catch((err: unknown) => {
        if (active) setError(errorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filter]);

  const refreshServices = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAdminServices(filter);
      setServices(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // ========================================
  // APPROVE OR REJECT
  // ========================================

  async function confirmReview() {
    if (!confirmAction || busyId) return;

    const { service, status } = confirmAction;
    setBusyId(service._id);

    try {
      const result = await reviewService(
        service._id,
        status
      );

      toast.success(result.message);
      setConfirmAction(null);

      // An approved/rejected service should
      // leave the Pending filter immediately.
      setServices((previous) =>
        filter === "pending"
          ? previous.filter(
              (item) => item._id !== service._id
            )
          : previous.map((item) =>
              item._id === service._id
                ? {
                    ...item,
                    approvalStatus: status,
                  }
                : item
            )
      );

      // Refresh for canonical database state.
      await refreshServices();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  }

  const pendingCount = services.filter(
    (service) =>
      service.approvalStatus === "pending"
  ).length;

  return (
    <section className="pb-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <ShieldCheck className="size-4" />
            Admin Moderation
          </div>

          <h1 className="text-3xl font-extrabold">
            Service Approval
          </h1>

          <p className="mt-3 text-muted-foreground">
            Review repair services submitted
            by technicians.
          </p>
        </div>

        <button
          type="button"
          disabled={loading || busyId !== null}
          onClick={() => void refreshServices()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {/* STATUS FILTERS */}

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((status) => (
          <button
            key={status}
            type="button"
            disabled={busyId !== null}
            aria-pressed={filter === status}
            onClick={() => {
              if (filter !== status) {
                setLoading(true);
                setFilter(status);
              }
            }}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              filter === status
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:bg-muted"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {!loading && !error && (
        <p className="mb-5 text-sm text-muted-foreground">
          Showing {services.length} services
          {filter === "all"
            ? ` (${pendingCount} pending)`
            : ""}
        </p>
      )}

      {/* LOADING / ERROR / EMPTY */}

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary" />
          Loading service approvals...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-card p-10 text-center"
        >
          <p className="font-semibold text-red-600">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void refreshServices()}
            className="mt-4 rounded-xl bg-primary px-5 py-3 text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-14 text-center">
          <CheckCircle2 className="mx-auto mb-4 size-12 text-primary" />
          <h2 className="text-xl font-bold">
            No matching services
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            There are no services in this status.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {services.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className="flex flex-col gap-6 p-5 md:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-52 w-full rounded-2xl bg-muted object-cover md:w-56"
                />

                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        service.approvalStatus === "approved"
                          ? "bg-green-500/10 text-green-700 dark:text-green-400"
                          : service.approvalStatus === "rejected"
                            ? "bg-red-500/10 text-red-700 dark:text-red-400"
                            : "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {service.approvalStatus}
                    </span>

                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                      {service.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold">
                    {service.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.category} · {service.serviceMode}
                  </p>

                  <p className="mt-3 text-sm">
                    <strong>Technician:</strong>{" "}
                    {service.technicianName}
                  </p>

                  <p className="mt-1 break-all text-sm text-muted-foreground">
                    {service.technicianEmail}
                  </p>

                  <p className="mt-2 text-sm">
                    <strong>Service area:</strong>{" "}
                    {service.serviceArea}
                  </p>

                  <p className="mt-1 text-sm">
                    <strong>Duration:</strong>{" "}
                    {service.estimatedDuration}
                  </p>

                  <p className="mt-3 text-2xl font-extrabold text-primary">
                    ${Number(service.basePrice).toFixed(2)}
                  </p>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* ADMIN ACTIONS */}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border p-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {service.approvalStatus === "pending" ? (
                    <Clock3 className="size-4" />
                  ) : (
                    <CheckCircle2 className="size-4" />
                  )}
                  {service.approvalStatus === "pending"
                    ? "Awaiting review"
                    : "Reviewed"}
                </div>

                {service.approvalStatus === "pending" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        setConfirmAction({
                          service,
                          status: "rejected",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      <XCircle className="size-4" />
                      Reject
                    </button>

                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        setConfirmAction({
                          service,
                          status: "approved",
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      <CheckCircle2 className="size-4" />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* REVIEW CONFIRMATION */}

      {confirmAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="review-title"
            aria-describedby="review-description"
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-2xl"
          >
            <h2
              id="review-title"
              className="text-xl font-bold"
            >
              {confirmAction.status === "approved"
                ? "Approve Service?"
                : "Reject Service?"}
            </h2>

            <p
              id="review-description"
              className="mt-3 text-sm leading-7 text-muted-foreground"
            >
              You are about to{" "}
              <strong>{confirmAction.status}</strong>{" "}
              the service{" "}
              <strong>
                {confirmAction.service.title}
              </strong>
              .
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() =>
                  setConfirmAction(null)
                }
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() =>
                  void confirmReview()
                }
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {busyId
                  ? "Saving..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
