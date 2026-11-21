
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  CreditCard,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import {
  getPaymentHistory,
  type Payment,
} from "@/lib/payments";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ==========================================
// CUSTOMER PAYMENT HISTORY
// ==========================================

export default function PaymentHistoryPage() {
  const [payments, setPayments] =
    useState<Payment[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getPaymentHistory()
      .then((data) => {
        if (active) setPayments(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load payments"
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

  const totalPaid = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  return (
    <section className="pb-12">
      <div className="mb-8">
        <p className="text-sm font-semibold text-primary">
          Customer Workspace
        </p>

        <h1 className="mt-2 text-3xl font-extrabold">
          Payment History
        </h1>

        <p className="mt-3 text-muted-foreground">
          View your verified FixMate payments.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary" />
          Loading payments...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-card p-8 text-red-600"
        >
          {error}
        </div>
      ) : (
        <>
          <div className="mb-8 rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="size-6" />
            </div>

            <p className="text-sm text-muted-foreground">
              Total Paid
            </p>

            <p className="mt-2 text-4xl font-extrabold">
              ${totalPaid.toFixed(2)}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {payments.length} verified transactions
            </p>
          </div>

          {payments.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center">
              <CreditCard className="mx-auto mb-5 size-12 text-primary" />

              <h2 className="text-xl font-bold">
                No Payments Yet
              </h2>

              <p className="mt-3 text-muted-foreground">
                Completed repair payments will
                appear here.
              </p>

              <Link
                href="/dashboard/customer/bookings"
                className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground"
              >
                My Bookings
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <article
                  key={payment._id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold">
                        {payment.serviceTitle}
                      </h2>

                      <p className="mt-2 text-sm text-muted-foreground">
                        Technician: {payment.technicianName}
                      </p>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {formatDate(payment.paidAt)}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400">
                      <CheckCircle2 className="size-4" />
                      Paid
                    </span>
                  </div>

                  <div className="mt-5 border-t border-border pt-5">
                    <p className="text-2xl font-extrabold text-primary">
                      ${payment.amount.toFixed(2)}
                    </p>

                    <p className="mt-3 break-all text-xs text-muted-foreground">
                      Transaction ID:{" "}
                      {payment.transactionId}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
