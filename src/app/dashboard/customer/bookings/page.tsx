
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  ClipboardList,
  RefreshCw,
  CreditCard,
  CalendarDays,
  Loader2,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import { toast } from "sonner";

import {
  getMyBookings,
  cancelBooking,
  type Booking,
} from "@/lib/bookings";

import {
  createCheckoutSession,
} from "@/lib/payments";

// ==========================================
// HELPERS
// ==========================================

function getError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong";
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function statusStyle(status: string) {
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
// CUSTOMER MY BOOKINGS
// ==========================================

export default function CustomerBookingsPage() {
  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [cancelTarget, setCancelTarget] =
    useState<Booking | null>(null);

  useEffect(() => {
    let active = true;

    getMyBookings()
      .then((data) => {
        if (active) {
          setBookings(data);
          setError("");
        }
      })
      .catch((err: unknown) => {
        if (active) setError(getError(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // ========================================
  // REFRESH BOOKINGS
  // ========================================

  async function refreshBookings() {
    setLoading(true);
    setError("");

    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // CANCEL REQUESTED BOOKING
  // ========================================

  async function handleCancel() {
    if (!cancelTarget || busyId) return;

    const id = cancelTarget._id;
    setBusyId(id);

    try {
      const result = await cancelBooking(id);
      toast.success(result.message);
      setCancelTarget(null);
      await refreshBookings();
    } catch (err) {
      toast.error(getError(err));
      await refreshBookings();
    } finally {
      setBusyId(null);
    }
  }

  // ========================================
  // STRIPE CHECKOUT
  // ========================================

  async function handlePayNow(booking: Booking) {
    if (busyId) return;

    if (
      booking.status !== "completed" ||
      booking.paymentStatus !== "unpaid"
    ) {
      toast.error(
        "This booking is not eligible for payment"
      );
      return;
    }

    setBusyId(booking._id);

    try {
      const result =
        await createCheckoutSession(
          booking._id
        );

      const checkoutUrl = new URL(result.url);

      if (
        checkoutUrl.protocol !== "https:" ||
        !(
          checkoutUrl.hostname === "checkout.stripe.com" ||
          checkoutUrl.hostname.endsWith(
            ".checkout.stripe.com"
          )
        )
      ) {
        throw new Error(
          "Invalid Stripe Checkout destination"
        );
      }

      // Redirect customer to Stripe's
      // hosted secure Checkout.
      window.location.assign(
        checkoutUrl.toString()
      );
    } catch (err) {
      toast.error(getError(err));
      setBusyId(null);
      await refreshBookings();
    }
  }

  // ========================================
  // PAGE UI
  // ========================================

  return (
    <section className="pb-12">
      {/* PAGE HEADER */}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            Customer Workspace
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            My Bookings
          </h1>

          <p className="mt-3 text-muted-foreground">
            Track repairs and pay for completed jobs.
          </p>
        </div>

        <button
          type="button"
          disabled={loading || busyId !== null}
          onClick={() => void refreshBookings()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-muted disabled:opacity-50"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {/* LOADING */}

      {loading ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <Loader2 className="mx-auto mb-4 size-9 animate-spin text-primary" />
          Loading your bookings...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-3xl border border-red-500/30 bg-card p-10 text-center"
        >
          <p className="text-red-600">{error}</p>

          <button
            type="button"
            onClick={() => void refreshBookings()}
            className="mt-5 rounded-xl bg-primary px-6 py-3 text-primary-foreground"
          >
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-14 text-center">
          <ClipboardList className="mx-auto mb-5 size-12 text-primary" />

          <h2 className="text-xl font-bold">
            No Bookings Yet
          </h2>

          <p className="mt-3 text-muted-foreground">
            Your repair requests will appear here.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Explore Repair Services
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              {/* SERVICE DETAILS */}

              <div className="flex flex-col gap-5 p-5 sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.serviceImage}
                  alt={booking.serviceTitle}
                  className="h-44 w-full rounded-2xl bg-muted object-cover sm:w-40"
                />

                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-extrabold">
                    {booking.serviceTitle}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Technician: {booking.technicianName}
                  </p>

                  <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="size-4" />
                    {formatDate(booking.preferredDate)}
                  </p>

                  <p className="mt-4 text-2xl font-extrabold text-primary">
                    ${Number(
                      booking.status === "completed"
                        ? booking.finalAmount
                        : booking.basePrice
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* STATUS BADGES */}

              <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyle(
                    booking.status
                  )}`}
                >
                  {booking.status.replaceAll("-", " ")}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                    booking.paymentStatus === "paid"
                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>

              {/* BOOKING ACTIONS */}

              <div className="space-y-3 border-t border-border p-5">
                {booking.status === "requested" && (
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() => setCancelTarget(booking)}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-600 disabled:opacity-50"
                  >
                    <XCircle className="size-4" />
                    Cancel Request
                  </button>
                )}

                {booking.status === "completed" &&
                  booking.paymentStatus === "unpaid" && (
                    <button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() =>
                        void handlePayNow(booking)
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {busyId === booking._id ? (
                        <>
                          <Loader2 className="size-5 animate-spin" />
                          Redirecting to Stripe...
                        </>
                      ) : (
                        <>
                          <CreditCard className="size-5" />
                          Pay Now — $
                          {Number(
                            booking.finalAmount
                          ).toFixed(2)}
                        </>
                      )}
                    </button>
                  )}

                {booking.paymentStatus === "paid" && (
                  <div className="flex items-center gap-2 rounded-xl bg-green-500/10 p-4 text-sm font-semibold text-green-700 dark:text-green-400">
                    <CheckCircle2 className="size-5" />
                    Payment Completed
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {/* CANCEL CONFIRMATION */}

      {cancelTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            aria-describedby="cancel-description"
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-2xl"
          >
            <h2
              id="cancel-title"
              className="text-xl font-bold"
            >
              Cancel Booking?
            </h2>

            <p
              id="cancel-description"
              className="mt-3 text-sm leading-7 text-muted-foreground"
            >
              Cancel the request for{" "}
              <strong>
                {cancelTarget.serviceTitle}
              </strong>
              ? This cannot be undone.
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() =>
                  setCancelTarget(null)
                }
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold"
              >
                Keep Booking
              </button>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() =>
                  void handleCancel()
                }
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {busyId
                  ? "Cancelling..."
                  : "Cancel Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
