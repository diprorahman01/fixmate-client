
"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Play,
  Wrench,
  RefreshCw,
  Loader2,
  ClipboardList,
  CalendarDays,
  MapPin,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

import {
  getTechnicianRequests,
  updateBookingStatus,
  type Booking,
  type BookingStatus,
} from "@/lib/bookings";

type RequestFilter =
  | "all"
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "rejected"
  | "cancelled";

const filters: RequestFilter[] = [
  "all",
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
];

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong";
}

function dateLabel(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function statusClass(status: BookingStatus) {
  if (status === "completed") {
    return "bg-green-500/10 text-green-700 dark:text-green-400";
  }

  if (
    status === "rejected" ||
    status === "cancelled"
  ) {
    return "bg-red-500/10 text-red-700 dark:text-red-400";
  }

  return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
}

// ==========================================
// TECHNICIAN REQUESTS PAGE
// ==========================================

export default function TechnicianRequestsPage() {
  const [requests, setRequests] =
    useState<Booking[]>([]);

  const [filter, setFilter] =
    useState<RequestFilter>("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busy, setBusy] = useState(false);

  const [action, setAction] = useState<{
    booking: Booking;
    nextStatus: BookingStatus;
  } | null>(null);

  const [finalAmount, setFinalAmount] =
    useState("");

  // ========================================
  // INITIAL FETCH AND FILTER
  // ========================================

  useEffect(() => {
    let active = true;

    getTechnicianRequests(filter)
      .then((data) => {
        if (!active) return;
        setRequests(data);
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

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      setRequests(
        await getTechnicianRequests(filter)
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // OPEN ACTION CONFIRMATION
  // ========================================

  function openAction(
    booking: Booking,
    nextStatus: BookingStatus
  ) {
    setFinalAmount(
      String(booking.basePrice)
    );

    setAction({
      booking,
      nextStatus,
    });
  }

  // ========================================
  // CONFIRM STATUS CHANGE
  // ========================================

  async function confirmAction() {
    if (!action || busy) return;

    const { booking, nextStatus } = action;

    let amount: number | undefined;

    if (nextStatus === "completed") {
      amount = Number(finalAmount);

      if (
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 1000000
      ) {
        toast.error(
          "Enter a valid final amount greater than zero"
        );
        return;
      }
    }

    setBusy(true);

    try {
      const result = await updateBookingStatus(
        booking._id,
        nextStatus,
        amount
      );

      toast.success(result.message);
      setAction(null);
      await refresh();
    } catch (err) {
      toast.error(errorMessage(err));

      // A stale status may have changed
      // since this page was loaded.
      setAction(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <section className="min-h-screen bg-muted/30 py-10">
      <div className="fixmate-container">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              Technician Workspace
            </p>

            <h1 className="mt-2 text-3xl font-extrabold">
              Manage Requests
            </h1>

            <p className="mt-3 text-muted-foreground">
              Accept requests, track repairs and
              set final amounts.
            </p>
          </div>

          <button
            type="button"
            disabled={loading || busy}
            onClick={() => void refresh()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            <RefreshCw className="size-4" />
            Refresh
          </button>
        </div>

        {/* STATUS FILTERS */}

        <div className="mb-7 flex flex-wrap gap-2">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              aria-pressed={filter === status}
              disabled={busy}
              onClick={() => {
                if (filter !== status) {
                  setLoading(true);
                  setFilter(status);
                }
              }}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold capitalize ${
                filter === status
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              {status.replaceAll("-", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Loader2 className="mx-auto mb-4 size-8 animate-spin text-primary" />
            Loading repair requests...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-500/30 bg-card p-8"
          >
            <p className="text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-4 rounded-xl bg-primary px-5 py-3 text-primary-foreground"
            >
              Try Again
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-14 text-center">
            <ClipboardList className="mx-auto mb-5 size-12 text-primary" />

            <h2 className="text-xl font-bold">
              No Matching Requests
            </h2>

            <p className="mt-3 text-muted-foreground">
              Requests from customers will
              appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {requests.map((booking) => (
              <article
                key={booking._id}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">
                      {booking.serviceTitle}
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Customer: {booking.customerName}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status.replaceAll("-", " ")}
                  </span>
                </div>

                <div className="space-y-3 border-t border-border py-5 text-sm">
                  <p className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-primary" />
                    {booking.customerPhone}
                  </p>

                  <p className="flex items-start gap-3">
                    <MapPin className="mt-1 size-4 shrink-0 text-primary" />
                    {booking.address}
                  </p>

                  <p className="flex items-center gap-3">
                    <CalendarDays className="size-4 shrink-0 text-primary" />
                    {dateLabel(booking.preferredDate)}
                  </p>

                  <div className="rounded-xl bg-muted/50 p-4">
                    <p className="mb-2 font-semibold">
                      Problem Description
                    </p>
                    <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
                      {booking.problemDescription}
                    </p>
                  </div>

                  <p className="font-semibold">
                    Starting Price: $
                    {Number(booking.basePrice).toFixed(2)}
                  </p>

                  {booking.status === "completed" && (
                    <p className="font-semibold">
                      Final Amount: $
                      {Number(booking.finalAmount).toFixed(2)}
                    </p>
                  )}

                  <p className="text-sm capitalize text-muted-foreground">
                    Payment: {booking.paymentStatus}
                  </p>
                </div>

                {/* VALID ACTIONS ONLY */}

                <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                  {booking.status === "requested" && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          openAction(booking, "accepted")
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                      >
                        <CheckCircle2 className="size-4" />
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openAction(booking, "rejected")
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-600"
                      >
                        <XCircle className="size-4" />
                        Reject
                      </button>
                    </>
                  )}

                  {booking.status === "accepted" && (
                    <button
                      type="button"
                      onClick={() =>
                        openAction(
                          booking,
                          "in-progress"
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      <Play className="size-4" />
                      Start Work
                    </button>
                  )}

                  {booking.status === "in-progress" && (
                    <button
                      type="button"
                      onClick={() =>
                        openAction(booking, "completed")
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      <Wrench className="size-4" />
                      Mark Completed
                    </button>
                  )}

                  {["completed", "rejected", "cancelled"].includes(
                    booking.status
                  ) && (
                    <span className="text-sm text-muted-foreground">
                      No further job actions available
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* STATUS CONFIRMATION MODAL */}

      {action && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="action-title"
            aria-describedby="action-description"
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-xl"
          >
            <h2
              id="action-title"
              className="text-xl font-bold"
            >
              Confirm Job Update
            </h2>

            <p
              id="action-description"
              className="mt-3 text-sm leading-7 text-muted-foreground"
            >
              Change{" "}
              <strong>
                {action.booking.serviceTitle}
              </strong>{" "}
              to{" "}
              <strong>
                {action.nextStatus.replaceAll(
                  "-",
                  " "
                )}
              </strong>
              ?
            </p>

            {action.nextStatus === "completed" && (
              <div className="mt-6">
                <label
                  htmlFor="final-amount"
                  className="mb-2 block text-sm font-semibold"
                >
                  Final Amount (USD) *
                </label>

                <input
                  id="final-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={finalAmount}
                  onChange={(event) =>
                    setFinalAmount(event.target.value)
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />

                <p className="mt-2 text-xs text-muted-foreground">
                  The customer will pay this
                  amount after completion.
                </p>
              </div>
            )}

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setAction(null)}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmAction()}
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {busy ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
