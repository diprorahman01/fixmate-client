
"use client";

import { useEffect, useState } from "react";

import {
  CreditCard,
  Loader2,
  RefreshCw,
  DollarSign,
} from "lucide-react";

import {
  getTransactions,
  type TransactionSummary,
} from "@/lib/payments";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ==========================================
// ADMIN TRANSACTIONS
// ==========================================

export default function AdminTransactionsPage() {
  const [data, setData] =
    useState<TransactionSummary | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getTransactions()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load transactions"
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

  async function refresh() {
    setLoading(true);
    setError("");

    try {
      setData(await getTransactions());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load transactions"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="pb-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            Platform Finance
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Transactions
          </h1>

          <p className="mt-3 text-muted-foreground">
            Monitor verified payment transactions
            across FixMate.
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Loader2 className="mx-auto mb-3 size-8 animate-spin text-primary" />
          Loading transactions...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-card p-8 text-red-600"
        >
          {error}
        </div>
      ) : data ? (
        <>
          {/* REVENUE CARD */}

          <div className="mb-8 rounded-3xl border border-border bg-card p-7 shadow-sm">
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <DollarSign className="size-6" />
            </div>

            <p className="text-sm text-muted-foreground">
              Total Revenue — Stripe Test Mode
            </p>

            <p className="mt-3 text-4xl font-extrabold">
              ${data.totalRevenue.toFixed(2)}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              {data.payments.length} verified transactions
            </p>
          </div>

          {data.payments.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-12 text-center">
              <CreditCard className="mx-auto mb-5 size-12 text-primary" />
              <h2 className="text-xl font-bold">
                No Transactions Yet
              </h2>
              <p className="mt-3 text-muted-foreground">
                Verified Stripe payments will
                appear here.
              </p>
            </div>
          ) : (
            /* TRANSACTIONS TABLE */

            <div className="overflow-x-auto rounded-3xl border border-border bg-card shadow-sm">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {[
                      "Service",
                      "Customer",
                      "Technician",
                      "Amount",
                      "Transaction ID",
                      "Payment Date",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 font-semibold"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {data.payments.map((payment) => (
                    <tr
                      key={payment._id}
                      className="border-t border-border"
                    >
                      <td className="px-5 py-4 font-semibold">
                        {payment.serviceTitle}
                      </td>

                      <td className="px-5 py-4">
                        {payment.customerName}
                        <p className="mt-1 text-xs text-muted-foreground">
                          {payment.customerEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        {payment.technicianName}
                      </td>

                      <td className="px-5 py-4 font-bold">
                        ${payment.amount.toFixed(2)}
                      </td>

                      <td className="max-w-[230px] break-all px-5 py-4 font-mono text-xs">
                        {payment.transactionId}
                      </td>

                      <td className="px-5 py-4 text-muted-foreground">
                        {formatDate(payment.paidAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </section>
  );
}
