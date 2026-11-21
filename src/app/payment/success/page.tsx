
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  CreditCard,
} from "lucide-react";

import {
  verifyPayment,
  type Payment,
} from "@/lib/payments";

// ==========================================
// PAYMENT SUCCESS PAGE
// ==========================================

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center">
          Loading payment verification...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const params = useSearchParams();

  const sessionId =
    params.get("session_id") || "";

  const [payment, setPayment] =
    useState<Payment | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    if (!sessionId) {
      return;
    }

    verifyPayment(sessionId)
      .then((result) => {
        if (active) {
          setPayment(result.payment);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to verify payment"
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sessionId]);

  const hasError = !sessionId || Boolean(error);

  return (
    <section className="min-h-[75vh] bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
        {loading && !hasError ? (
          <>
            <Loader2 className="mx-auto mb-6 size-14 animate-spin text-primary" />
            <h1 className="text-2xl font-bold">
              Verifying Your Payment
            </h1>
            <p className="mt-4 text-muted-foreground">
              Checking your payment directly
              with Stripe.
            </p>
          </>
        ) : hasError ? (
          <>
            <AlertCircle className="mx-auto mb-6 size-14 text-amber-500" />

            <h1 className="text-2xl font-bold">
              Payment Verification Pending
            </h1>

            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {error ||
                "No Stripe Checkout session was provided."}
            </p>

            <p className="mt-3 text-sm text-muted-foreground">
              If Stripe already charged your test
              card, do not start another payment.
              Return to this page to retry
              verification.
            </p>
          </>
        ) : payment ? (
          <>
            <CheckCircle2 className="mx-auto mb-6 size-16 text-green-500" />

            <h1 className="text-3xl font-extrabold">
              Payment Successful!
            </h1>

            <p className="mt-4 text-muted-foreground">
              Your FixMate repair payment has
              been verified successfully.
            </p>

            <div className="mt-8 space-y-4 rounded-2xl bg-muted/50 p-6 text-left">
              <Info
                label="Service"
                value={payment.serviceTitle}
              />

              <Info
                label="Amount Paid"
                value={`$${payment.amount.toFixed(2)}`}
              />

              <Info
                label="Transaction ID"
                value={payment.transactionId}
              />
            </div>
          </>
        ) : null}

        <Link
          href="/dashboard/customer/bookings"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground"
        >
          Back to My Bookings
          <ArrowRight className="size-4" />
        </Link>

        {payment && (
          <Link
            href="/dashboard/customer/payments"
            className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-primary"
          >
            <CreditCard className="size-4" />
            View Payment History
          </Link>
        )}
      </div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-all font-semibold">
        {value}
      </p>
    </div>
  );
}
