import type { Booking, BookingHistoryEntry } from "@/lib/bookings";
import { Check, Clock3, XCircle } from "lucide-react";

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

function timeLabel(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export function JobTimeline({ booking }: { booking: Booking }) {
  const history: BookingHistoryEntry[] = Array.isArray(booking.statusHistory) ? booking.statusHistory : [];
  const state: StepKey = booking.paymentStatus === "paid" ? "paid" :
    booking.status === "completed" ? "completed" :
    booking.status === "in-progress" ? "in-progress" :
    booking.status === "accepted" ? "accepted" : "requested";
  const activeIndex = STEPS.findIndex((step) => step.key === state);
  const stopped = booking.status === "rejected" || booking.status === "cancelled";
  const stopLabel = booking.status === "rejected" ? "Rejected" : "Cancelled";
  const terminalEvent = [...history].reverse().find((item) => item.status === booking.status);
  const lastEvent = [...history].reverse().find((item) => item.status === "paid");

  return (
    <section aria-label="Repair progress timeline" className="border-t border-border px-5 py-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold">Job Timeline</h3>
        <span className="text-xs text-muted-foreground">{stopped ? stopLabel : `${activeIndex + 1} of 5 steps`}</span>
      </div>
      <ol className="grid grid-cols-5 gap-1 sm:gap-2">
        {STEPS.map((step, index) => {
          const reached = !stopped && index <= activeIndex || stopped && index === 0;
          const current = !stopped && index === activeIndex;
          const event = [...history].reverse().find((item) => item.status === step.key);
          const recorded = Boolean(event);
          const date = timeLabel(event?.changedAt ?? (step.key === "paid" && booking.paymentStatus === "paid" ? booking.paidAt : step.key === "requested" ? booking.createdAt : undefined));
          return (
            <li key={step.key} className="min-w-0 text-center">
              <div className={`mb-2 h-1.5 rounded-full ${reached ? "bg-primary" : "bg-muted"}`} />
              <div aria-current={current ? "step" : undefined} className={`mx-auto flex size-7 items-center justify-center rounded-full border text-xs font-bold ${reached ? "border-primary bg-primary/15 text-primary" : "border-border bg-muted text-muted-foreground"}`}>
                {reached && index < activeIndex && !stopped ? <Check className="size-4" /> : current ? <Clock3 className="size-4" /> : index + 1}
              </div>
              <p className={`mt-2 break-words text-[10px] font-semibold leading-snug sm:text-xs ${reached ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
              {reached && date && <p className="mt-1 break-words text-[9px] leading-tight text-muted-foreground sm:text-[10px]">{date}</p>}
              {reached && !recorded && !date && <p className="mt-1 text-[9px] text-muted-foreground">Earlier step</p>}
            </li>
          );
        })}
      </ol>
      {stopped && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <XCircle className="size-4 shrink-0" />
          {stopLabel}{timeLabel(terminalEvent?.changedAt) ? ` · ${timeLabel(terminalEvent?.changedAt)}` : ""}. This booking cannot proceed to payment.
        </p>
      )}
      {!stopped && booking.paymentStatus === "paid" && lastEvent && (
        <p className="mt-3 text-center text-xs font-semibold text-primary">Payment verified and recorded</p>
      )}
    </section>
  );
}
