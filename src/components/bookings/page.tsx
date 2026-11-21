
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  RefreshCw,
  XCircle,
  Loader2,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";

import {
  cancelBooking,
  getMyBookings,
  type Booking,
} from "@/lib/bookings";

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

function statusColor(status: string) {
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

export default function MyBookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancelTarget, setCancelTarget] =
    useState<Booking | null>(null);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    getMyBookings()
      .then((data) => {
        if (!active) return;
        setBookings(data);
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
  }, []);

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      setBookings(await getMyBookings());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function confirmCancel() {
    if (!cancelTarget || busy) return;

    const id = cancelTarget._id;
    setBusy(true);

    try {
      const result = await cancelBooking(id);

      toast.success(result.message);
      setCancelTarget(null);
      await refresh();
    } catch (err) {
      toast.error(errorMessage(err));
      setCancelTarget(null);
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="pb-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">
            My Bookings
          </h1>

          <p className="mt-2 text-muted-foreground">
            Track and manage your repair requests.
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary" />
          Loading bookings...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-card p-8 text-red-600"
        >
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <ClipboardList className="mx-auto mb-5 size-12 text-primary" />

          <h2 className="text-xl font-bold">
            No Repair Requests Yet
          </h2>

          <p className="mt-3 text-muted-foreground">
            Browse services and send your first request.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.serviceImage}
                  alt={booking.serviceTitle}
                  className="h-40 w-full rounded-xl bg-muted object-cover sm:w-36"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold">
                    {booking.serviceTitle}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Technician: {booking.technicianName}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    {dateLabel(booking.preferredDate)}
                  </p>

                  <p className="mt-3 text-xl font-extrabold text-primary">
                    ${Number(
                      booking.status === "completed"
                        ? booking.finalAmount
                        : booking.basePrice
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.replaceAll("-", " ")}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>

              <div className="border-t border-border p-5">
                {booking.status === "requested" && (
                  <button
                    type="button"
                    onClick={() =>
                      setCancelTarget(booking)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-600"
                  >
                    <XCircle className="size-4" />
                    Cancel Request
                  </button>
                )}

                {booking.status === "completed" &&
                  booking.paymentStatus === "unpaid" && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <CreditCard className="size-4 text-primary" />
                        Ready for Payment
                      </p>

                      <p className="mt-2 text-xs text-muted-foreground">
                        Your repair is completed.
                        Stripe Checkout will be enabled
                        in the payment session.
                      </p>
                    </div>
                  )}

                {booking.paymentStatus === "paid" && (
                  <p className="font-semibold text-green-600">
                    Payment Completed
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}

      {cancelTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            aria-describedby="cancel-description"
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-xl"
          >
            <h2
              id="cancel-title"
              className="text-xl font-bold"
            >
              Cancel Repair Request?
            </h2>

            <p
              id="cancel-description"
              className="mt-3 text-sm text-muted-foreground"
            >
              Cancel{" "}
              <strong>
                {cancelTarget.serviceTitle}
              </strong>
              ? This cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setCancelTarget(null)}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold"
              >
                Keep Request
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmCancel()}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busy ? "Cancelling..." : "Cancel Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
