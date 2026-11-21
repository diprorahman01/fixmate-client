
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Loader2,
  Wrench,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { useSession } from "@/lib/auth-client";
import { createBooking } from "@/lib/bookings";

type Props = {
  serviceId: string;
  serviceTitle: string;
};

// ==========================================
// REPAIR REQUEST COMPONENT
// ==========================================

export function RequestRepair({
  serviceId,
  serviceTitle,
}: Props) {
  const router = useRouter();

  const { data: session, isPending } =
    useSession();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] =
    useState("");
  const [
    problemDescription,
    setProblemDescription,
  ] = useState("");

  const role = session?.user?.role;

  const signInUrl =
    `/sign-in?callbackURL=${encodeURIComponent(
      `/services/${serviceId}`
    )}`;

  // ========================================
  // VALIDATION AND SUBMISSION
  // ========================================

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!session?.user || role !== "customer") {
      toast.error(
        "Only customers can request repairs"
      );
      return;
    }

    if (phone.trim().length < 7) {
      toast.error("Enter a valid phone number");
      return;
    }

    if (address.trim().length < 10) {
      toast.error(
        "Enter your complete service address"
      );
      return;
    }

    if (problemDescription.trim().length < 20) {
      toast.error(
        "Describe the problem in at least 20 characters"
      );
      return;
    }

    if (!preferredDate) {
      toast.error("Select a preferred date");
      return;
    }

    // Prevent dates before today in the UI.
    // The backend validates this again.
    const today = new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date());

    if (preferredDate < today) {
      toast.error(
        "Preferred date cannot be in the past"
      );
      return;
    }

    setLoading(true);

    try {
      const result = await createBooking({
        serviceId,
        customerPhone: phone.trim(),
        address: address.trim(),
        preferredDate,
        problemDescription:
          problemDescription.trim(),
      });

      toast.success(result.message);

      setOpen(false);

      router.push(
        "/dashboard/customer/bookings"
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit repair request"
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // LOADING SESSION
  // ========================================

  if (isPending) {
    return (
      <button
        type="button"
        disabled
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-primary-foreground opacity-60"
      >
        <Loader2 className="size-4 animate-spin" />
        Checking account...
      </button>
    );
  }

  // ========================================
  // LOGGED-OUT USER
  // ========================================

  if (!session) {
    return (
      <Link
        href={signInUrl}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
      >
        Sign In to Request Repair
        <ArrowRight className="size-4" />
      </Link>
    );
  }

  // ========================================
  // TECHNICIAN / ADMIN
  // ========================================

  if (role !== "customer") {
    return (
      <div className="mt-8 rounded-xl border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
        Only Customer accounts can request
        repair services.
      </div>
    );
  }

  // ========================================
  // CUSTOMER FORM
  // ========================================

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:opacity-90"
      >
        <Wrench className="size-5" />
        Request Repair
        <ArrowRight className="size-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/65 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="request-title"
            className="mx-auto my-6 w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">
                  FixMate Repair Booking
                </p>

                <h2
                  id="request-title"
                  className="mt-2 text-2xl font-extrabold"
                >
                  Request Repair
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  {serviceTitle}
                </p>
              </div>

              <button
                type="button"
                aria-label="Close request form"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-xl border border-border p-2"
              >
                <X className="size-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full Name
                  </label>
                  <input
                    readOnly
                    value={session.user.name}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address
                  </label>
                  <input
                    readOnly
                    value={session.user.email}
                    className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-phone"
                  className="mb-2 block text-sm font-semibold"
                >
                  Phone Number *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  minLength={7}
                  maxLength={25}
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="booking-address"
                  className="mb-2 block text-sm font-semibold"
                >
                  Service Address *
                </label>
                <textarea
                  id="booking-address"
                  required
                  minLength={10}
                  maxLength={300}
                  rows={2}
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="House, road, area and city"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="booking-date"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold"
                >
                  <CalendarDays className="size-4" />
                  Preferred Date *
                </label>
                <input
                  id="booking-date"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(event) =>
                    setPreferredDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="booking-problem"
                  className="mb-2 block text-sm font-semibold"
                >
                  Problem Description *
                </label>
                <textarea
                  id="booking-problem"
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={5}
                  value={problemDescription}
                  onChange={(event) =>
                    setProblemDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe the device problem and any symptoms..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Minimum 20 characters.
                </p>
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
                Payment is not required now.
                You will pay after the repair
                is marked completed.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-primary-foreground disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Repair Request
                    <ArrowRight className="size-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
