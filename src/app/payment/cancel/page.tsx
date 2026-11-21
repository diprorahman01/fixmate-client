
import Link from "next/link";

import {
  XCircle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";

// ==========================================
// STRIPE PAYMENT CANCEL PAGE
// ==========================================

export default function PaymentCancelPage() {
  return (
    <section className="min-h-[75vh] bg-muted/30 px-4 py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500">
          <XCircle className="size-11" />
        </div>

        <h1 className="text-3xl font-extrabold">
          Payment Cancelled
        </h1>

        <p className="mt-5 text-sm leading-8 text-muted-foreground">
          You left Stripe Checkout without
          completing the payment.
          No payment has been confirmed for
          this checkout attempt.
        </p>

        <div className="mt-7 rounded-2xl border border-border bg-muted/30 p-5">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <CreditCard className="size-5 text-primary" />
            Your booking remains unpaid.
          </div>
        </div>

        <Link
          href="/dashboard/customer/bookings"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground"
        >
          <ArrowLeft className="size-4" />
          Try Again — My Bookings
        </Link>
      </div>
    </section>
  );
}
